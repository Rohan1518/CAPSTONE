const express = require('express');
const { 
    getAllComponents, 
    createComponent, 
    uploadComponentImage, 
    placeBid,
    getComponentById,
    buyItemNow,
    deleteComponent // 👈 Import the new function
} = require('../controllers/componentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// --- GET all components (Public) ---
// GET /api/components
router.route('/')
    .get(getAllComponents);

// --- POST a new component (Private) ---
// POST /api/components
router.route('/')
    .post(protect, uploadComponentImage, createComponent);

// --- GET single component by ID (Public) ---
// GET /api/components/:id
router.route('/:id')
    .get(getComponentById)
    .delete(protect, deleteComponent); // 👈 Add DELETE route

// --- POST a bid (Private) ---
// POST /api/components/:id/bid
router.route('/:id/bid')
    .post(protect, placeBid);

// --- 👇 NEW ROUTE: Buy item now (Private) ---
// POST /api/components/:id/buy
router.route('/:id/buy')
    .post(protect, buyItemNow);
// --- END NEW ROUTE ---

module.exports = router;