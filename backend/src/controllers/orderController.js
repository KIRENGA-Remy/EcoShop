import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { OrderItem } from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod,
    paymentCurrency,
    totalPrice 
  } = req.body;

  // Check if order items exist
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Create order
  const order = await Order.create({
    UserId: req.user.id,
    paymentMethod,
    paymentCurrency,
    totalPrice,
    shippingAddress
  });

  // Create order items and associate with order
  const orderItemsCreated = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
      
      // Update product stock
      product.countInStock -= item.quantity;
      await product.save();
    })
  );

  // Get the full order with items
  const fullOrder = await Order.findByPk(order.id, {
    include: [{ model: Product }]
  });

  res.status(201).json(fullOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: Product }]
  });

  if (order) {
    // Check if the order belongs to the user or if the user is an admin
    if (order.UserId === req.user.id || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = req.body;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { UserId: req.user.id },
    include: [{ model: Product }],
    order: [['createdAt', 'DESC']]
  });
  
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: Product }],
    order: [['createdAt', 'DESC']]
  });
  
  res.json(orders);
});