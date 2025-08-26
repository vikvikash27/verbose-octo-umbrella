const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get all products
router.get('/', getProducts);

// Public route to get a single product
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.post('/bulk', protect, admin, bulkUploadProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;