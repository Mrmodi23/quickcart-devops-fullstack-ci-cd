import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Tag, 
  Check, 
  ChevronRight 
} from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 25;

const Cart = () => {
  const { 
    cart, 
    loading, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartSavings 
  } = useContext(CartContext);
  
  const navigate = useNavigate();
  const toast = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [tipAmount, setTipAmount] = useState(0);

  const handleDecrease = (productId, currentQuantity, name) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
      toast.info(`Removed ${name} from cart`);
    }
  };

  const handleIncrease = (productId, currentQuantity, stock, name) => {
    if (currentQuantity < stock) {
      updateQuantity(productId, currentQuantity + 1);
    } else {
      toast.warning(`Maximum stock limit reached for ${name}`);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'QUICK50') {
      setAppliedCoupon({ code: 'QUICK50', discount: 50 });
      toast.success('Coupon QUICK50 applied: ₹50 discount!');
    } else if (code === 'FRESH10') {
      setAppliedCoupon({ code: 'FRESH10', discount: Math.round(cartTotal * 0.1) });
      toast.success('Coupon FRESH10 applied: 10% discount!');
    } else {
      toast.error('Invalid coupon code. Try QUICK50 or FRESH10');
    }
  };

  if (loading && (!cart || !cart.items)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        <p className="text-xs font-semibold text-gray-400">Loading your cart items...</p>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-gray-50/50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 text-center max-w-md w-full">
          <div className="w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Your basket is empty</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Stock up on farm-fresh veggies, bakery, snacks, and milk with 10-20 min lightning delivery!
          </p>
          <Link 
            to="/products" 
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all block text-center"
          >
            Start Exploring Products
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const savings = getCartSavings();
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const grandTotal = Math.max(0, cartTotal - couponDiscount + deliveryFee + tipAmount);
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);

  return (
    <div className="bg-gray-50/70 dark:bg-slate-950 min-h-screen py-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Express Delivery in 10-15 Minutes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Shopping Basket</h1>
          </div>
          <Link 
            to="/products" 
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>+ Add more groceries</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            
            {/* Free Delivery Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {isFreeDelivery ? (
                    <span>🎉 You have unlocked <span className="underline">FREE Express Delivery</span>!</span>
                  ) : (
                    <span>Add items worth <span className="font-extrabold text-emerald-700 dark:text-emerald-200">₹{remainingForFree}</span> more for Free Delivery</span>
                  )}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400">
                  {Math.min(100, Math.round((cartTotal / FREE_DELIVERY_THRESHOLD) * 100))}%
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
              {cart.items.map((item) => {
                const prod = item.product;
                if (!prod) return null;
                const unitPrice = prod.discountPrice > 0 ? prod.discountPrice : prod.price;

                return (
                  <div key={prod._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition">
                    
                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-50 dark:bg-slate-800 rounded-2xl p-2 border border-gray-100 dark:border-slate-700 flex items-center justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {prod.quantity} {prod.unit}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5 mb-1 truncate">
                        <Link to={`/products/${prod._id}`} className="hover:text-emerald-600 transition">
                          {prod.name}
                        </Link>
                      </h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="font-extrabold text-base text-gray-900 dark:text-white">
                          ₹{unitPrice}
                        </span>
                        {prod.discountPrice > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{prod.price}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">each</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Stepper */}
                      <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1 border border-gray-200 dark:border-slate-700">
                        <button 
                          onClick={() => handleDecrease(prod._id, item.quantity, prod.name)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition"
                          aria-label="Decrease"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-9 text-center font-extrabold text-sm text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleIncrease(prod._id, item.quantity, prod.stock, prod.name)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-40"
                          disabled={item.quantity >= prod.stock}
                          aria-label="Increase"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <div className="font-extrabold text-base text-gray-900 dark:text-white">
                          ₹{unitPrice * item.quantity}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          removeFromCart(prod._id);
                          toast.info(`Removed ${prod.name}`);
                        }}
                        className="p-2 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Delivery Tip selector */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                Tip your delivery partner 🛵
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                100% of your tip goes directly to the driver who delivers in record time!
              </p>
              <div className="flex flex-wrap gap-2">
                {[0, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      tipAmount === amount
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {amount === 0 ? 'No tip' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bill Summary Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sticky top-24 space-y-6">
              
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800">
                Bill Summary
              </h2>

              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter QUICK50"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})</span>
                  </div>
                )}
              </form>

              {/* Cost breakdown */}
              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{cartTotal}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Product Savings</span>
                    <span>-₹{savings}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">₹{deliveryFee}</span>
                    )}
                  </span>
                </div>

                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Partner Tip</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{tipAmount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex justify-between items-baseline text-sm font-extrabold text-gray-900 dark:text-white">
                  <span>To Pay</span>
                  <span className="text-xl text-emerald-600 dark:text-emerald-400 font-black">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-1 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Safe and encrypted 256-bit checkout</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
