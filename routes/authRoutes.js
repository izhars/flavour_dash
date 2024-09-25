const express = require('express');
const router = express.Router();
const { GoogleUser, PhoneUser } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ message: 'ID token is required' });

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,  // Replace this with your Google Client ID if not set properly
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const userEmail = payload.email;
    const userName = payload.name;

    // Check if user already exists in the database
    let user = await GoogleUser.findOne({ googleId: userId });

    if (!user) {
      // Create a new user if not found
      user = new GoogleUser({
        googleId: userId,
        email: userEmail,
        name: userName,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.googleId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    console.error('Error during Google login:', error);  // Log error for more info
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

    const otp = crypto.randomInt(1000, 9999).toString();
    const expiration = Date.now() + 10 * 60 * 1000;

    let user = await PhoneUser.findOne({ phoneNumber });
    if (!user) {
      user = new PhoneUser({ phoneNumber, otp, otpExpiration: expiration });
    } else {
      user.otp = otp;
      user.otpExpiration = expiration;
    }
    await user.save();

    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.json({ message: 'OTP sent', otp });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    let user = await PhoneUser.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User OTP: ${user.otp}`);
    console.log(`Received OTP: ${otp}`);

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (Date.now() > user.otpExpiration) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const token = jwt.sign({ phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    return res.json({ token });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
