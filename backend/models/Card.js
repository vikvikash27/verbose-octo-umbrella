const mongoose = require('mongoose');

// This model is for storing dummy card information for testing purposes ONLY.
// In a production environment, you must use a PCI-compliant payment gateway like Stripe or Razorpay
// and never store full card numbers on your server.

const CardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardHolderName: { type: String, required: true },
  // Only storing the last 4 digits for security, even in a test environment.
  cardNumberLast4: { type: String, required: true, length: 4 },
  expiryDate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);