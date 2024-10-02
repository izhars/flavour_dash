const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Existing User Schemas
const GoogleUserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    // Other fields...
});

const PhoneUserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiration: { type: Date },
    // Other fields...
});

const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash password before saving the admin user
adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
adminUserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const GoogleUser = mongoose.model('GoogleUser', GoogleUserSchema);
const PhoneUser = mongoose.model('PhoneUser', PhoneUserSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = { GoogleUser, PhoneUser, AdminUser };
