const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '90d' });

exports.register = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const token = signToken(newUser._id);
        
        // Remove password from output
        newUser.password = undefined;

        res.status(201).json({ status: 'success', token, data: { user: newUser } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: 'Email already in use or invalid data.' });
    }
};

// --- THIS IS THE UPDATED FUNCTION ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password.' });
        }

        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
        }

        // Check if user account is active
        if (user.isActive === false) {
            return res.status(403).json({ 
                status: 'fail', 
                message: 'Your account has been deactivated. Please contact the administrator.' 
            });
        }

        const token = signToken(user._id);

        // Remove password from output
        user.password = undefined;

        // Send back the token AND the user data
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: user
            }
        });

    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};