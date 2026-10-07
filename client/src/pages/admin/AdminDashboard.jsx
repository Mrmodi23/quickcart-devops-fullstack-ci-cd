import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    recentOrders: [],
    chartData: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback chart data if server returned empty
  const chartData = stats.chartData && stats.chartData.length > 0 ? stats.chartData : [
    { name: 'Mon', sales: 0, orders: 0 },
    { name: 'Tue', sales: 0, orders: 0 },
    { name: 'Wed', sales: 0, orders: 0 },
    { name: 'Thu', sales: 0, orders: 0 },
    { name: 'Fri', sales: 0, orders: 0 },
    { name: 'Sat', sales: 0, orders: 0 },
    { name: 'Sun', sales: 0, orders: 0 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing':
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time performance metrics and store management</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products/new"
              className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-xl text-sm transition shadow-sm"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 border border-blue-100">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{stats.users}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 border border-emerald-100">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{stats.products}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 border border-purple-100">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{stats.orders}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 border border-amber-100">
              <IndianRupee className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">₹{Math.round(stats.revenue).toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Last 7 Days Revenue
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Sales trends calculated from actual customer checkouts</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(val) => [`₹${val}`, 'Revenue']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#0d9488" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Orders Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-purple-600" /> Orders by Day
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Order volume over the past week</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip 
                    formatter={(val) => [val, 'Orders']}
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} 
                  />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders & Low Stock Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders (2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <p className="text-xs text-gray-400 mt-0.5">Latest purchases placed across the store</p>
              </div>
              <Link 
                to="/admin/orders" 
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-mono font-medium text-gray-900">
                          <Link to={`/orders/${order._id}`} className="hover:text-primary">
                            #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {order.address?.fullName || order.user?.name || 'Customer'}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ₹{order.total?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts (1 column) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4">Products that have 5 or fewer items remaining:</p>

              <div className="space-y-3">
                {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                  stats.lowStockProducts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white p-1 border border-gray-200 flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</h4>
                          <span className="text-xs text-gray-400">₹{p.price}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                        {p.stock} left
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    All inventory levels healthy! 👍
                  </div>
                )}
              </div>
            </div>

            <Link
              to="/admin/products"
              className="mt-6 w-full flex items-center justify-center py-2.5 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Manage Products
            </Link>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Management Sections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/products" className="p-5 bg-gray-50 hover:bg-primary/10 hover:text-primary transition rounded-xl font-semibold text-center border border-gray-100 flex flex-col items-center gap-2 group">
              <Package className="w-6 h-6 text-gray-600 group-hover:text-primary transition" />
              <span>Manage Products</span>
            </Link>
            <Link to="/admin/categories" className="p-5 bg-gray-50 hover:bg-primary/10 hover:text-primary transition rounded-xl font-semibold text-center border border-gray-100 flex flex-col items-center gap-2 group">
              <CheckCircle2 className="w-6 h-6 text-gray-600 group-hover:text-primary transition" />
              <span>Manage Categories</span>
            </Link>
            <Link to="/admin/orders" className="p-5 bg-gray-50 hover:bg-primary/10 hover:text-primary transition rounded-xl font-semibold text-center border border-gray-100 flex flex-col items-center gap-2 group">
              <Truck className="w-6 h-6 text-gray-600 group-hover:text-primary transition" />
              <span>Manage Orders</span>
            </Link>
            <Link to="/admin/users" className="p-5 bg-gray-50 hover:bg-primary/10 hover:text-primary transition rounded-xl font-semibold text-center border border-gray-100 flex flex-col items-center gap-2 group">
              <Users className="w-6 h-6 text-gray-600 group-hover:text-primary transition" />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
