const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
});

// Ensure unique index on name
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
