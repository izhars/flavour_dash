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
    const product = await Product.findOne({ id: req.params.id }); // Use findOne
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
    id,
    name,
    price,
    description,
    region,
    weight,
    flavor_profile,
    grind_option,
    roast_level,
    image_url,
    subPic
  } = req.body;

  // Validate required fields
  if (!name || !price || !description || !region || !weight || !flavor_profile || !grind_option || !roast_level || !image_url || !subPic) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  // Ensure subPic is a non-empty array
  if (!Array.isArray(subPic) || subPic.length === 0) {
    return res.status(400).json({ message: 'subPic must be a non-empty array' });
  }

  try {
    const newProduct = new Product({
      id,
      name,
      price,
      description,
      region,
      weight,
      flavor_profile,
      grind_option,
      roast_level,
      image_url,
      subPic
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
