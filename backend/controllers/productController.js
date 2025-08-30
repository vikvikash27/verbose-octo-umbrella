// const Product = require('../models/Product');
// const { getDashboardStats } = require('./dashboardController');
// const logActivity = require('../utils/logActivity');

// // @desc    Fetch all products
// // @route   GET /api/products
// // @access  Public
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({}).sort({ createdAt: -1 });
//     res.json(products);
//   } catch (error) => {
//     console.error(`Error in getProducts: ${error.message}`);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // @desc    Fetch single product
// // @route   GET /api/products/:id
// // @access  Public
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) => {
//     console.error(`Error in getProductById: ${error.message}`);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // @desc    Create a product
// // @route   POST /api/products
// // @access  Private/Admin
// const createProduct = async (req, res) => {
//   try {
//     const { name, category, variations, description, imageUrl, fssai, offer, tags, subscriptionOptions, seller, shelfLife } = req.body;

//     const product = new Product({
//       name,
//       category,
//       variations,
//       description,
//       imageUrl: imageUrl || `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/400`,
//       fssai,
//       offer,
//       tags,
//       subscriptionOptions,
//       seller,
//       shelfLife,
//     });

//     const createdProduct = await product.save();

//     await logActivity(req, 'Created product', 'Product', createdProduct._id, `Created product: ${createdProduct.name}`);

//     // Emit stats update via socket
//     const stats = await getDashboardStats();
//     req.io.emit('stats_update', stats);

//     res.status(201).json(createdProduct);
//   } catch (error) {
//     console.error(`Error in createProduct: ${error.message}`);
//     res.status(400).json({ message: 'Error creating product', error: error.message });
//   }
// };

// // @desc    Update a product
// // @route   PUT /api/products/:id
// // @access  Private/Admin
// const updateProduct = async (req, res) => {
//   try {
//     const { name, category, variations, description, imageUrl, fssai, offer, tags, subscriptionOptions, seller, shelfLife } = req.body;
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       product.name = name ?? product.name;
//       product.category = category ?? product.category;
//       product.variations = variations ?? product.variations;
//       product.description = description ?? product.description;
//       product.imageUrl = imageUrl ?? product.imageUrl;
//       product.fssai = fssai ?? product.fssai;
//       product.offer = offer ?? product.offer;
//       product.tags = tags ?? product.tags;
//       product.subscriptionOptions = subscriptionOptions ?? product.subscriptionOptions;
//       product.seller = seller ?? product.seller;
//       product.shelfLife = shelfLife ?? product.shelfLife;

//       const updatedProduct = await product.save();

//       await logActivity(req, 'Updated product', 'Product', updatedProduct._id, `Updated product: ${updatedProduct.name}`);

//       // Emit stats update via socket
//       const stats = await getDashboardStats();
//       req.io.emit('stats_update', stats);

//       res.json(updatedProduct);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     console.error(`Error in updateProduct: ${error.message}`);
//     res.status(400).json({ message: 'Error updating product', error: error.message });
//   }
// };

// // @desc    Delete a product
// // @route   DELETE /api/products/:id
// // @access  Private/Admin
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       await product.deleteOne();

//       await logActivity(req, 'Deleted product', 'Product', req.params.id, `Deleted product: ${product.name}`);

//       // Emit stats update via socket
//       const stats = await getDashboardStats();
//       req.io.emit('stats_update', stats);

//       res.status(204).send();
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     console.error(`Error in deleteProduct: ${error.message}`);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // @desc    Bulk upload/update products
// // @route   POST /api/products/bulk
// // @access  Private/Admin
// const bulkUploadProducts = async (req, res) => {
//     const productsData = req.body;
//     if (!Array.isArray(productsData) || productsData.length === 0) {
//         return res.status(400).json({ message: 'Invalid product data format.' });
//     }

//     const session = await Product.startSession();
//     session.startTransaction();

//     try {
//         const operations = productsData.map(productInfo => {
//             // Use product name as the unique key for upserting
//             const filter = { name: productInfo.name };
//             const update = {
//                 $set: {
//                     ...productInfo,
//                     // Ensure imageUrl has a default if not provided
//                     imageUrl: productInfo.imageUrl || `https://picsum.photos/seed/${productInfo.name.replace(/\s+/g, '')}/400`,
//                 }
//             };
//             return {
//                 updateOne: {
//                     filter: filter,
//                     update: update,
//                     upsert: true
//                 }
//             };
//         });

//         const result = await Product.bulkWrite(operations, { session });
//         await session.commitTransaction();
//         session.endSession();

//         const summary = `Bulk upload complete. Created: ${result.upsertedCount}, Updated: ${result.modifiedCount}.`;
//         await logActivity(req, 'Bulk uploaded products', 'Product', 'Multiple', summary);

//         // Emit stats update via socket
//         const stats = await getDashboardStats();
//         req.io.emit('stats_update', stats);

//         res.status(200).json({
//             message: 'Bulk upload successful!',
//             created: result.upsertedCount,
//             updated: result.modifiedCount,
//         });

//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error(`Error in bulkUploadProducts: ${error.message}`);
//         res.status(500).json({ message: 'An error occurred during bulk upload.', error: error.message });
//     }
// };

// module.exports = {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   bulkUploadProducts,
// };

//////////////////Category updates for public Header////////////////////

const Product = require("../models/Product");
const Category = require("../models/Category");
const { getDashboardStats } = require("./dashboardController");
const logActivity = require("../utils/logActivity");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category: categorySlug } = req.query;
    let query = {};

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        // Products store category by name
        query.category = category.name;
      } else {
        // Category not found, return no products
        return res.json([]);
      }
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(`Error in getProducts: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error in getProductById: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      variations,
      description,
      imageUrl,
      fssai,
      offer,
      tags,
      subscriptionOptions,
      seller,
      shelfLife,
    } = req.body;

    const product = new Product({
      name,
      category,
      variations,
      description,
      imageUrl:
        imageUrl ||
        `https://picsum.photos/seed/${name.replace(/\s+/g, "")}/400`,
      fssai,
      offer,
      tags,
      subscriptionOptions,
      seller,
      shelfLife,
    });

    const createdProduct = await product.save();

    await logActivity(
      req,
      "Created product",
      "Product",
      createdProduct._id,
      `Created product: ${createdProduct.name}`
    );

    // Emit stats update via socket
    const stats = await getDashboardStats();
    req.io.emit("stats_update", stats);

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(`Error in createProduct: ${error.message}`);
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      variations,
      description,
      imageUrl,
      fssai,
      offer,
      tags,
      subscriptionOptions,
      seller,
      shelfLife,
    } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.category = category ?? product.category;
      product.variations = variations ?? product.variations;
      product.description = description ?? product.description;
      product.imageUrl = imageUrl ?? product.imageUrl;
      product.fssai = fssai ?? product.fssai;
      product.offer = offer ?? product.offer;
      product.tags = tags ?? product.tags;
      product.subscriptionOptions =
        subscriptionOptions ?? product.subscriptionOptions;
      product.seller = seller ?? product.seller;
      product.shelfLife = shelfLife ?? product.shelfLife;

      const updatedProduct = await product.save();

      await logActivity(
        req,
        "Updated product",
        "Product",
        updatedProduct._id,
        `Updated product: ${updatedProduct.name}`
      );

      // Emit stats update via socket
      const stats = await getDashboardStats();
      req.io.emit("stats_update", stats);

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error in updateProduct: ${error.message}`);
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();

      await logActivity(
        req,
        "Deleted product",
        "Product",
        req.params.id,
        `Deleted product: ${product.name}`
      );

      // Emit stats update via socket
      const stats = await getDashboardStats();
      req.io.emit("stats_update", stats);

      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error in deleteProduct: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Bulk upload/update products
// @route   POST /api/products/bulk
// @access  Private/Admin
const bulkUploadProducts = async (req, res) => {
  const productsData = req.body;
  if (!Array.isArray(productsData) || productsData.length === 0) {
    return res.status(400).json({ message: "Invalid product data format." });
  }

  const session = await Product.startSession();
  session.startTransaction();

  try {
    const operations = productsData.map((productInfo) => {
      // Use product name as the unique key for upserting
      const filter = { name: productInfo.name };
      const update = {
        $set: {
          ...productInfo,
          // Ensure imageUrl has a default if not provided
          imageUrl:
            productInfo.imageUrl ||
            `https://picsum.photos/seed/${productInfo.name.replace(
              /\s+/g,
              ""
            )}/400`,
        },
      };
      return {
        updateOne: {
          filter: filter,
          update: update,
          upsert: true,
        },
      };
    });

    const result = await Product.bulkWrite(operations, { session });
    await session.commitTransaction();
    session.endSession();

    const summary = `Bulk upload complete. Created: ${result.upsertedCount}, Updated: ${result.modifiedCount}.`;
    await logActivity(
      req,
      "Bulk uploaded products",
      "Product",
      "Multiple",
      summary
    );

    // Emit stats update via socket
    const stats = await getDashboardStats();
    req.io.emit("stats_update", stats);

    res.status(200).json({
      message: "Bulk upload successful!",
      created: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error in bulkUploadProducts: ${error.message}`);
    res
      .status(500)
      .json({
        message: "An error occurred during bulk upload.",
        error: error.message,
      });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
};
