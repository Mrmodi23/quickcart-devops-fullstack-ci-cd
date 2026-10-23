import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { Plus, Minus, Heart, Zap, Sparkles } from 'lucide-react';

const ProductCard = ({ product, isWishlisted = false, onWishlistToggle }) => {
  const { addToCart, updateQuantity, getItemQuantity, openDrawer } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const cartQty = getItemQuantity(product._id);
  const discountPercent = product.discountPrice > 0 && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warning('Please login to add items to your cart');
      return;
    }
    setIsUpdating(true);
    const res = await addToCart(product._id, 1);
    setIsUpdating(false);
    if (res.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(res.message || 'Could not add to cart');
    }
  };

  const handleIncrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQty >= product.stock) {
      toast.warning(`Only ${product.stock} units available in stock`);
      return;
    }
    setIsUpdating(true);
    await updateQuantity(product._id, cartQty + 1);
    setIsUpdating(false);
  };

  const handleDecrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);
    await updateQuantity(product._id, cartQty - 1);
    setIsUpdating(false);
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warning('Please log in to manage your wishlist');
      return;
    }
    if (onWishlistToggle) {
      onWishlistToggle(product._id);
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        setWishlisted(false);
        toast.info(`Removed ${product.name} from wishlist`);
      } else {
        await api.post(`/wishlist/${product._id}`);
        setWishlisted(true);
        toast.success(`Saved ${product.name} to wishlist!`);
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-600/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm tracking-wide">
            {discountPercent}% OFF
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlistClick}
        disabled={wishlistLoading}
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-100 dark:border-slate-700 text-gray-400 hover:text-rose-500"
        title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart 
          className={`w-4 h-4 transition-all duration-200 ${
            wishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
          }`} 
        />
      </button>

      {/* Image container */}
      <Link 
        to={`/products/${product._id}`} 
        className="block relative pt-[90%] bg-gradient-to-b from-gray-50/80 to-gray-50 dark:from-slate-800 dark:to-slate-800/90 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* 10 MIN delivery chip */}
        <div className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-slate-700 shadow-xs">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>10-15 MINS</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            {product.quantity} {product.unit}
          </div>
          <Link 
            to={`/products/${product._id}`}
            className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Interactive Add Stepper */}
        <div className="mt-3.5 pt-2.5 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            {product.discountPrice > 0 && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Save ₹{product.price - product.discountPrice}
              </span>
            )}
          </div>

          {/* Add to cart / Stepper */}
          {cartQty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={isUpdating || product.stock === 0}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm hover:shadow-emerald-500/20 active:scale-95'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add'}</span>
            </button>
          ) : (
            <div className="flex items-center bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/25 p-0.5 border border-emerald-600 animate-in zoom-in-95 duration-200">
              <button
                onClick={handleDecrement}
                disabled={isUpdating}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-7 text-center font-extrabold text-xs">
                {cartQty}
              </span>
              <button
                onClick={handleIncrement}
                disabled={isUpdating || cartQty >= product.stock}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
