import express from 'express';

import {
  deleteMaintenance,
  getMaintenanceById,
  getMaintenances,
  getMaintenancesByCategory,
  postMaintenance,
  updateMaintenance,
} from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

//get all maintenances
router.get('/', authenticateToken, getMaintenances);

//get single maintenance
router.get('/:id', authenticateToken, getMaintenanceById);

//get maintenance by category
router.get('/category/:category_id', authenticateToken, getMaintenancesByCategory);

//post maintenance
router.post('/', authenticateToken, postMaintenance);

//put maintenance
router.put('/:id', authenticateToken, updateMaintenance);

//delete maintenance
router.delete('/:id', authenticateToken, deleteMaintenance);

export default router;
