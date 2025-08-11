import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders, // 1. Import the new functions

  updateOrderStatus
} from '../controllers/order.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// This route now also handles getting all orders (for admins)
router.route('/')
  .post(protect, createOrder)
  .get(protect, isAdmin, getAllOrders); // <-- ADD THIS

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/status').put(protect, isAdmin, updateOrderStatus);
// We'll also need a route to get a single order by ID
// router.route('/:id').get(protect, getOrderById); // You can add this later

export default router;