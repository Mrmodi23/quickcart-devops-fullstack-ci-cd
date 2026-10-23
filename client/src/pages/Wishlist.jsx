import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.data || { products: [] });
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(prev => ({
        ...prev,
        products: prev.products.filter(p => p._id !== productId)
      }));
      toast.info('Item removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="bg-gray-50/70 dark:bg-slate-950 min-h-screen py-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-600 mb-2 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to store
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <span>My Wishlist ({products.length})</span>
            </h1>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-sm text-center border border-gray-100 dark:border-slate-800 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tap the heart icon on any grocery item to save it for quick reordering anytime.
            </p>
            <Link 
              to="/products" 
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition inline-block"
            >
              Explore Fresh Groceries
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={true}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
