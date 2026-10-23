import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart, MessageSquare, Trash2, CheckCircle2, Zap } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/products/${id}/reviews`);
      setReviews(res.data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data && res.data.data) {
        const productIds = res.data.data.products.map(p => typeof p === 'object' ? p._id : p);
        setIsWishlisted(productIds.includes(id));
      }
    } catch (err) {
      // User likely not logged in
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    checkWishlist();
  }, [id]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product?.stock) setQuantity(quantity + 1);
  };

  const toast = useToast();

  const toggleWishlist = async () => {
    if (!user) {
      toast.warning('Please log in to manage your wishlist');
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
        toast.info('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${id}`);
        setIsWishlisted(true);
        toast.success('Saved to wishlist!');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg({ type: 'error', text: 'Please sign in to post a review' });
      return;
    }
    if (!comment.trim()) {
      setReviewMsg({ type: 'error', text: 'Please enter a review comment' });
      return;
    }

    setSubmittingReview(true);
    setReviewMsg({ type: '', text: '' });
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMsg({ type: 'success', text: 'Thank you! Your review has been submitted.' });
      setComment('');
      fetchReviews();
      fetchProduct(); // to update average rating and numReviews
    } catch (err) {
      setReviewMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to submit review' 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/products/${id}/reviews/${reviewId}`);
      toast.info('Review deleted');
      fetchReviews();
      fetchProduct();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Product not found'}</h2>
        <Link to="/products" className="text-primary hover:underline">Back to products</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to products
        </Link>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 mb-12">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex items-center justify-center relative aspect-square">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
              {product.discountPrice > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-md shadow-sm">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              )}
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition text-gray-400 hover:text-red-500 border border-gray-100"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-6 h-6 transition ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 text-sm text-primary font-semibold tracking-wide uppercase">
              {product.category?.name || 'Category'}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="text-gray-500 mb-4">
              Brand: <span className="font-medium text-gray-800">{product.brand}</span>
            </div>
            
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-sm font-semibold text-gray-700 ml-2">
                {product.rating ? product.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-sm text-gray-400 ml-1">({product.numReviews || 0} reviews)</span>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-end gap-3 mb-2">
                {product.discountPrice > 0 ? (
                  <>
                    <span className="text-4xl font-extrabold text-gray-900">₹{product.discountPrice}</span>
                    <span className="text-xl text-gray-400 line-through mb-1">₹{product.price}</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-gray-900">₹{product.price}</span>
                )}
              </div>
              <div className="text-sm text-gray-500">Inclusive of all taxes</div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Pack Size</h3>
              <div className="inline-block border-2 border-primary bg-primary/5 rounded-lg px-4 py-2 font-medium text-primary">
                {product.quantity} {product.unit}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {!isOutOfStock ? (
                <>
                  <div className="flex items-center border border-gray-300 rounded-lg h-12 w-32 bg-white">
                    <button 
                      onClick={handleDecrease}
                      className="flex-1 flex justify-center items-center text-gray-600 hover:text-primary transition"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
                    <button 
                      onClick={handleIncrease}
                      className="flex-1 flex justify-center items-center text-gray-600 hover:text-primary transition"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={async () => {
                      const res = await addToCart(product._id, quantity);
                      if (res.success) {
                        toast.success(`${quantity}x ${product.name} added to your cart!`);
                      } else {
                        toast.error(res.message || 'Could not add to cart');
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to Basket</span>
                  </button>
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className={`h-12 px-4 rounded-lg border flex items-center justify-center gap-2 font-medium transition ${
                      isWishlisted 
                        ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                  </button>
                </>
              ) : (
                <div className="w-full bg-gray-200 text-gray-500 h-12 rounded-lg font-bold flex items-center justify-center">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-gray-700">Superfast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-gray-700">Quality Checked</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Product Description</h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews & Ratings Section */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Customer Ratings & Reviews</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Overall Rating & Write Review Form */}
            <div className="lg:col-span-1 space-y-6">
              {/* Rating Card */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                <div className="text-5xl font-black text-gray-900 mb-2">
                  {product.rating ? product.rating.toFixed(1) : '0.0'}
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < Math.round(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Based on {product.numReviews || 0} customer {product.numReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Review Form */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                
                {reviewMsg.text && (
                  <div className={`p-3 rounded-lg mb-4 text-sm flex items-center gap-2 ${
                    reviewMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {reviewMsg.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {reviewMsg.text}
                  </div>
                )}

                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Your Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none transition hover:scale-110"
                          >
                            <Star 
                              className={`w-7 h-7 ${
                                star <= (hoverRating || rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="text-sm font-bold text-gray-600 ml-2">
                          {(hoverRating || rating)} / 5
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Your Feedback</label>
                      <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your honest opinion about this product..."
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 text-sm mb-4">Please log in to share your experience with this item.</p>
                    <Link
                      to="/login"
                      className="inline-block bg-primary text-white font-medium px-5 py-2 rounded-lg hover:bg-primary-dark transition text-sm"
                    >
                      Sign In to Review
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Reviews ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No reviews yet for this product.</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => {
                    const isAuthor = user && (user._id === rev.user?._id || user._id === rev.user);
                    const isAdmin = user && user.role === 'admin';
                    const canDelete = isAuthor || isAdmin;

                    return (
                      <div key={rev._id} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                              {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{rev.name}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteReview(rev._id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                                title="Delete Review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mt-2 pl-12">
                          {rev.comment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
