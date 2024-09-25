const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header

  if (token == null) return res.status(401).json({ message: 'Token is required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
