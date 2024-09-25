const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: [true, 'Product ID is required'],
  }, 
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  region: {
    type: String,
    required: [true, 'Product region is required'],
  },
  weight: {
    type: Number,
    required: [true, 'Product weight is required'],
  },
  flavor_profile: {
    type: [String], // Array of strings
    required: [true, 'At least one flavor profile is required'],
  },
  grind_option: {
    type: [String], // Array of strings
    required: [true, 'At least one grind option is required'],
  },
  roast_level: {
    type: Number,
    required: [true, 'Roast level is required'],
    min: [1, 'Roast level cannot be less than 1'],
    max: [5, 'Roast level cannot be greater than 5'], // Assuming roast level is between 1 and 5
  },
  image_url: {
    type: String,
    required: [true, 'Main product image URL is required'],
  },
  subPics: {
    type: [String], // Array of URLs for sub-pictures
    default: [],
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
