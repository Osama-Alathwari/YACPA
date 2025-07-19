// Server/routes/memberRoutes.js
import { Router } from 'express';
import memberController from '../controllers/memberController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import { uploadFields } from '../utils/memberHelpers.js';

const { addMember, getMembers, getMember } = memberController;
const router = Router();

// POST /api/members/add - Add new member
router.post('/add', verifyToken, uploadFields, addMember);
router.get('/get', verifyToken, getMembers);
router.get('/get/:id', verifyToken, getMember);


export default router;