const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityLogController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getActivities);

module.exports = router;
