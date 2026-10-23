import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, ChevronRight, Zap } from 'lucide-react';

const MobileCartBar = () => {
  const { cart, getCartTotal, getCartCount, openDrawer } = useContext(CartContext);
  const navigate = useNavigate();

  const count = getCartCount();
  const total = getCartTotal();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden animate-in slide-in-from-bottom duration-300">
      <div 
        onClick={openDrawer}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-between cursor-pointer border border-emerald-400/30 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {count}
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-emerald-100 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Delivering in 12 mins</span>
            </div>
            <div className="text-base font-extrabold">₹{total}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 font-bold text-sm bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
          <span>View Cart</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default MobileCartBar;
