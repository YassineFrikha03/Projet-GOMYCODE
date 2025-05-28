const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp))$/i.test(value);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
