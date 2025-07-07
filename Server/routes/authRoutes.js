// routes/authRoutes.js
import { Router } from 'express';
import authController from '../controllers/authController.js';
import verifyToken, { requireRole } from '../middlewares/authMiddleware.js';

const { login, logout, getProfile } = authController;
const router = Router();

// Public Routes
router.post('/login', login);
router.post('/logout', logout);

// Protected Routes
router.get('/profile', verifyToken, getProfile);

// Admin only routes (example)
router.get('/admin-only', verifyToken, requireRole(['admin']), (req, res) => {
    res.json({ message: 'هذا المورد متاح للمدراء فقط' });
});

export default router;