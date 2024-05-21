const express = require('express');
const { createProduct, listProducts, editProduct } = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRole(['admin']), createProduct);
router.get('/', listProducts);
router.put('/:id', authenticateToken, authorizeRole(['admin']), editProduct);

module.exports = router;
