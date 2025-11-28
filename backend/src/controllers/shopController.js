const asyncHandler = require('express-async-handler');
const Shop = require('../models/Location');

// @desc    Register a new shop
// @route   POST /api/shops
// @access  Private
const registerShop = asyncHandler(async (req, res) => {
  const { name, address, location, contact, email, openingHours, acceptedWastes } = req.body;

  // Basic validation
  if (!name || !address || !location || !contact || !acceptedWastes) {
    res.status(400);
    throw new Error('Please provide all required shop details.');
  }

  const shop = new Shop({
    name,
    address,
    location,
    contact,
    email,
    openingHours,
    acceptedWastes,
    user: req.user._id, // Associate shop with the logged-in user
  });

  const createdShop = await shop.save();
  res.status(201).json(createdShop);
});

// @desc    Get shops for the logged-in user
// @route   GET /api/shops/myshops
// @access  Private
const getMyShop = asyncHandler(async (req, res) => {
  const shops = await Shop.find({ user: req.user._id });
  res.status(200).json(shops);
});

// ... (registerShop, getMyShop remains the same) ...

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    res.status(200).json(shop); // This will automatically include the new 'contact' field
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
});

// @desc    Get nearby shops
// @route   GET /api/shops/nearby
// @access  Public
const getNearbyShops = asyncHandler(async (req, res) => {
  const { longitude, latitude } = req.query;

  if (!longitude || !latitude) {
    res.status(400);
    throw new Error('Longitude and latitude are required');
  }

  const shops = await Shop.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: 10000, // 10km radius
      },
    },
  });

  res.status(200).json(shops); // This also includes the 'contact' field
});

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getAllShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({});
  res.status(200).json(shops);
});

// @desc    Update a shop
// @route   PUT /api/shops/:id
// @access  Private/Admin
const updateShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }

  const { name, address, location, contact, email, openingHours, acceptedWastes } = req.body;

  shop.name = name || shop.name;
  shop.address = address || shop.address;
  shop.location = location || shop.location;
  shop.contact = contact || shop.contact;
  shop.email = email || shop.email;
  shop.openingHours = openingHours || shop.openingHours;
  shop.acceptedWastes = acceptedWastes || shop.acceptedWastes;

  const updatedShop = await shop.save();
  res.status(200).json(updatedShop);
});

// @desc    Delete a shop
// @route   DELETE /api/shops/:id
// @access  Private/Admin
const deleteShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }

  await shop.deleteOne();
  res.status(200).json({ message: 'Shop removed successfully' });
});

module.exports = {
  registerShop,
  getMyShop,
  getShopById,
  getNearbyShops,
  getAllShops,
  updateShop,
  deleteShop,
};