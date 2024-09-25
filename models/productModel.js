const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
  },
  roastLevel: {
    type: String,
    enum: ['Light', 'Medium', 'Dark'],
    required: [true, 'Roast level is required'],
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
  },
  beanType: {
    type: String,
    required: [true, 'Bean type is required'],
  },
  grindSize: {
    type: String,
    enum: ['Whole Bean', 'Coarse', 'Medium', 'Fine'],
    required: [true, 'Grind size is required'],
  },
  mainPic: {
    type: String,
    required: [true, 'Main picture URL is required'],
  },
  subPics: [String], // Array of URLs for sub-pictures
});

module.exports = mongoose.model('Product', productSchema);
