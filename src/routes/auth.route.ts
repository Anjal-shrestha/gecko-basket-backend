import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

// Wrap the controller with asyncHandler
router.post('/register', asyncHandler(registerUser));

export default router;