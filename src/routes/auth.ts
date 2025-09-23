import express from 'express';

import { changePassword, deleteAccount, login, register } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/', authenticateToken, deleteAccount);
router.patch('/change-password', authenticateToken, changePassword);

export default router;
