const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getStats);

module.exports = router;