const Order = require('../models/Order');
const Product = require('../models/Product');

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

    const revenueMatch = { status: { $ne: 'Cancelled' } };
    if (dateFilter.orderTimestamp) {
        revenueMatch.orderTimestamp = dateFilter.orderTimestamp;
    }

    const totalRevenue = await Order.aggregate([
        { $match: revenueMatch },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const newOrdersCount = await Order.countDocuments({ status: 'Pending', ...dateFilter });
    const totalProducts = await Product.countDocuments(); // This is not date-dependent
    const recentOrders = await Order.find().sort({ orderTimestamp: -1 }).limit(5); // Stays "most recent"

    return {
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        newOrdersCount,
        totalProducts,
        recentOrders
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    // Return a default/empty state on error to prevent crashes
    return {
        totalRevenue: 0,
        newOrdersCount: 0,
        totalProducts: 0,
        recentOrders: []
    };
  }
};

const getStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const stats = await getDashboardStats(startDate, endDate);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getStats, getDashboardStats };