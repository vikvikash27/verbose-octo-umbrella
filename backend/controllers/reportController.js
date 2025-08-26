const Order = require('../models/Order');
const Product = require('../models/Product');

const getReportData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the whole end day

        const dateFilter = {
            orderTimestamp: { $gte: start, $lte: end },
            status: { $ne: 'Cancelled' }
        };

        // 1. Sales Over Time
        const salesOverTime = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderTimestamp" } },
                    totalSales: { $sum: "$total" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Top Selling Products
        const topSellingProducts = await Order.aggregate([
            { $match: dateFilter },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    productName: { $first: "$items.productName" },
                    unitsSold: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: Product.collection.name,
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: 1,
                    unitsSold: 1,
                    totalRevenue: 1,
                    imageUrl: { $arrayElemAt: ["$productDetails.imageUrl", 0] }
                }
            }
        ]);
        
        // 3. Sales by Category
        const salesByCategory = await Order.aggregate([
            { $match: dateFilter },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: Product.collection.name,
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.category',
                    totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);


        res.json({
            summary: {
                totalRevenue: salesOverTime.reduce((acc, cur) => acc + cur.totalSales, 0),
                totalOrders: salesOverTime.reduce((acc, cur) => acc + cur.orderCount, 0),
            },
            salesOverTime: salesOverTime.map(s => ({ date: s._id, sales: s.totalSales })),
            topSellingProducts,
            salesByCategory: salesByCategory.map(c => ({ category: c._id, sales: c.totalSales })),
        });

    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getReportData };
