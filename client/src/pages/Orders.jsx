import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="text-yellow-500 w-5 h-5" />;
      case 'Confirmed': return <CheckCircle2 className="text-blue-500 w-5 h-5" />;
      case 'Preparing': return <Package className="text-purple-500 w-5 h-5" />;
      case 'Out for Delivery': return <Truck className="text-orange-500 w-5 h-5" />;
      case 'Delivered': return <CheckCircle2 className="text-green-500 w-5 h-5" />;
      case 'Cancelled': return <XCircle className="text-red-500 w-5 h-5" />;
      default: return <Clock className="text-gray-500 w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/products" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Order Placed:</span>
                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total Amount:</span>
                    <p className="font-medium text-gray-900">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Order #:</span>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div className="sm:text-right">
                    <Link to={`/orders/${order._id}`} className="text-primary font-medium hover:underline">
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={index} className="w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100 relative group">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        <div className="absolute inset-0 bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                          {item.quantity}x
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 font-medium">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
