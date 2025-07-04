import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Routes for getting all products and creating a single product
router.route('/')
  .get(getAllProducts)
  .post(protect, isAdmin, upload.single('image'), createProduct);

// Routes for a single product by ID
router.route('/:id')
  .get(getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

// Route for a single product by slug
router.route('/slug/:slug').get(getProductBySlug);

export default router;