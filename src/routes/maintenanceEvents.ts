import express from 'express';

import {
  deleteMaintenanceEvent,
  getMaintenanceEvent,
  getMaintenanceEvents,
  postMaintenanceEvent,
  updateMaintenanceEvent,
} from '../controllers/mainenanceEventsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

//get all maintenanceEvents
router.get('/', authenticateToken, getMaintenanceEvents);

//get single maintenanceEvent
router.get('/:id', authenticateToken, getMaintenanceEvent);

//post maintenanceEvent
router.post('/', authenticateToken, postMaintenanceEvent);

//update maintenanceEvent
router.put('/:id', authenticateToken, updateMaintenanceEvent);

//delete maintenanceEvent
router.delete('/:id', authenticateToken, deleteMaintenanceEvent);

export default router;
