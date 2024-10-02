const express = require('express');
const router = express.Router();
const token = require('../middleware/adminAuthMiddleware');
const { AdminUser } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Example protected route
router.get('/dashboard', token, (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.admin.username}` });
});

// Add more admin routes here...

router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find admin by username
        const admin = await AdminUser.findOne();
        if (!admin) {
            return res.status(401).json({ message: 'Admin account not found' });
        }

        // Check if the submitted username matches the only admin account
        if (admin.username !== username) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, admin: { id: admin._id, username: admin.username } });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
