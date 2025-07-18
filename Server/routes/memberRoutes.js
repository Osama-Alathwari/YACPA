// Server/routes/memberRoutes.js
import { Router } from 'express';
import memberController from '../controllers/memberController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import { uploadFields } from '../utils/memberHelpers.js';

const { addMember } = memberController;
const router = Router();

// POST /api/members/add - Add new member
router.post('/add', verifyToken, uploadFields, addMember);

export default router;