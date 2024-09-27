const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Add a product to the cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    // Check if quantity is valid
    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    try {
        // Ensure req.user exists and has the user ID
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find the product to ensure it exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user's cart using the user ID from the token
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            // If no cart exists for the user, create one
            cart = new Cart({
                userId: req.user._id,
                items: []
            });
        }

        // Check if product already exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex !== -1) {
            // If product already exists in the cart, update its quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Otherwise, add the product to the cart
            cart.items.push({ productId, quantity }); // Use productId here
        }

        // Save the cart
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get the user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        // Find the user's cart using the user ID from the token
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Calculate the total amount
        let totalAmount = 0;
        const items = cart.items.map(item => {
            totalAmount += item.productId.price * item.quantity;
            return {
                productId: item.productId._id, // Use productId here
                quantity: item.quantity,
                name: item.productId.name,
                description: item.productId.description,
                price: item.productId.price,
                region: item.productId.region,
                weight: item.productId.weight,
                flavor_profile: item.productId.flavor_profile,
                grind_option: item.productId.grind_option,
                roast_level: item.productId.roast_level,
                image_url: item.productId.image_url,
                subPics: item.productId.subPics,
                createdAt: item.productId.createdAt,
                updatedAt: item.productId.updatedAt,
            };
        });

        const cartWithTotal = {
            _id: cart._id,
            userId: cart.userId,
            items,
            totalAmount,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };

        res.status(200).json({ cart: cartWithTotal });
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update the quantity of a product in the cart
// @route   PUT /api/cart/updateQuantity
// @access  Private
const updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    // Check if quantity is valid
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    try {
        // Ensure req.user exists and has the user ID
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart using productId
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update the quantity
        cart.items[existingItemIndex].quantity = quantity;

        // Save the updated cart
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error updating cart quantity:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove a product from the cart
// @route   DELETE /api/cart/removeItem/:productId
// @access  Private
const removeCartItem = async (req, res) => {
  const { productId } = req.params; // Get productId from URL parameters

  try {
      // Ensure req.user exists and has the user ID
      if (!req.user || !req.user._id) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      // Find the user's cart
      let cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      // Check if the product exists in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex === -1) {
          return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Remove the product from the cart
      cart.items.splice(itemIndex, 1);

      // Save the updated cart
      const updatedCart = await cart.save();

      res.status(200).json(updatedCart);
  } catch (error) {
      console.error('Error removing cart item:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartQuantity, removeCartItem };
