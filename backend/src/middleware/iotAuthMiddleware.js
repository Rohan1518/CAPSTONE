require('dotenv').config();

const protectIot = (req, res, next) => {
    // Check for API key in the 'x-api-key' header
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ status: 'fail', message: 'Access denied. No API key provided.' });
    }

    if (apiKey !== process.env.IOT_API_KEY) {
        return res.status(401).json({ status: 'fail', message: 'Invalid API key.' });
    }

    // If key is valid, proceed to the controller
    next();
};

module.exports = { protectIot };