const ForumPost = require('../models/ForumPost');
const User = require('../models/User');

/**
 * @desc    Get all forum posts
 * @route   GET /api/forum
 * @access  Public
 */
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Get a single forum post by ID
 * @route   GET /api/forum/:postId
 * @access  Public
 */
exports.getPostById = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ status: 'fail', message: 'Post not found' });
        }
        res.status(200).json({ status: 'success', data: { post } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Create a new forum post
 * @route   POST /api/forum
 * @access  Private
 */
exports.createPost = async (req, res) => {
    try {
        const authorId = req.user.id;
        const { title, content } = req.body;
        const postData = { title, content, author: authorId };
        const post = await ForumPost.create(postData);

        // --- Award Points ---
        User.findByIdAndUpdate(authorId, { $inc: { points: 5 } }).catch(err => console.error(err)); 

        res.status(201).json({ status: 'success', data: { post } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Add a reply to a forum post
 * @route   POST /api/forum/:postId/replies
 * @access  Private
 */
exports.addReply = async (req, res) => {
    try {
        const replierId = req.user.id;
        const { content } = req.body;
        const postId = req.params.postId;

        const post = await ForumPost.findById(postId).populate('author', 'id');
        if (!post) {
            return res.status(404).json({ status: 'fail', message: 'Post not found' });
        }
        
        const postAuthorId = post.author.id.toString();

        // Create and add the reply
        const reply = { author: replierId, content: content };
        post.replies.unshift(reply);
        await post.save();
        
        // --- Gamification for Replier ---
        User.findByIdAndUpdate(replierId, { $inc: { points: 1 } }).catch(err => console.error(err));
        
        // --- REAL-TIME NOTIFICATION ---
        if (postAuthorId !== replierId) {
            const authorSocketId = req.onlineUsers.get(postAuthorId); 
            if (authorSocketId) {
                req.io.to(authorSocketId).emit('new_notification', {
                    type: 'new_reply',
                    message: `${req.user.name} replied to your post: "${post.title.substring(0, 20)}..."`,
                    link: `/forum/${post._id}`
                });
                console.log(`📨 Sent 'new_reply' notification to user ${postAuthorId} at socket ${authorSocketId}`);
            } else {
                 console.log(`User ${postAuthorId} is offline. No notification sent.`);
            }
        }
        // --- END NOTIFICATION ---

        await post.populate({ path: 'replies.author', select: 'name' }); 
        
        res.status(201).json({ status: 'success', data: { post } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};