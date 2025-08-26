const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., '500g', 'Small', '1kg'
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  offer: { type: String }, // e.g., 'Save 10%'
  tags: { type: [String], default: [] }, // e.g., ['Organic', 'Fresh']
  subscriptionOptions: { type: [String], default: [] }, // e.g., ['Daily', 'Weekly']
  
  variations: {
    type: [variationSchema],
    required: true,
    validate: [v => Array.isArray(v) && v.length > 0, 'At least one product variation is required.']
  },

  totalStock: { type: Number, default: 0 },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'Out of Stock' },
  
  imageUrl: { type: String, required: true },
  description: { type: String }, // Will be newline-separated for bullets
  fssai: { type: String },
  seller: { type: String }, // e.g., 'EasyOrganic Farms'
  shelfLife: { type: String }, // e.g., '3 days'
}, { timestamps: true });

// Middleware to update totalStock and status based on variations before saving
ProductSchema.pre('save', function (next) {
  if (this.isModified('variations')) {
    this.totalStock = this.variations.reduce((acc, v) => acc + v.stock, 0);
    
    if (this.totalStock > 10) {
      this.status = 'In Stock';
    } else if (this.totalStock > 0) {
      this.status = 'Low Stock';
    } else {
      this.status = 'Out of Stock';
    }
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);