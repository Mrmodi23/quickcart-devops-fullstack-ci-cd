import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlist(res.data.data);
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res.success) {
      removeFromWishlist(product._id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Heart className="text-primary fill-primary w-6 h-6" /> My Wishlist
        </h1>

        {!wishlist?.products || wishlist.products.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100 max-w-2xl mx-auto">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love here to buy them later.</p>
            <Link to="/products" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-md transition inline-block">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.products.map(product => (
              <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition group border border-gray-100 flex flex-col h-full">
                <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden p-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition duration-300" />
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="text-sm text-gray-500 mb-1">{product.quantity} {product.unit}</div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link to={`/products/${product._id}`} className="hover:text-primary">
                      {product.name}
                    </Link>
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-lg text-gray-900">
                        ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
                      </span>
                      {product.discountPrice > 0 && (
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.stock > 0 ? 'Move to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
