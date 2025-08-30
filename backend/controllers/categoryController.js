// const Category = require('../models/Category');

// // @desc    Get all categories
// // @route   GET /api/categories
// // @access  Public
// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({}).sort({ name: 1 });
//     res.json(categories);
//   } catch (error) {
//     console.error(`Error in getCategories: ${error.message}`);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // @desc    Create a category
// // @route   POST /api/categories
// // @access  Private/Admin
// const createCategory = async (req, res) => {
//   try {
//     const { name, imageUrl } = req.body;

//     if (!name || !imageUrl) {
//       return res.status(400).json({ message: 'Name and image URL are required.' });
//     }

//     const categoryExists = await Category.findOne({ name });
//     if (categoryExists) {
//       return res.status(400).json({ message: 'A category with this name already exists.' });
//     }

//     const category = new Category({
//       name,
//       imageUrl,
//     });

//     const createdCategory = await category.save();
//     res.status(201).json(createdCategory);
//   } catch (error) {
//     console.error(`Error in createCategory: ${error.message}`);
//     res.status(400).json({ message: 'Error creating category', error: error.message });
//   }
// };

// module.exports = {
//   getCategories,
//   createCategory,
// };

///////////////////Category Update for Public Header////////////////
const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(`Error in getCategories: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Name and image URL are required." });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res
        .status(400)
        .json({ message: "A category with this name already exists." });
    }

    const category = new Category({
      name,
      imageUrl,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(`Error in createCategory: ${error.message}`);
    res
      .status(400)
      .json({ message: "Error creating category", error: error.message });
  }
};

// @desc    Get a single category by its slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(`Error in getCategoryBySlug: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  getCategoryBySlug,
};
