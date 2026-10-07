const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please add unit (e.g. kg, g, l, ml, piece)'],
    },
    quantity: {
      type: String,
      required: [true, 'Please add quantity size (e.g. 500g, 1L, 12 pieces)'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
