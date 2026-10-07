import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { Filter, ChevronDown, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const keyword = queryParams.get('keyword') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?`;
        if (keyword) url += `keyword=${keyword}&`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (sortOrder) url += `sort=${sortOrder}&`;

        const res = await api.get(url);
        setProducts(res.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [keyword, selectedCategory, sortOrder]);

  const [wishlistItems, setWishlistItems] = useState([]);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data && res.data.data) {
          setWishlistItems(res.data.data.products.map(p => typeof p === 'object' ? p._id : p));
        }
      } catch (err) {
        // Not logged in or error
      }
    };
    fetchWishlist();
  }, []);

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    try {
      if (wishlistItems.includes(productId)) {
        await api.delete(`/wishlist/${productId}`);
        setWishlistItems(wishlistItems.filter(id => id !== productId));
      } else {
        await api.post(`/wishlist/${productId}`);
        setWishlistItems([...wishlistItems, productId]);
      }
    } catch (err) {
      alert('Please login to use wishlist');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {keyword && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Search results for "{keyword}"
          </h2>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-lg mb-4 border-b pb-3">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category"
                      className="form-radio text-primary focus:ring-primary h-4 w-4"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                    />
                    <span className="ml-2 text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        className="form-radio text-primary focus:ring-primary h-4 w-4"
                        checked={selectedCategory === cat._id}
                        onChange={() => setSelectedCategory(cat._id)}
                      />
                      <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
              <span className="text-gray-500 font-medium">{products.length} products found</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-primary font-medium text-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Newest</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white text-center py-20 rounded-xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col h-full">
                    <Link to={`/products/${product._id}`} className="block relative pt-[100%] bg-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal"
                      />
                      {product.discountPrice > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                      )}
                      <button 
                        onClick={(e) => toggleWishlist(e, product._id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full shadow hover:bg-white transition text-gray-400 hover:text-red-500 z-10"
                        title={wishlistItems.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`w-4 h-4 ${wishlistItems.includes(product._id) ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-xs text-gray-500 mb-1">{product.quantity} {product.unit}</div>
                      <Link to={`/products/${product._id}`} className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary">
                        {product.name}
                      </Link>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          {product.discountPrice > 0 ? (
                            <>
                              <span className="font-bold text-lg text-gray-900">₹{product.discountPrice}</span>
                              <span className="text-sm text-gray-400 line-through ml-1">₹{product.price}</span>
                            </>
                          ) : (
                            <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                          )}
                        </div>
                        <button 
                          onClick={async (e) => {
                            e.preventDefault();
                            const res = await addToCart(product._id, 1);
                            if (res.success) {
                              alert('Added to cart!');
                            }
                          }}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-md font-medium transition border border-primary/20"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
