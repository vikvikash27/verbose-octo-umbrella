const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrderStatus,
  cancelOrder,
  bulkUpdateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.post('/:id/cancel', protect, cancelOrder); // Customer can cancel their own order
router.get('/myorders', protect, getOrdersByCustomer); // For customer app/portal

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/bulk-update-status', protect, admin, bulkUpdateOrderStatus);
router.put('/:id/status', protect, admin, updateOrderStatus);

// Accessible by both admin and the specific customer who owns the order
router.get('/:id', protect, getOrderById);

module.exports = router;