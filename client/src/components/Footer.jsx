import { Link } from 'react-router-dom';
import { ShoppingBag, Zap, ShieldCheck, Heart, Clock, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
                QuickCart
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              India's premier 10-20 minute instant grocery service. Delivering farm-fresh produce, daily essentials, artisan dairy, and midnight munchies at unmatched speed.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl w-fit">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Average delivery time: 12 minutes</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/products?category=fruits" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products?category=dairy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Dairy & Breakfast
                </Link>
              </li>
              <li>
                <Link to="/products?category=bakery" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Bakery & Bread
                </Link>
              </li>
              <li>
                <Link to="/products?category=snacks" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Snacks & Beverages
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition font-bold text-emerald-600">
                  All Products &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/orders" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Delivery Addresses
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> 24x7 Customer Support
                </span>
              </li>
            </ul>
          </div>

          {/* Safe & Secure */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              QuickCart Promise
            </h4>
            <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>100% Quality guarantee on every fruit & dairy item</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Express dispatch from local temperature-controlled dark stores</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Zero plastic delivery bags & eco-friendly packaging</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} QuickCart Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with ⚡ for ultra-fast grocery commerce
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
