import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
} from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:productId').delete(removeFromCart);

export default router;