import express from 'express';
import { getAllUsers } from '../controllers/admin.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// This route is now protected and accessible only by admins.
router.get('/users', protect, isAdmin, getAllUsers);

export default router;