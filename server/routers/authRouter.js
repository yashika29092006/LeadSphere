import express from 'express';
import { loginUser, registerUser, getUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes mapped to controllers
router.post('/login', loginUser);
router.post('/register', registerUser); 

// Protected Admin route
router.get('/users', protect, authorize('Admin'), getUsers);

export default router;
