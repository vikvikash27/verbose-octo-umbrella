const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getReportData);

module.exports = router;
