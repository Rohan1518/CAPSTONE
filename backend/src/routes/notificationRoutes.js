const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  getMyNotifications, 
  markAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
