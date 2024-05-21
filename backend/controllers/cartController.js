const Cart = require('../models/cart');

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    try {
        const cartItem = await Cart.create({ userId, productId, quantity });
        res.status(201).json(cartItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        const cartItems = await Cart.findAll({ where: { userId } });
        res.json(cartItems);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        cartItem.quantity = quantity;
        await cartItem.save();
        res.json(cartItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addToCart, getCartItems, updateCartItem };
