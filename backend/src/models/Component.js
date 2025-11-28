const mongoose = require('mongoose');

// --- Schema for individual bids ---
const bidSchema = new mongoose.Schema({
    bidder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

// --- Main Component Schema ---
const componentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A component must have a name'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    condition: {
        type: String,
        required: true,
        enum: ['new', 'used', 'refurbished', 'for-parts'],
    },
    price: {
        type: Number,
        required: [true, 'A component must have a starting/buy price'],
        min: 0,
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'in-auction'],
        default: 'available',
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        default: '/uploads/default-component.jpg',
    },
    bids: [bidSchema],
    auctionEndTime: {
        type: Date,
    },
    highestBidder: {
         type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    currentPrice: {
        type: Number,
        default: function() { return this.price; }
    }
}, {
    timestamps: true,
});

// --- 👇 POPULATE HOOK (UPDATED) ---
// Populate seller and bidder details
componentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'seller',
        // 1. Select the seller's name, email, AND new contactInfo field
        select: 'name email contactInfo', 
    }).populate({
        path: 'bids.bidder',
        select: 'name',
    }).populate({
        path: 'highestBidder',
        select: 'name'
    });
    next();
});
// --- END POPULATE HOOK ---

const Component = mongoose.model('Component', componentSchema);
module.exports = Component;