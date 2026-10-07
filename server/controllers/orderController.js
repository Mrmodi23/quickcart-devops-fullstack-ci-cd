const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Address = require('../models/Address');

const generateOrderNumber = () => {
  return 'QC' + Math.floor(100000 + Math.random() * 900000);
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, couponCode } = req.body;

    // 1. Validate Cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // 2. Validate Address
    const address = await Address.findById(addressId);
    if (!address || address.user.toString() !== req.user.id) {
      return res.status(400).json({ success: false, message: 'Invalid address' });
    }

    // 3. Calculate Prices & Validate Stock
    let subtotal = 0;
    const orderItems = [];

    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Not enough stock for ${product ? product.name : 'a product'}` 
        });
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: price,
        quantity: item.quantity,
      });
    }

    // 4. Validate Coupon
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date(coupon.expiresAt) > new Date()) {
        if (subtotal >= coupon.minimumOrder) {
          if (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit) {
            if (coupon.discountType === 'percentage') {
              discount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
                discount = coupon.maximumDiscount;
              }
            } else {
              discount = coupon.discountValue;
            }
            appliedCoupon = coupon._id;
            
            // Increment coupon usage
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
      }
    }

    // 5. Calculate Total
    const deliveryFee = subtotal >= 500 ? 0 : 20;
    const total = subtotal + deliveryFee - discount;

    // 6. Create Order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user.id,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      coupon: appliedCoupon,
      total,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        house: address.house,
        street: address.street,
        area: address.area,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed', // Mocking completed for online payments
      orderStatus: 'Confirmed',
    });

    // 7. Reduce Inventory
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // 8. Clear Cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the order belongs to the user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort('-createdAt').populate('user', 'name email');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/admin/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = req.body.status || order.orderStatus;
    
    if (req.body.status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
