import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleIncrease = (productId, currentQuantity, stock) => {
    if (currentQuantity < stock) {
      updateQuantity(productId, currentQuantity + 1);
    }
  };

  if (loading && (!cart || !cart.items)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-primary-dark transition block w-full">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <li key={item.product._id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="text-sm text-gray-500 mb-1">{item.product.quantity} {item.product.unit}</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        <Link to={`/products/${item.product._id}`} className="hover:text-primary">
                          {item.product.name}
                        </Link>
                      </h3>
                      <div className="font-bold text-gray-900">
                        ₹{item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price}
                        {item.product.discountPrice > 0 && (
                          <span className="text-sm font-normal text-gray-400 line-through ml-2">
                            ₹{item.product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg h-10 w-28">
                        <button 
                          onClick={() => handleDecrease(item.product._id, item.quantity)}
                          className="flex-1 flex justify-center items-center text-gray-600 hover:text-primary disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="flex-1 text-center font-medium text-gray-900 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrease(item.product._id, item.quantity, item.product.stock)}
                          className="flex-1 flex justify-center items-center text-gray-600 hover:text-primary disabled:opacity-50"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-primary">Free</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
