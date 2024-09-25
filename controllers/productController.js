const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new coffee product
// @route   POST /api/products
const createProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    roastLevel,
    origin,
    beanType,
    grindSize,
    mainPic,
    subPics
  } = req.body;

  // Validate required fields
  if (!name || !price || !description || !category || !roastLevel || !origin || !beanType || !grindSize || !mainPic) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      roastLevel,
      origin,
      beanType,
      grindSize,
      mainPic,
      subPics, // subPics is optional
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
};



module.exports = { getProducts, getProductById, createProduct };
