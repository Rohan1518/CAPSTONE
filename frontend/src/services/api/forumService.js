import axios from 'axios';

const API_URL = 'http://localhost:5000/api/forum/';

/**
 * @desc    Get all forum posts
 * @access  Public
 */
const getAllPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        throw error.response?.data?.message || 'Error fetching posts';
    }
};

/**
 * @desc    Get a single forum post by ID
 * @access  Public
 */
const getPostById = async (postId) => {
    try {
        const response = await axios.get(API_URL + postId);
        return response.data;
    } catch (error) {
        console.error(`Error fetching post ${postId}:`, error);
        throw error.response?.data?.message || 'Error fetching post';
    }
};

/**
 * @desc    Create a new forum post
 * @access  Private
 */
const createPost = async (postData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.post(API_URL, postData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error.response?.data?.message || 'Error creating post';
    }
};

/**
 * @desc    Add a reply to a forum post
 * @access  Private
 */
const addReply = async (postId, replyData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        // Send request to the specific reply endpoint
        const response = await axios.post(`${API_URL}${postId}/replies`, replyData, config);
        return response.data;
    } catch (error) {
        console.error(`Error adding reply to post ${postId}:`, error);
        throw error.response?.data?.message || 'Error adding reply';
    }
};

const forumService = {
    getAllPosts,
    getPostById,
    createPost,
    addReply,
};

export default forumService;