const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth'); // Adjust path as necessary

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user; // Store user info in req.user
        next();
    });
};

module.exports = authenticateUser;
