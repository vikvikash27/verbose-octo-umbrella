const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories) // Publicly accessible to populate dropdowns
  .post(protect, admin, createCategory); // Protected for creation

module.exports = router;