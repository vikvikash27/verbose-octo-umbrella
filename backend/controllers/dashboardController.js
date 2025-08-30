// const Order = require('../models/Order');
// const Product = require('../models/Product');

// const getDashboardStats = async (startDate, endDate) => {
//   try {
//     const dateFilter = {};
//     if (startDate && endDate) {
//         // Set endDate to the end of the day
//         const endOfDay = new Date(endDate);
//         endOfDay.setHours(23, 59, 59, 999);

//         dateFilter.orderTimestamp = {
//             $gte: new Date(startDate),
//             $lte: endOfDay,
//         };
//     }

//     const revenueMatch = { status: { $ne: 'Cancelled' } };
//     if (dateFilter.orderTimestamp) {
//         revenueMatch.orderTimestamp = dateFilter.orderTimestamp;
//     }

//     const totalRevenue = await Order.aggregate([
//         { $match: revenueMatch },
//         { $group: { _id: null, total: { $sum: '$total' } } }
//     ]);

//     const newOrdersCount = await Order.countDocuments({ status: 'Pending', ...dateFilter });
//     const totalProducts = await Product.countDocuments(); // This is not date-dependent
//     const recentOrders = await Order.find().sort({ orderTimestamp: -1 }).limit(5); // Stays "most recent"

//     return {
//         totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
//         newOrdersCount,
//         totalProducts,
//         recentOrders
//     };
//   } catch (error) {
//     console.error('Error calculating dashboard stats:', error);
//     // Return a default/empty state on error to prevent crashes
//     return {
//         totalRevenue: 0,
//         newOrdersCount: 0,
//         totalProducts: 0,
//         recentOrders: []
//     };
//   }
// };

// const getStats = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;
//         const stats = await getDashboardStats(startDate, endDate);
//         res.json(stats);
//     } catch (error) {
//         console.error('Error fetching dashboard stats:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getStats, getDashboardStats };

/////////////////////////Product Unit Test Code///////////////////////////
const Order = require("../models/Order");
const Product = require("../models/Product");

const getDashboardStats = async (startDate, endDate) => {
  try {
    const dateFilter = {};
    if (startDate && endDate) {
      // Set endDate to the end of the day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      dateFilter.orderTimestamp = {
        $gte: new Date(startDate),
        $lte: endOfDay,
      };
    }

    const revenueMatch = { status: { $ne: "Cancelled" } };
    if (dateFilter.orderTimestamp) {
      revenueMatch.orderTimestamp = dateFilter.orderTimestamp;
    }

    const totalRevenue = await Order.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const newOrdersCount = await Order.countDocuments({
      status: "Pending",
      ...dateFilter,
    });
    const totalProducts = await Product.countDocuments(); // This is not date-dependent
    const recentOrders = await Order.find()
      .sort({ orderTimestamp: -1 })
      .limit(5); // Stays "most recent"

    return {
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      newOrdersCount,
      totalProducts,
      recentOrders,
    };
  } catch (error) {
    console.error("Error calculating dashboard stats:", error);
    // Return a default/empty state on error to prevent crashes
    return {
      totalRevenue: 0,
      newOrdersCount: 0,
      totalProducts: 0,
      recentOrders: [],
    };
  }
};

const getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getDashboardStats(startDate, endDate);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$customer",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastPurchase: { $max: "$orderTimestamp" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$customerDetails.name",
          avatar: "$customerDetails.avatar",
          orderCount: 1,
          totalSpent: 1,
          lastPurchase: 1,
        },
      },
    ]);
    res.json(topCustomers);
  } catch (error) {
    console.error("Error fetching top customers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getStats, getDashboardStats, getTopCustomers };
