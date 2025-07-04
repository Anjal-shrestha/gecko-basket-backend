import express from 'express';
import { createOrder, getMyOrders } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Chain the routes for creating an order and getting the user's orders
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);

export default router;