const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { getDashboardStats } = require('./dashboardController');
const logActivity = require('../utils/logActivity');

// Helper to generate a unique order ID
const generateOrderId = async () => {
    // Find the order with the highest timestamp to reliably get the last one.
    const lastOrder = await Order.findOne().sort({ orderTimestamp: -1 });
    let newIdNumber = 1;
    if (lastOrder && lastOrder.id) {
        const lastIdNumber = parseInt(lastOrder.id.substring(2), 10);
        newIdNumber = lastIdNumber + 1;
    }
    return `#A${newIdNumber.toString().padStart(4, '0')}`;
};

// Helper function to adjust stock levels for an order
const adjustStock = async (order, direction) => {
    const multiplier = direction === 'decrement' ? -1 : 1;
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: multiplier * item.quantity } });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, total, paymentMethod, address, transactionId } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Defensively map items to ensure `productId` is present and include subscription.
        const mappedItems = items.map(item => ({
            productId: item.productId || item._id,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            subscription: item.subscription,
        }));
    
        const orderId = await generateOrderId();
        const now = new Date();

        const newOrder = new Order({
            id: orderId,
            customer: req.user._id,
            customerName: req.user.name,
            customerEmail: req.user.email,
            items: mappedItems,
            total,
            paymentMethod,
            address,
            transactionId: transactionId || `txn_${paymentMethod.toLowerCase()}_${Date.now()}`,
            statusHistory: [{ status: 'Pending', timestamp: now }],
        });

        const createdOrder = await newOrder.save();

        // Update customer's total spent and last order date
        const customer = await User.findById(req.user._id);
        if (customer) {
            customer.totalSpent = (customer.totalSpent || 0) + total;
            customer.lastOrder = now;
            await customer.save();
        }

        // Emit socket events
        req.io.emit('new_order', createdOrder);
        const stats = await getDashboardStats();
        req.io.emit('stats_update', stats);
        
        res.status(201).json({ message: 'Order placed successfully', order: createdOrder });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderTimestamp: -1 });
        res.json(orders);
    } catch (error) {
        console.error(`Error in getAllOrders: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        // Find by the custom `id` field, not `_id`
        const order = await Order.findOne({ id: decodeURIComponent(req.params.id) }).populate('customer', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if user is admin or the customer who owns the order
        if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }
        
        res.json(order);
    } catch (error) {
        console.error(`Error in getOrderById: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's orders (for customer portal/app)
// @route   GET /api/orders/myorders
// @access  Private
const getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).sort({ orderTimestamp: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const order = await Order.findOne({ id: decodeURIComponent(req.params.id) });

        if (order) {
            const previousStatus = order.status;
            
            if (previousStatus !== status) {
                // Adjust stock based on status change
                if (status === 'Processing' && previousStatus === 'Pending') {
                    await adjustStock(order, 'decrement');
                } else if (status === 'Cancelled' && ['Pending', 'Processing'].includes(previousStatus)) {
                    await adjustStock(order, 'increment');
                } else if (status === 'Pending' && previousStatus === 'Processing') {
                    await adjustStock(order, 'increment');
                }
            }

            order.status = status;
            const newStatusEvent = { status, timestamp: new Date(), ...(notes && { notes }) };
            order.statusHistory.push(newStatusEvent);
            const updatedOrder = await order.save();
            
            await logActivity(req, 'Updated order status', 'Order', updatedOrder.id, `Status changed from ${previousStatus} to ${status}.`);

            // Emit socket events
            req.io.emit('order_updated', updatedOrder);
            const stats = await getDashboardStats();
            req.io.emit('stats_update', stats);
            
            if (status === 'Cancelled') {
                req.io.emit('order_cancelled', { ...updatedOrder.toObject(), message: 'Refund may be required.' });
            }
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(`Error in updateOrderStatus: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel an order (by customer)
// @route   POST /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ id: decodeURIComponent(req.params.id) });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the person cancelling is the one who made the order
        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to cancel this order' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'This order cannot be cancelled as it is already being processed.' });
        }

        order.status = 'Cancelled';
        order.statusHistory.push({ status: 'Cancelled', timestamp: new Date(), notes: 'Cancelled by customer' });
        
        await adjustStock(order, 'increment'); // Restock items
        
        const updatedOrder = await order.save();

        req.io.emit('order_updated', updatedOrder);
        const stats = await getDashboardStats();
        req.io.emit('stats_update', stats);

        res.json(updatedOrder);
    } catch (error) {
        console.error(`Error in cancelOrder: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Bulk update order statuses
// @route   PUT /api/orders/bulk-update-status
// @access  Private/Admin
const bulkUpdateOrderStatus = async (req, res) => {
    try {
        const { orderIds, status } = req.body;
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0 || !status) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        const ordersToUpdate = await Order.find({ id: { $in: orderIds } });

        for (const order of ordersToUpdate) {
            const previousStatus = order.status;
            if (previousStatus !== status) {
                 if (status === 'Processing' && previousStatus === 'Pending') {
                    await adjustStock(order, 'decrement');
                } else if (status === 'Cancelled' && ['Pending', 'Processing'].includes(previousStatus)) {
                    await adjustStock(order, 'increment');
                } else if (status === 'Pending' && previousStatus === 'Processing') {
                    await adjustStock(order, 'increment');
                }
            }
        }
        
        const updateResult = await Order.updateMany(
            { id: { $in: orderIds } },
            [
                { 
                    $set: { 
                        status: status,
                        statusHistory: {
                            $concatArrays: [ "$statusHistory", [ { status: status, timestamp: new Date(), notes: "Bulk update by admin" } ] ]
                        }
                    } 
                }
            ]
        );
        
        await logActivity(req, 'Bulk updated orders', 'Order', orderIds.join(', '), `Set status to ${status} for ${orderIds.length} orders.`);

        // Emit socket events for each updated order to notify clients
        const updatedOrders = await Order.find({ id: { $in: orderIds } });
        updatedOrders.forEach(order => req.io.emit('order_updated', order));
        
        const stats = await getDashboardStats();
        req.io.emit('stats_update', stats);

        res.json({ message: `${updateResult.modifiedCount} orders updated successfully.` });
    } catch (error) {
        console.error(`Error in bulkUpdateOrderStatus: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    cancelOrder,
    generateOrderId,
    bulkUpdateOrderStatus,
};