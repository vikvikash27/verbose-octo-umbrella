const express = require('express');
const router = express.Router();
const { getStats, getTopCustomers } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getStats);
router.get('/top-customers', protect, admin, getTopCustomers);

module.exports = router;