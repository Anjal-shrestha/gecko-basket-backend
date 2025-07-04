import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Public route to get all products & Admin-only route to create a product
router.route('/').get(getAllProducts).post(protect, isAdmin, createProduct);

// Public route to get a single product & Admin-only routes to update/delete
router
  .route('/:id')
  .get(getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

export default router;