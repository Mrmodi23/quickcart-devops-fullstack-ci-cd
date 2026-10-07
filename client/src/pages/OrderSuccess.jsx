import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        // Fallback if order isn't found
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg text-center max-w-2xl w-full border border-gray-100">
        
        {/* Animated Checkmark Bubble */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8 shadow-inner relative">
          <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-50"></div>
          <CheckCircle2 className="h-14 w-14 text-green-600 relative z-10" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for choosing QuickCart. Your order is being processed and will be delivered shortly.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-200">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
            <div>
              <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Order Number</span>
              <p className="text-lg font-bold text-primary">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Total Amount</span>
              <p className="text-lg font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Delivering to: {order.address.fullName}</p>
              <p className="text-gray-600 text-sm">{order.address.house}, {order.address.street}</p>
              <p className="text-gray-600 text-sm">{order.address.area}, {order.address.city}, {order.address.pincode}</p>
              <p className="text-gray-600 text-sm font-medium mt-1">Phone: {order.address.phone}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={`/orders/${order._id}`} 
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" /> View Order Status
          </Link>
          <Link 
            to="/products" 
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-md shadow-primary/30 transition flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
