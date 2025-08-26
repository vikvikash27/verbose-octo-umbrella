const User = require('../models/User');
const Order = require('../models/Order');


// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password');
        // The frontend expects a specific format, let's map it.
        const formattedCustomers = customers.map(c => ({
            id: c._id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            avatar: c.avatar,
            totalSpent: c.totalSpent,
            lastOrder: c.lastOrder ? new Date(c.lastOrder).toISOString().split('T')[0] : 'N/A',
        }));
        res.json(formattedCustomers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single customer by ID with their orders
// @route   GET /api/customers/:id
// @access  Private/Admin
const getCustomerById = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id).select('-password');
        if (!customer || customer.role !== 'customer') {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const orders = await Order.find({ customer: req.params.id }).sort({ orderTimestamp: -1 });
        
        const customerData = {
            id: customer._id,
            name: customer.name,
            email: customer.email,
            avatar: customer.avatar,
            phone: customer.phone,
            totalSpent: customer.totalSpent,
            lastOrder: customer.lastOrder,
            createdAt: customer.createdAt,
            orders: orders,
        };

        res.json(customerData);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getCustomers,
    getCustomerById,
};