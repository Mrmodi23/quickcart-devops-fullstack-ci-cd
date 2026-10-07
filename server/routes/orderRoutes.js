const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/admin/all')
  .get(authorize('admin'), getAllOrders);

router.route('/admin/:id')
  .put(authorize('admin'), updateOrderStatus);

router.route('/:id')
  .get(getOrderById);

module.exports = router;
