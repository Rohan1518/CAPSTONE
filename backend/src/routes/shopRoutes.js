const express = require('express');
const router = express.Router();
const {
  registerShop,
  getNearbyShops,
  getShopById,
  getMyShop,
  getAllShops,
  updateShop,
  deleteShop,
} = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/shops - Register a new shop (admin only)
// GET /api/shops - Get all shops (public)
router.route('/').post(protect, admin, registerShop).get(getAllShops);

// GET /api/shops/myshops - Get shops for the logged-in user (protected)
router.route('/myshops').get(protect, getMyShop);

// GET /api/shops/nearby - Get shops near a location (public)
router.route('/nearby').get(getNearbyShops);

// GET /api/shops/:id - Get a single shop by its ID (public)
// PUT /api/shops/:id - Update a shop (admin only)
// DELETE /api/shops/:id - Delete a shop (admin only)
router
  .route('/:id')
  .get(getShopById)
  .put(protect, admin, updateShop)
  .delete(protect, admin, deleteShop);

module.exports = router;
