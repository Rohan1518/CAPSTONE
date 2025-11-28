const Component = require('../models/Component');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Import Notification
const multer = require('multer');
const path = require('path');
// Import User model, needed for gamification/notifications
// const { checkAndAwardAchievements } = require('../services/achievementService');
// const { updateChallengeProgress } = require('../services/challengeService');

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Assumes 'uploads' folder is in backend root
    },
    filename: function (req, file, cb) {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

exports.uploadComponentImage = upload.single('image');
// --- End Multer Configuration ---


/**
 * @desc    Get all available components
 * @route   GET /api/components
 * @access  Public
 */
exports.getAllComponents = async (req, res) => {
    try {
        const components = await Component.find({ 
            status: { $in: ['available', 'in-auction'] } 
        }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: components.length,
            data: {
                components,
            },
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Get a single component by its ID
 * @route   GET /api/components/:id
 * @access  Public
 */
exports.getComponentById = async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);

        if (!component) {
            return res.status(404).json({ status: 'fail', message: 'Component not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                component,
            },
        });
    } catch (error) {
        console.error('❌ Error getting component by ID:', error);
        res.status(500).json({ status: 'fail', message: 'Error fetching component data.' });
    }
};

/**
 * @desc    Create a new component
 * @route   POST /api/components
 * @access  Private
 */
exports.createComponent = async (req, res) => {
    try {
        const sellerId = req.user.id; // From 'protect' middleware
        const componentData = { ...req.body, seller: sellerId };

        // Set the starting price as the current price
        componentData.currentPrice = componentData.price;

        if (req.file) {
            componentData.image = `/uploads/${req.file.filename}`;
        } else {
             componentData.image = '/uploads/default-component.jpg';
        }

        const component = await Component.create(componentData);
        res.status(201).json({ status: 'success', data: { component } });
    } catch (error) {
        if (error instanceof multer.MulterError) {
             return res.status(400).json({ status: 'fail', message: 'Image file size is too large (Max 5MB).' });
        }
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Place a bid on a component
 * @route   POST /api/components/:id/bid
 * @access  Private
 */
exports.placeBid = async (req, res) => {
     try {
        const { amount } = req.body;
        const bidderId = req.user.id;
        const componentId = req.params.id;
        const component = await Component.findById(componentId);

        // Validation Checks
        if (!component) { return res.status(404).json({ status: 'fail', message: 'Component not found.' }); }
        if (!['available', 'in-auction'].includes(component.status)) { return res.status(400).json({ status: 'fail', message: 'This item is not for sale or auction.' }); }
        if (component.seller.toString() === bidderId) { return res.status(400).json({ status: 'fail', message: 'You cannot bid on your own item.' }); }
        if (component.auctionEndTime && new Date() > new Date(component.auctionEndTime)) { return res.status(400).json({ status: 'fail', message: 'This auction has ended.' }); }
        const bidAmount = parseFloat(amount);
        if (!bidAmount || bidAmount <= component.currentPrice) { return res.status(400).json({ status: 'fail', message: `Your bid must be higher than the current price of $${component.currentPrice}.` }); }

        // Create New Bid
        const newBid = { bidder: bidderId, amount: bidAmount, timestamp: Date.now() };

        // Update Component
        component.bids.push(newBid);
        component.currentPrice = bidAmount;
        component.highestBidder = bidderId;
        component.status = 'in-auction'; // Placing a bid puts it in auction
        await component.save();

        // Emit Notification (Optional)
        const previousBidder = component.bids.length > 1 ? component.bids[component.bids.length - 2].bidder.toString() : null;
        if (req.io && previousBidder && previousBidder !== bidderId) {
            const socketId = req.onlineUsers.get(previousBidder);
            if (socketId) {
                req.io.to(socketId).emit('new_notification', {
                    type: 'outbid',
                    message: `You have been outbid on ${component.name}!`,
                    link: `/component/${component._id}`
                });
                console.log(`📨 Sent 'outbid' notification to user ${previousBidder}`);
            }
        }

        const updatedComponent = await Component.findById(componentId);
        res.status(200).json({ status: 'success', data: { component: updatedComponent } });
    } catch (error) {
        console.error('❌ Error placing bid:', error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// --- 👇 NEW FUNCTION ---
/**
 * @desc    Buy an item immediately
 * @route   POST /api/components/:id/buy
 * @access  Private
 */
exports.buyItemNow = async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);

        if (!component) {
            return res.status(404).json({ status: 'fail', message: 'Component not found.' });
        }

        if (component.status !== 'available') {
            return res.status(400).json({ status: 'fail', message: 'Component is not available for purchase.' });
        }

        // Check if buyer is the seller
        if (component.seller.toString() === req.user.id) {
            return res.status(400).json({ status: 'fail', message: 'You cannot buy your own component.' });
        }

        // Update component status
        component.status = 'sold';
        component.buyer = req.user.id;
        await component.save();

        // --- NEW: Notify Admin ---
        // Find an admin (assuming there's at least one)
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            const adminNotif = await Notification.create({
                recipient: admin._id,
                sender: req.user.id,
                type: 'order_placed',
                title: 'New Order Received',
                message: `User ${req.user.name} purchased ${component.title}.`,
                relatedId: component._id,
                onModel: 'Component'
            });

            // Real-time socket emit to Admin
            if (req.io) {
                req.io.to(admin._id.toString()).emit('notification', adminNotif);
            }
        }

        // --- NEW: Notify Buyer ---
        const buyerNotif = await Notification.create({
            recipient: req.user.id,
            type: 'system',
            title: 'Order Confirmed',
            message: `You successfully purchased ${component.title}.`,
            relatedId: component._id,
            onModel: 'Component'
        });

        // Real-time socket emit to Buyer
        if (req.io) {
            req.io.to(req.user.id.toString()).emit('notification', buyerNotif);
        }

        res.status(200).json({
            status: 'success',
            message: 'Item purchased successfully!',
            data: {
                component
            }
        });
    } catch (error) {
        console.error('Error buying item:', error);
        res.status(500).json({ status: 'fail', message: 'Error processing purchase.' });
    }
};

/**
 * @desc    Delete a component
 * @route   DELETE /api/components/:id
 * @access  Private (Admin or Owner)
 */
exports.deleteComponent = async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);

        if (!component) {
            return res.status(404).json({ status: 'fail', message: 'Component not found' });
        }

        // Check if user is admin or the owner
        // req.user is set by the protect middleware
        // Handle populated seller field (due to pre-find hook)
        const sellerId = component.seller._id ? component.seller._id.toString() : component.seller.toString();
        
        if (req.user.role !== 'admin' && sellerId !== req.user.id) {
            return res.status(403).json({ status: 'fail', message: 'Not authorized to delete this component' });
        }

        await component.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Component deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting component:', error);
        res.status(500).json({ status: 'fail', message: 'Server Error' });
    }
};
// --- END NEW FUNCTION ---