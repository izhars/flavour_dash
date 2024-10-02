require('dotenv').config();
const mongoose = require('mongoose');
const { AdminUser } = require('../models/userModel');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        
        // Check if any admin account exists
        const existingAdmin = await AdminUser.findOne();
        if (existingAdmin) {
            console.log('Admin account already exists. No new account created.');
            process.exit(0); // Exit the script without creating a new admin
        }

        // Proceed to create a new admin account if no admin exists
        const username = 'adminUsername'; // Set the desired username
        const password = 'adminPassword'; // Set the desired password

        const admin = new AdminUser({ username, password });
        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
