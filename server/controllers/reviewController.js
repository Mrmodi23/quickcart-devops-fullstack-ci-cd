const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create or update product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      alreadyReviewed.name = req.user.name;
      await alreadyReviewed.save();
    } else {
      await Review.create({
        product: productId,
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate average rating & numReviews
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: alreadyReviewed ? 'Review updated' : 'Review added',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if review belongs to user or user is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: req.params.reviewId });

    // Recalculate rating
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0 
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
        : 0;
      await product.save();
    }

    res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProductReview,
  getProductReviews,
  deleteReview,
};
