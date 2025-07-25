import express from 'express';
import {
  getAllUsers,
  getUserById,    // 1. Import the new functions
  updateUser,
  deleteUser,
} from '../controllers/admin.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// All routes in this file are already protected by protect and isAdmin
router.use(protect, isAdmin);

// This existing route gets all users
router.route('/users').get(getAllUsers);

// 2. Add the new routes for managing a single user
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;