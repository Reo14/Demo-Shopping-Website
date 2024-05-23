const express = require('express');
const { addToCart, getCartItems, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, getCartItems);
router.post('/', authenticateToken, addToCart);
router.put('/:id', authenticateToken, updateCartItem);
router.delete('/:id', authenticateToken, removeCartItem);
router.delete('/', authenticateToken, clearCart);

module.exports = router;

