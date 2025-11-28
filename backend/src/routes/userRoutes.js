const express = require('express');
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Public Routes ---
router.route('/leaderboard').get(userController.getLeaderboard);

// --- Private Routes (require login) ---
router.route('/me/profile').get(protect, userController.getMyProfile);
router.route('/me/challenges').get(protect, userController.getMyChallengeProgress);
router.route('/me/components').get(protect, userController.getMyComponents);
router.route('/me/sold').get(protect, userController.getMySoldItems);
router.route('/me/purchased').get(protect, userController.getMyPurchasedItems);

// --- Admin-Only Routes ---
router.route('/all').get(protect, admin, userController.getAllUsers);
router.route('/stats').get(protect, admin, userController.getSystemStats);
router.route('/:id/toggle-status').patch(protect, admin, userController.toggleUserStatus);
router.route('/:id').delete(protect, admin, userController.deleteUser);

module.exports = router;