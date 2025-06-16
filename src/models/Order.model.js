import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1']
        }
      }
    ],
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length > 0;
      },
      message: 'Order must contain at least one product.'
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be non-negative']
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
