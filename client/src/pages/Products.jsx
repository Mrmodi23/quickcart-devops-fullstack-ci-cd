import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Filter, ChevronDown, X, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const keyword = queryParams.get('keyword') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('');
  const toast = useToast();

  // Sync category when query param changes
  useEffect(() => {
    setSelectedCategory(queryParams.get('category') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?`;
        if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (sortOrder) url += `sort=${sortOrder}&`;

        const res = await api.get(url);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [keyword, selectedCategory, sortOrder]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSortOrder('');
    navigate('/products');
  };

  const selectedCategoryObj = categories.find(c => c._id === selectedCategory);

  return (
    <div className="bg-gray-50/70 dark:bg-slate-950 min-h-screen py-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Farm & Pantry Supply</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {keyword ? `Search Results for "${keyword}"` : selectedCategoryObj ? selectedCategoryObj.name : 'All Products'}
            </h1>
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {keyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                Keyword: "{keyword}"
                <button 
                  onClick={() => navigate('/products' + (selectedCategory ? `?category=${selectedCategory}` : ''))}
                  className="hover:text-emerald-950"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedCategoryObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                Category: {selectedCategoryObj.name}
                <button onClick={() => setSelectedCategory('')} className="hover:text-emerald-950">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {(keyword || selectedCategory || sortOrder) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-rose-500 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-bold shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`w-full md:w-64 shrink-0 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-extrabold text-base">
                  <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Filter Store</span>
                </div>
                {(selectedCategory || sortOrder) && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {/* Category Radio Group */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                  Product Categories
                </h3>
                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                      selectedCategory === ''
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] opacity-70">Catalog</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                        selectedCategory === cat._id
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Express delivery promo badge */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-xs">
                <div className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                  <span>⚡ Express 10 Min Delivery</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                  Every product is packaged fresh from nearest dark stores for immediate dispatch.
                </p>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 min-w-0">
            
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                Showing <span className="font-extrabold text-gray-900 dark:text-white">{products.length}</span> items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 py-1.5 pl-3.5 pr-8 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="">✨ Featured / Newest</option>
                    <option value="lowest">🏷️ Price: Low to High</option>
                    <option value="highest">💎 Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div 
                    key={n} 
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 space-y-3 animate-pulse"
                  >
                    <div className="w-full pt-[85%] bg-gray-100 dark:bg-slate-800 rounded-xl" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded-md" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-md" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 w-14 bg-gray-200 dark:bg-slate-700 rounded-md" />
                      <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 text-center py-20 px-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  No matching groceries found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search keyword, category, or clear your filters to see more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isWishlisted={wishlistItems.includes(product._id)}
                  />
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
