const express = require('express');
const { createProduct, listProducts, getProduct, editProduct, deleteProduct } = require('../controllers/productController');
const {authenticateToken, authorizeRole} = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, listProducts);
router.get('/:id', authenticateToken, getProduct);
router.post('/', authenticateToken, authorizeRole(['admin']), createProduct); // 只有管理员可以创建产品
router.put('/:id', authenticateToken, authorizeRole(['admin']), editProduct); // 只有管理员可以编辑产品
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteProduct); // 只有管理员可以删除产品

module.exports = router;
