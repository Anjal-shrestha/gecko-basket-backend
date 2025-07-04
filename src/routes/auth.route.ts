import express from 'express';
// Import the new loginUser controller
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = express.Router();

// Existing registration route
router.post('/register', registerUser);

// === ADD THIS NEW LOGIN ROUTE ===
router.post('/login', loginUser);

export default router;