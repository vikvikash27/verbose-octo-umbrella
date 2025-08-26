const express = require('express');
const router = express.Router();
const { getPayments, processPayment } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/payments
// @desc    Get all payment records for the admin dashboard
// @access  Private/Admin
router.get('/', protect, admin, getPayments);

// @route   POST /api/payments/process
// @desc    Process a card payment from a customer during checkout
// @access  Private
router.post('/process', protect, processPayment);

module.exports = router;
