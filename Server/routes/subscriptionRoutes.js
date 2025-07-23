// Server/routes/subscriptionRoutes.js
import { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const { getExpiringSubscriptions, getExpiredSubscriptions } = subscriptionController;
const router = Router();

// GET /api/subscriptions/expiring - Get expiring subscriptions
router.get('/expiring', verifyToken, getExpiringSubscriptions);

// GET /api/subscriptions/expired - Get expired subscriptions
router.get('/expired', verifyToken, getExpiredSubscriptions);

export default router;