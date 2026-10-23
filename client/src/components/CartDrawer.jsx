import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 25;

const CartDrawer = () => {
  const { 
    cart, 
    isDrawerOpen, 
    closeDrawer, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartSavings,
    getCartCount 
  } = useContext(CartContext);
  
  const toast = useToast();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const total = getCartTotal();
  const savings = getCartSavings();
  const count = getCartCount();
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const freeDeliveryProgress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);
  const isFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-gray-100 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/60 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-base">My Cart</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {count} {count === 1 ? 'item' : 'items'} in your basket
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress bar */}
          <div className="px-5 py-3 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="font-bold">🎉 Free Express Delivery unlocked!</span>
                ) : (
                  <span>Add <span className="font-bold">₹{remainingForFreeDelivery}</span> more for Free Delivery</span>
                )}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {(!cart?.items || cart.items.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-gray-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                  Add fresh groceries, snacks and daily essentials to get delivery in 10-20 minutes!
                </p>
                <button
                  onClick={closeDrawer}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.items.map((item) => {
                const prod = item.product;
                if (!prod) return null;
                const unitPrice = prod.discountPrice > 0 ? prod.discountPrice : prod.price;

                return (
                  <div 
                    key={prod._id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/40 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-200 group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center border border-gray-100 dark:border-slate-700/60 overflow-hidden">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => {
                              removeFromCart(prod._id);
                              toast.info(`Removed ${prod.name}`);
                            }}
                            className="text-gray-400 hover:text-rose-500 transition p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {prod.quantity} {prod.unit}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            ₹{unitPrice * item.quantity}
                          </span>
                          {prod.discountPrice > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{prod.price * item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center bg-gray-100 dark:bg-slate-700/60 rounded-lg p-0.5 border border-gray-200/60 dark:border-slate-600/60">
                          <button
                            onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                            disabled={item.quantity >= prod.stock}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-600 transition disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bill & Action */}
          {cart?.items?.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/80 space-y-3.5">
              {savings > 0 && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <span>Total Discount Savings</span>
                  <span>-₹{savings}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">₹{deliveryFee}</span>
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200/80 dark:border-slate-700/80 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-primary text-base">₹{total + deliveryFee}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 px-3 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/25 flex items-center justify-center gap-1.5 group"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Safe & contactless express delivery</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
