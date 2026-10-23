import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { MapPin, CreditCard, CheckCircle2, Ticket, Sparkles, ArrowLeft } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 25;

const Checkout = () => {
  const { cart, loading: cartLoading, getCartTotal, clearCart, fetchCart } = useContext(CartContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  
  const [orderProcessing, setOrderProcessing] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        setAddresses(res.data.data);
        const defaultAddress = res.data.data.find(a => a.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        } else if (res.data.data.length > 0) {
          setSelectedAddress(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAddresses();
    // Ensure we have latest cart
    fetchCart();
  }, []);

  const applyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;
    
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: getCartTotal()
      });
      setCouponData(res.data.data);
      toast.success(`Coupon applied: ₹${res.data.data.discountAmount} discount!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon';
      setCouponError(msg);
      toast.error(msg);
      setCouponData(null);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponData(null);
    setCouponError('');
    toast.info('Coupon removed');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.warning('Please select a delivery address');
      return;
    }

    setOrderProcessing(true);
    try {
      const res = await api.post('/orders', {
        addressId: selectedAddress,
        paymentMethod,
        couponCode: couponData?.code || undefined
      });
      
      if (res.data.success) {
        await clearCart();
        toast.success('Order placed successfully! 🚀');
        navigate(`/order-success/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrderProcessing(false);
    }
  };

  if (cartLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="text-primary hover:underline">
          Return to shop
        </button>
      </div>
    );
  }



  const subtotal = getCartTotal();
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const discount = couponData ? couponData.discount : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/cart'))}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary mb-6 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition duration-200" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-primary" /> Delivery Address
                </h2>
                <Link to="/addresses" className="text-primary hover:underline text-sm font-medium">
                  Manage Addresses
                </Link>
              </div>
              
              {addresses.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                  Please add a delivery address to continue.{' '}
                  <Link to="/addresses" className="font-bold underline text-yellow-900">
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr._id)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition ${selectedAddress === addr._id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">{addr.type}</span>
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddress === addr._id} 
                          onChange={() => setSelectedAddress(addr._id)}
                          className="text-primary focus:ring-primary"
                        />
                      </div>
                      <p className="font-medium text-gray-800">{addr.fullName}</p>
                      <p className="text-gray-500 text-sm mt-1">{addr.house}, {addr.street}</p>
                      <p className="text-gray-500 text-sm">{addr.area}, {addr.city}, {addr.state} {addr.pincode}</p>
                      <p className="text-gray-500 text-sm mt-2">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="text-primary" /> Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary focus:ring-primary" />
                  <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary focus:ring-primary" />
                  <span className="ml-3 font-medium text-gray-900">UPI (Mock)</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'Card' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary focus:ring-primary" />
                  <span className="ml-3 font-medium text-gray-900">Credit / Debit Card (Mock)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary & Coupon */}
          <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
            
            {/* Coupon */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Ticket className="text-primary" /> Apply Coupon
              </h2>
              {couponData ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-green-800 font-bold">{couponData.code}</p>
                    <p className="text-green-600 text-sm">Coupon applied successfully!</p>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 text-sm font-medium hover:underline">Remove</button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter coupon code" 
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary uppercase"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <button 
                      onClick={applyCoupon}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Details</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs px-2 py-0.5 rounded-full bg-emerald-50">Free</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {!isFreeDelivery ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs flex items-center justify-between">
                    <span>
                      Add items worth <strong className="text-amber-950 font-bold">₹{remainingForFree.toFixed(0)}</strong> more for <strong>FREE Delivery</strong>
                    </span>
                    <Link to="/products" className="font-bold underline text-amber-800 hover:text-amber-950 shrink-0 ml-2">
                      + Add
                    </Link>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free express delivery unlocked for orders above ₹499!</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="font-bold text-xl text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                disabled={orderProcessing || !selectedAddress || addresses.length === 0}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
