const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true }, // e.g., "Created product", "Updated order status"
    targetType: { type: String }, // "Product", "Order", "Customer"
    targetId: { type: String }, // e.g., product._id or order.id
    details: { type: String }, // e.g. "Set status to Shipped for order #A0001"
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);