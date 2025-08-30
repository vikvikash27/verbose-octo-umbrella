const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  getCategoryBySlug,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getCategories) // Publicly accessible to populate dropdowns
  .post(protect, admin, createCategory); // Protected for creation

router.get("/slug/:slug", getCategoryBySlug); // Route to get category by slug

module.exports = router;
