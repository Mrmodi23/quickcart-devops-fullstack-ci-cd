import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Heart, 
  MapPin, 
  Zap, 
  Package, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, getCartTotal, openDrawer } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2 sm:gap-4">
          
          {/* Logo & Delivery Time Pill */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-700 dark:from-white dark:via-gray-100 dark:to-emerald-400 bg-clip-text text-transparent">
                  QuickCart
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 -mt-1">
                  10 Min Grocery
                </span>
              </div>
            </Link>

            {/* Quick Delivery Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex items-center gap-1 text-emerald-900 dark:text-emerald-200 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Delivery in <span className="font-extrabold text-emerald-700 dark:text-emerald-300">12 Mins</span></span>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                name="search"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200/90 dark:border-slate-700/80 bg-gray-50/70 dark:bg-slate-800/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200"
                placeholder="Search fresh veggies, milk, snacks..."
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
          
          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Products link */}
            <Link 
              to="/products" 
              className={`hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                location.pathname === '/products'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Explore Store
            </Link>
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="p-2 sm:p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-rose-500 transition relative"
              title="Saved Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart Button (triggers slide drawer) */}
            <button
              onClick={openDrawer}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl font-bold text-sm transition-all duration-200 shadow-xs ${
                cartCount > 0
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 shadow-md'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
              title="Open Cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              {cartCount > 0 && (
                <span className="hidden sm:inline-block font-extrabold text-xs">
                  ₹{cartTotal}
                </span>
              )}
            </button>
            
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-700 dark:text-gray-200 text-sm font-semibold border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline-block">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700/60">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700/60 hover:text-emerald-600 transition"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link 
                          to="/orders" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700/60 hover:text-emerald-600 transition"
                        >
                          <Package className="w-4 h-4" />
                          <span>Order History</span>
                        </Link>
                        <Link 
                          to="/addresses" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700/60 hover:text-emerald-600 transition"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link 
                          to="/wishlist" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700/60 hover:text-emerald-600 transition"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Wishlist</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-gray-100 dark:border-slate-700/60">
                        <button 
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }} 
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 md:hidden transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              name="search"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              placeholder="Search groceries..."
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>
      </div>
      
      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-3 space-y-2">
          <Link 
            to="/products" 
            className="flex items-center justify-between p-2.5 rounded-xl font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <span>All Products</span>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Explore
            </span>
          </Link>
          <Link 
            to="/wishlist" 
            className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>My Wishlist</span>
          </Link>
          <button 
            onClick={() => {
              setIsOpen(false);
              openDrawer();
            }}
            className="flex w-full items-center justify-between p-2.5 rounded-xl font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-left"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <span>Cart Drawer</span>
            </div>
            {cartCount > 0 && (
              <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                {cartCount} items
              </span>
            )}
          </button>

          {user ? (
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-1">
              <Link to="/profile" className="block p-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                My Profile
              </Link>
              <Link to="/orders" className="block p-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                My Orders
              </Link>
              <Link to="/addresses" className="block p-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                Addresses
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block p-2.5 rounded-xl font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800">
                  Admin Dashboard
                </Link>
              )}
              <button 
                onClick={logout} 
                className="flex w-full items-center gap-2 p-2.5 rounded-xl font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link 
                to="/login" 
                className="block w-full py-2.5 text-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md"
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
