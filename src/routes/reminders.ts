import express from 'express';

import {
  deleteReminder,
  getReminder,
  getReminders,
  postReminder,
  updateReminder,
} from '../controllers/remindersController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//get all reminders
router.get('/:maintenance_id', authenticateToken, getReminders);

//get single reminder
router.get('/single/:id', authenticateToken, getReminder);

//post reminder
router.post('/', authenticateToken, postReminder);

//update reminder
router.put('/:id', authenticateToken, updateReminder);

//delete reminder
router.delete('/:id', authenticateToken, deleteReminder);

export default router;
