// routes/authRoutes.js
import { Router } from 'express';
import authController from '../controllers/authController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const { signup, login } = authController;
const router = Router();

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Route
router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

export default router;
