// Server/routes/subscriptionRoutes.js
import { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const { getExpiringSubscriptions } = subscriptionController;
const router = Router();

// GET /api/subscriptions/expiring - Get expiring subscriptions
router.get('/expiring', verifyToken, getExpiringSubscriptions);

export default router;