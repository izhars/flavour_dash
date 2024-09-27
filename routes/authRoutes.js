const express = require('express');
const router = express.Router();
const { GoogleUser, PhoneUser } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Cart = require('../models/cartModel');

router.post('/google-login', async (req, res) => {
  try {
      const { idToken } = req.body;

      if (!idToken) return res.status(400).json({ message: 'ID token is required' });

      // Verify the ID token
      const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
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

      // Create an empty cart for the user after they log in
      const existingCart = await Cart.findOne({ userId: user._id });

      if (!existingCart) {
          const newCart = new Cart({
              userId: user._id,
              items: [],
          });
          await newCart.save(); // Save the new cart
          console.log(`Created new cart for user ID: ${user._id}`);
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.googleId }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token, user });
  } catch (error) {
      console.error('Error during Google login:', error);
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

      // Check if the OTP matches and if it has expired
      if (user.otp !== otp) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }
      if (Date.now() > user.otpExpiration) {
          return res.status(400).json({ message: 'OTP expired' });
      }

      // Generate a token with user ID and phone number
      const token = jwt.sign(
          { _id: user._id, phoneNumber: user.phoneNumber }, // Include user ID in the payload
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Clear OTP after successful verification
      user.otp = undefined;
      user.otpExpiration = undefined;
      await user.save();

      // Create an empty cart for the user after OTP verification
      const existingCart = await Cart.findOne({ userId: user._id });

      if (!existingCart) {
          const newCart = new Cart({
              userId: user._id,
              items: [],
          });
          await newCart.save(); // Save the new cart
          console.log(`Created new cart for user ID: ${user._id}`);
      }

      // Return the token and user ID in the response
      return res.json({ token, userId: user._id });
  } catch (error) {
      console.error('Error during OTP verification:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
