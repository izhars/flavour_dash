const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true,
  }, 
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  flavor_profile: {
    type: [String], // Array of strings
    required: true,
  },
  grind_option: {
    type: [String], // Array of strings
    required: true,
  },
  roast_level: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Assuming roast level is between 1 and 5
  },
  image_url: {
    type: String,
    required: true,
  },
  subPics: [String], // Array of URLs for sub-pictures
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
