import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Percent, 
  ChevronRight,
  Flame,
  Award,
  Truck
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import heroGroceryImg from '../assets/hero_grocery.jpg';

const QUICK_SEARCH_CHIPS = [
  'Milk & Dairy',
  'Fresh Fruits',
  'Organic Greens',
  'Bakery',
  'Snacks & Munchies',
  'Beverages'
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlistIds, setWishlistIds] = useState([]);
  const navigate = useNavigate();

  // Flash deal countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data?.data?.products) {
          setWishlistIds(res.data.data.products.map(p => typeof p === 'object' ? p._id : p));
        }
      } catch (err) {
        // Not logged in or error
      }
    };
    fetchWishlist();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => {
        const catId = p.category?._id || p.category;
        return catId === selectedCategory;
      });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-950/60 animate-ping opacity-25"></div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 animate-pulse">
          Loading farm-fresh groceries...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/60 dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white pt-10 pb-16 lg:py-20">
        
        {/* Ambient background glow orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Delivery Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md shadow-lg">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-xs font-bold tracking-wide uppercase text-emerald-200">
                  Instant 10-20 Min Delivery
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Fresh Groceries <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  Delivered in Minutes.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Farm-picked organic produce, daily dairy, fresh bakes, and pantry staples — straight from local stores to your kitchen in pristine quality.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link 
                  to="/products"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-bold text-white">Free Delivery</div>
                    <div className="text-emerald-200">On orders above ₹499</div>
                  </div>
                </div>
              </div>

              {/* Quick Tags / Chips */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-emerald-300/80 mb-2 uppercase tracking-wider">
                  Popular Searches:
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {QUICK_SEARCH_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(`/products?keyword=${encodeURIComponent(chip)}`)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-emerald-100 hover:text-white transition-all duration-150 backdrop-blur-xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: 3D Hero Render with Floating Micro-cards */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Glowing backdrop card */}
                <div className="relative rounded-3xl p-3 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden group">
                  <img
                    src={heroGroceryImg}
                    alt="QuickCart Fresh Groceries"
                    className="w-full h-auto rounded-2xl object-cover shadow-inner group-hover:scale-102 transition duration-500"
                  />
                  
                  {/* Floating Stat 1: 12 Mins Delivery */}
                  <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 flex items-center gap-2.5 animate-bounce-subtle">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Zap className="w-4 h-4 fill-amber-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Avg. Time</div>
                      <div className="text-xs font-extrabold text-gray-900 dark:text-white">12 Minutes ⚡</div>
                    </div>
                  </div>

                  {/* Floating Stat 2: Rating */}
                  <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Trust Score</div>
                      <div className="text-xs font-extrabold text-gray-900 dark:text-white">4.9 ★ (25k+ orders)</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Value Propositions */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">10-20 Min Delivery</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Order to doorstep in flash</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">100% Quality Check</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Zero question replacement</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Best Market Prices</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Direct from local farms</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/60 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Free Express Shipping</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Available on orders ₹499+</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Flash Deals of the Hour Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-extrabold uppercase tracking-wider text-amber-200">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Flash Sale of the Hour</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Get Up to 40% OFF On Fresh Daily Essentials
            </h3>
            <p className="text-sm text-amber-100 max-w-lg">
              Stock up your refrigerator with fresh dairy, greens, and fruits before the timer expires!
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-black/30 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-center min-w-[56px] border border-white/20">
              <span className="text-2xl font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-amber-200">Hours</span>
            </div>
            <span className="text-2xl font-black">:</span>
            <div className="bg-black/30 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-center min-w-[56px] border border-white/20">
              <span className="text-2xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-amber-200">Mins</span>
            </div>
            <span className="text-2xl font-black">:</span>
            <div className="bg-black/30 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-center min-w-[56px] border border-white/20">
              <span className="text-2xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-amber-200">Secs</span>
            </div>

            <Link
              to="/products"
              className="ml-2 px-5 py-3 rounded-2xl bg-white text-gray-900 font-extrabold text-sm hover:bg-amber-50 transition shadow-lg shrink-0"
            >
              Grab Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Handpicked staples for everyday cooking & living
            </p>
          </div>
          <Link 
            to="/products" 
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link 
              key={category._id} 
              to={`/products?category=${category._id}`} 
              className="group flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-gray-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600/50 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 dark:bg-slate-700/50 p-2 mb-2 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-slate-700/50">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition duration-300" 
                />
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers / Interactive Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Trending Bestsellers
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              All Items
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat._id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
            <p className="text-gray-500 font-medium text-sm">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistIds.includes(product._id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center pb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-sm border border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 shadow-sm transition"
          >
            <span>View All Grocery Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
