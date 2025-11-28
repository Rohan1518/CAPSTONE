const express = require('express');
const forumController = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// --- Public Routes ---
// GET /api/forum - Get all posts
// GET /api/forum/:postId - Get a single post by ID
router.route('/').get(forumController.getAllPosts);
router.route('/:postId').get(forumController.getPostById);

// --- Private Routes ---
// POST /api/forum - Create a new post
router.route('/').post(protect, forumController.createPost);
// POST /api/forum/:postId/replies - Add a reply to a post
router.route('/:postId/replies').post(protect, forumController.addReply);

module.exports = router;