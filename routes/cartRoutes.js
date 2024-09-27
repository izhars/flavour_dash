const express = require('express');
const { addToCart, getCart, updateCartQuantity, removeCartItem } = require('../controllers/cartControler'); // Ensure correct imports

const router = express.Router();

// Route to add a product to the cart
router.post('/cart/addToCart', addToCart);

// Route to get the user's cart
router.get('/cart/getCart', getCart);

// Route to update the quantity of a product in the cart
router.put('/cart/updateQuantity', updateCartQuantity);

// Route to remove a product from the cart
router.delete('/cart/removeItem/:productId', removeCartItem);

module.exports = router;
