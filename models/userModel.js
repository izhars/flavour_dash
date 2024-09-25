const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
});

const phoneUserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, default: null },  // Not required after OTP verification
  otpExpiration: { type: Date, default: null },  // Not required after OTP verification
});


// Models
const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);
const PhoneUser = mongoose.model('PhoneUser', phoneUserSchema);

module.exports = {
  GoogleUser,
  PhoneUser
};
