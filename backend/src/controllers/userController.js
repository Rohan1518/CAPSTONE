const User = require('../models/User');
const Component = require('../models/Component');

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/users/me/profile
 * @access  Private
 */
exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        user.password = undefined;
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Get users sorted by points for leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select('name points');

        res.status(200).json({
            status: 'success',
            data: {
                leaderboard: users,
            },
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

/**
 * @desc    Get logged-in user's challenge progress
 * @route   GET /api/users/me/challenges
 * @access  Private
 */
exports.getMyChallengeProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('challengeProgress')
            .populate('challengeProgress.challenge', 'title description goal rewardPoints');

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                challengeProgress: user.challengeProgress || []
            }
        });
    } catch (error) {
         console.error("Error fetching user challenge progress:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching challenge progress' });
    }
};

/**
 * @desc    Get all components (unsold) listed by the logged-in user
 * @route   GET /api/users/me/components
 * @access  Private
 */
exports.getMyComponents = async (req, res) => {
    try {
        // Find components that are 'available' or 'in-auction'
        const components = await Component.find({ 
            seller: req.user.id,
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
        console.error("Error fetching user's components:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching components' });
    }
};

// --- 👇 NEW FUNCTION ---
/**
 * @desc    Get all items sold by the logged-in user
 * @route   GET /api/users/me/sold
 * @access  Private
 */
exports.getMySoldItems = async (req, res) => {
    try {
        const soldItems = await Component.find({ 
            seller: req.user.id,
            status: 'sold' 
        })
        .populate('highestBidder', 'name') // Show who bought it
        .sort({ updatedAt: -1 }); // Sort by when it was sold (updated)

        res.status(200).json({
            status: 'success',
            results: soldItems.length,
            data: {
                soldItems,
            },
        });
    } catch (error) {
        console.error("Error fetching user's sold items:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching sold items' });
    }
};
// --- END NEW FUNCTION ---

// --- 👇 NEW FUNCTION ---
/**
 * @desc    Get all items purchased by the logged-in user
 * @route   GET /api/users/me/purchased
 * @access  Private
 */
exports.getMyPurchasedItems = async (req, res) => {
    try {
        const purchasedItems = await Component.find({ 
            highestBidder: req.user.id, // User was the buyer/highest bidder
            status: 'sold' 
        })
        .populate('seller', 'name') // Show who they bought it from
        .sort({ updatedAt: -1 });

        res.status(200).json({
            status: 'success',
            results: purchasedItems.length,
            data: {
                purchasedItems,
            },
        });
    } catch (error) {
        console.error("Error fetching user's purchased items:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching purchased items' });
    }
};
// --- END NEW FUNCTION ---

// --- ADMIN-ONLY FUNCTIONS ---

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users/all
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching users' });
    }
};

/**
 * @desc    Get system statistics (Admin only)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
exports.getSystemStats = async (req, res) => {
    try {
        const Shop = require('../models/shopModel');
        
        const totalUsers = await User.countDocuments();
        const totalShops = await Shop.countDocuments();
        const totalComponents = await Component.countDocuments();

        // Get recent users for activity feed
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');

        const recentActivity = recentUsers.map(user => ({
            icon: '👤',
            user: user.name,
            action: 'Joined the platform',
            time: new Date(user.createdAt).toLocaleDateString()
        }));

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalShops,
                totalComponents,
                recentActivity
            },
        });
    } catch (error) {
        console.error("Error fetching system stats:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching statistics' });
    }
};

/**
 * @desc    Delete a user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        // Prevent deleting own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ status: 'fail', message: 'Cannot delete your own account' });
        }

        await user.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ status: 'fail', message: 'Error deleting user' });
    }
};

/**
 * @desc    Toggle user active status (Admin only)
 * @route   PATCH /api/users/:id/toggle-status
 * @access  Private/Admin
 */
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        user.isActive = req.body.isActive;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { user }
        });
    } catch (error) {
        console.error("Error toggling user status:", error);
        res.status(500).json({ status: 'fail', message: 'Error updating user status' });
    }
};

/**
 * @desc    Get logged-in user's purchased items
 * @route   GET /api/users/me/purchased
 * @access  Private
 */
exports.getMyPurchasedItems = async (req, res) => {
    try {
        // Find components where the logged-in user is the highest bidder and status is 'sold'
        const purchasedItems = await Component.find({ 
            highestBidder: req.user.id,
            status: 'sold'
        })
        .populate('seller', 'name email')
        .sort({ updatedAt: -1 });

        res.status(200).json(purchasedItems);
    } catch (error) {
        console.error("Error fetching purchased items:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching purchased items' });
    }
};

/**
 * @desc    Get logged-in user's sold items
 * @route   GET /api/users/me/sold
 * @access  Private
 */
exports.getMySoldItems = async (req, res) => {
    try {
        // Find components where the logged-in user is the seller and status is 'sold'
        const soldItems = await Component.find({ 
            seller: req.user.id,
            status: 'sold'
        })
        .populate('highestBidder', 'name email')
        .sort({ updatedAt: -1 });

        res.status(200).json(soldItems);
    } catch (error) {
        console.error("Error fetching sold items:", error);
        res.status(500).json({ status: 'fail', message: 'Error fetching sold items' });
    }
};