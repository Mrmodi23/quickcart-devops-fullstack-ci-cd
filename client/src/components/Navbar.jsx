import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Search, ShoppingCart, User, Menu, X, LogOut, Heart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight text-gray-900">QuickCart</span>
            </Link>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative hidden sm:block">
              <form onSubmit={handleSearch}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search for groceries..."
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </form>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/products" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Products
            </Link>
            
            <Link to="/wishlist" className="text-gray-700 hover:text-primary relative p-2" title="Wishlist">
              <Heart className="h-6 w-6" />
            </Link>

            <Link to="/cart" className="text-gray-700 hover:text-primary relative p-2" title="Cart">
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            <ThemeToggle />

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  <User className="h-5 w-5" />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 w-48 pt-2 origin-top-right opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150 ease-in-out z-50">
                  <div className="bg-white rounded-md shadow-lg border border-gray-100 py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-primary font-medium hover:bg-gray-100">Dashboard</Link>
                    )}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-medium transition">
                Login
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-4 py-2">
              <form onSubmit={handleSearch}>
                <input
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </form>
            </div>
            <Link to="/products" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Products</Link>
            <Link to="/wishlist" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Wishlist</Link>
            <Link to="/cart" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Cart</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Profile</Link>
                <Link to="/orders" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Orders</Link>
                <Link to="/wishlist" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Wishlist</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-base font-medium text-primary hover:bg-gray-50">Admin Dashboard</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2 text-base font-medium text-primary hover:bg-gray-50">Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
