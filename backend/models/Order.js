const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: String,
  location: {
    lat: Number,
    lng: Number,
  },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  quantity: Number,
  price: Number,
  subscription: { type: String }, // To store subscription choice e.g., 'Weekly'
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'], required: true },
    timestamp: { type: Date, default: Date.now },
    notes: String,
}, { _id: false });


const OrderSchema = new mongoose.Schema({
  // Using default Mongo _id, but keeping a custom, human-readable ID
  id: { type: String, required: true, unique: true }, 
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Card', 'COD'] },
  transactionId: { type: String },
  address: addressSchema,
  statusHistory: [statusHistorySchema],
}, { timestamps: { createdAt: 'orderTimestamp' } }); // Use mongoose timestamp as the order timestamp

module.exports = mongoose.model('Order', OrderSchema);