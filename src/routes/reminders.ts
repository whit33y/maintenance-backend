import express from 'express';

import {
  deleteReminder,
  getReminder,
  getReminders,
  getRemindersMaintenance,
  postReminder,
  updateReminder,
} from '../controllers/remindersController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

//get all reminders
router.get('/', authenticateToken, getReminders);

//get single reminder
router.get('/:id', authenticateToken, getReminder);

//get maintenance reminders
router.get('/maintenance/:maintenance_id', authenticateToken, getRemindersMaintenance);

//post reminder
router.post('/', authenticateToken, postReminder);

//update reminder
router.put('/:id', authenticateToken, updateReminder);

//delete reminder
router.delete('/:id', authenticateToken, deleteReminder);

export default router;
