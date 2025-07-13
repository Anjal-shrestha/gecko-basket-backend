import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order.model';
import { z } from 'zod';

// Zod schema for validating the incoming order data
const orderValidationSchema = z.object({
  orderItems: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().min(1),
      image: z.string(),
      price: z.number(),
      product: z.string(), // Assuming product ID is sent as a string
    })
  ).min(1, { message: "Order must contain at least one item." }),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string(),
  itemsPrice: z.number(),
  taxPrice: z.number(),
  shippingPrice: z.number(),
  totalPrice: z.number(),
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = orderValidationSchema.parse(req.body);

    const order = new Order({
      user: req.user?._id, // Get user from the 'protect' middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user?._id });
  res.json(orders);
};
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find all orders and populate the 'user' field with their id and name
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};export const updateOrderToDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};