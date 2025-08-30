// const mongoose = require('mongoose');

// const CategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Category', CategorySchema);



const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Pre-save hook to generate slug from name
CategorySchema.pre('validate', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);