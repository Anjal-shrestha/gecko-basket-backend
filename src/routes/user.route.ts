import express from 'express';
import { getUserProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Any request to this route must first pass through the 'protect' middleware
router.get('/profile', protect, getUserProfile);

export default router;