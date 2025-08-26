const Order = require('../models/Order');
const Card = require('../models/Card');
const { createOrder } = require('../controllers/orderController');

// @desc    Get all payment data (derived from orders)
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
    try {
        // Fetch all orders, as payment data is derived from them
        const orders = await Order.find({}).sort({ orderTimestamp: -1 });

        // Map order data to the payment format, handling potential missing data gracefully.
        const payments = orders.map(order => {
            const paymentDate = (order.orderTimestamp && !isNaN(new Date(order.orderTimestamp)))
                ? new Date(order.orderTimestamp).toISOString().split('T')[0]
                : 'N/A';

            return {
                transactionId: order.transactionId || 'N/A',
                orderId: order.id,
                amount: order.total,
                date: paymentDate,
                method: order.paymentMethod || 'N/A',
                status: order.status === 'Cancelled' ? 'Refunded' : (order.status === 'Pending' && order.paymentMethod === 'Card') ? 'Pending' : 'Completed',
            };
        });
        
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payment data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Process a card payment and create an order
// @route   POST /api/payments/process
// @access  Private
const processPayment = async (req, res, next) => {
    const { cardDetails, orderPayload } = req.body;

    try {
        // --- Step 1: Validate Card Details (Simulated) ---
        if (!cardDetails.cardHolderName || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
            return res.status(400).json({ message: 'Invalid card details provided.' });
        }
        
        // --- Step 2: Save Dummy Card Info for Testing ---
        // In a real app, you would integrate with a payment gateway here.
        await new Card({
            user: req.user._id,
            cardHolderName: cardDetails.cardHolderName,
            cardNumberLast4: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
            expiryDate: cardDetails.expiryDate,
        }).save();

        // --- Step 3: Forward to Order Creation ---
        // Prepare the request body for the createOrder controller
        req.body = {
            ...orderPayload,
            paymentMethod: 'Card',
            transactionId: `txn_card_${Date.now()}`
        };

        // Call the createOrder controller to finalize the order
        return createOrder(req, res, next);

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: 'Server Error during payment processing.' });
    }
};


module.exports = {
    getPayments,
    processPayment,
};