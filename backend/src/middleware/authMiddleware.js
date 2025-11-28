const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Protect routes by checking for a valid JWT
 */
exports.protect = async (req, res, next) => {
    let token;

    // 🐛 DEBUG: Log authorization header
    console.log('🔍 Authorization Header:', req.headers.authorization);

    // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Get the token from the header (format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];
            console.log('🔍 Extracted Token:', token.substring(0, 20) + '...');

            // 3. Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Fixed: Use process.env.JWT_SECRET
            console.log('✅ Token decoded successfully. User ID:', decoded.id);

            // 4. Find the user by the ID from the token and attach them to the request
            // We exclude the password field
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('❌ User not found in database');
                return res.status(401).json({ status: 'fail', message: 'User not found' });
            }

            console.log('✅ User authenticated:', req.user.email);
            // 5. Move to the next function (e.g., the controller)
            next();
        } catch (error) {
            console.log('❌ Token verification failed:', error.message);
            res.status(401).json({ status: 'fail', message: 'Not authorized, token failed' });
        }
    } else {
        console.log('❌ No token provided or invalid format');
        res.status(401).json({ status: 'fail', message: 'Not authorized, no token' });
    }
};

/**
 * @desc    Middleware to check if user is an admin
 * (We'll use this later)
 */
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ status: 'fail', message: 'Not authorized as an admin' });
    }
};