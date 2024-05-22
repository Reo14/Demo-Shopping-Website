const Cart = require('../models/cart');
const Product =  require('../models/product');


const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
  
    console.log('Received request to add to cart:', req.body); // 添加日志以调试
  
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'ProductId and quantity are required' });
    }
  
    try {
      // 确保产品存在
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(400).json({ error: 'Invalid productId' });
      }
  
      // 查找是否已有相同产品的购物车项
      let cartItem = await CartItem.findOne({ where: { productId } });
      if (cartItem) {
        // 如果存在相同产品，更新数量
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // 否则，创建新的购物车项
        cartItem = await CartItem.create({ productId, quantity });
      }
  
      res.status(201).json(cartItem);
    } catch (err) {
      console.error('Error adding to cart:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const getCartItems = async (req, res) => {
    console.log('Request received to get cart items'); // 确认请求到达
    try {
      const cartItems = await Cart.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Product,
          as: 'product'
        }]
      });

      console.log('Cart items:', JSON.stringify(cartItems, null, 2)); // 打印调试信息

      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Failed to fetch cart items' });
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

const removeCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        await cartItem.destroy();
        res.json({ message: 'Cart item removed' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const clearCart = async (req, res) => {
    const userId = req.user.id;
    try {
        await Cart.destroy({ where: { userId } });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addToCart, getCartItems, updateCartItem, removeCartItem, clearCart };
