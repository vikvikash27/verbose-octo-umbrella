const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerById } = require('../controllers/customerController');
const { protect, admin } = require('../middleware/authMiddleware');

// This route is for the admin panel to view all customers
router.get('/', protect, admin, getCustomers);

// Route to get a single customer's details
router.get('/:id', protect, admin, getCustomerById);

module.exports = router;