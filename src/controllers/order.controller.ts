import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order.model';
import { IUser } from '../models/User.model'; // Import IUser
import { z } from 'zod';

// Define a custom Request type that includes the 'user' property
interface IAuthRequest extends Request {
  user?: IUser;
}

// Zod schema for validating the incoming order data
const orderValidationSchema = z.object({
  orderItems: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().min(1),
      image: z.string(),
      price: z.number(),
      product: z.string(),
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

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
export const createOrder = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedBody = orderValidationSchema.parse(req.body);

    const order = new Order({
      ...parsedBody,
      user: req.user?._id, // Get user from the 'protect' middleware
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/v1/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders by Admin
 * @route   GET /api/v1/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status by Admin
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};