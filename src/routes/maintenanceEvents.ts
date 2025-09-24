import express from 'express';

import {
  deleteMaintenanceEvent,
  getAllMaintenanceEvents,
  getMaintenanceEvent,
  getMaintenanceEvents,
  postMaintenanceEvent,
  updateMaintenanceEvent,
} from '../controllers/mainenanceEventsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//get all maintenanceEvents
router.get('/', authenticateToken, getAllMaintenanceEvents);

//get all maintenanceEvents by id
router.get('/:maintenance_id', authenticateToken, getMaintenanceEvents);

//get single maintenanceEvent
router.get('/single/:id', authenticateToken, getMaintenanceEvent);

//post maintenanceEvent
router.post('/', authenticateToken, postMaintenanceEvent);

//update maintenanceEvent
router.put('/:id', authenticateToken, updateMaintenanceEvent);

//delete maintenanceEvent
router.delete('/:id', authenticateToken, deleteMaintenanceEvent);

export default router;
