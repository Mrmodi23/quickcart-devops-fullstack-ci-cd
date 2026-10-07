import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, MapPin, CreditCard, Receipt, Package, Truck, CheckCircle2, Star } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Order not found'}</h2>
        <Link to="/orders" className="text-primary hover:underline">Back to orders</Link>
      </div>
    );
  }

  // Calculate timeline steps
  const steps = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  let currentStepIndex = steps.indexOf(order.orderStatus);
  if (order.orderStatus === 'Pending') currentStepIndex = -1;
  if (order.orderStatus === 'Cancelled') currentStepIndex = -2;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/orders" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to orders
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-primary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
            {order.orderStatus === 'Cancelled' ? (
              <span className="bg-red-100 text-red-800 px-4 py-1.5 rounded-full font-bold text-sm">
                CANCELLED
              </span>
            ) : (
              <div className="text-right">
                <span className="text-sm text-gray-500 block mb-1">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Timeline (only if not cancelled) */}
          {order.orderStatus !== 'Cancelled' && (
            <div className="p-8 border-b border-gray-100">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                  <div 
                    style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                  ></div>
                </div>
                <div className="flex justify-between w-full">
                  <div className="text-center flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${currentStepIndex >= 0 ? 'text-gray-900' : 'text-gray-400'}`}>Confirmed</span>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${currentStepIndex >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Preparing</span>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${currentStepIndex >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>On the way</span>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStepIndex >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${currentStepIndex >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6 bg-gray-50/50">
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-400" /> Delivery Address
              </h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="font-medium text-gray-900">{order.address.fullName}</p>
                <p className="text-gray-600 text-sm mt-1">{order.address.house}, {order.address.street}</p>
                <p className="text-gray-600 text-sm">{order.address.area}, {order.address.city}, {order.address.state} {order.address.pincode}</p>
                <p className="text-gray-600 text-sm mt-2">{order.address.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-400" /> Payment Information
              </h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 text-sm">Method</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Status</span>
                  <span className={`font-medium ${order.paymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items and Summary */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" /> Order Items
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <li key={item._id} className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        <Link to={`/products/${item.product}`} className="hover:text-primary">{item.name}</Link>
                      </h4>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        {order.orderStatus === 'Delivered' && (
                          <Link 
                            to={`/products/${item.product}`}
                            className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-primary" /> Review Product
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-400" /> Order Summary
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">
                    {order.deliveryFee === 0 ? <span className="text-primary">Free</span> : `₹${order.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">- ₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-primary">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
