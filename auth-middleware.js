const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    console.log('Auth middleware called');
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded.userId;
        console.log('Token verified, user:', req.user);
        next();
    } catch (err) {
        console.log('Token verification failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};