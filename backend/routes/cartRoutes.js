const express = require('express');
const { addToCart, getCartItems, updateCartItem } = require('../controllers/cartController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, addToCart);
router.get('/', authenticateToken, getCartItems);
router.put('/:id', authenticateToken, updateCartItem);

module.exports = router;
