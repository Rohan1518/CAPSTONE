const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the user who registered the shop
    },
    name: {
      type: String,
      required: [true, 'Please add a shop name'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    // This is the new field we added
    contact: {
      type: String,
      required: [true, 'Please add a contact phone number'],
    },
    email: {
      type: String,
      required: false,
    },
    openingHours: {
      type: String,
      required: false,
    },
    acceptedWastes: {
      type: [String], // e.g., ['Laptops', 'Phones', 'Batteries']
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the location field for geospatial queries
shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
