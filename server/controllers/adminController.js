const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Compute last 7 days sales and orders
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7DaysMap = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateKey = d.toISOString().split('T')[0];
      last7DaysMap[dateKey] = {
        name: dayName,
        date: dateKey,
        sales: 0,
        orders: 0
      };
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (last7DaysMap[orderDate]) {
        last7DaysMap[orderDate].sales += Math.round(order.total || 0);
        last7DaysMap[orderDate].orders += 1;
      }
    });

    const chartData = Object.values(last7DaysMap);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name stock price image unit')
      .limit(5);

    res.json({
      success: true,
      data: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        revenue: totalRevenue,
        recentOrders: orders.slice(0, 5),
        chartData,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats
};
