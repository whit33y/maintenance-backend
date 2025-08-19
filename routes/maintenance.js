import express from 'express';
import { deleteMaintenance, getMaintenance, getSingleMaintenance, postMaintenance, updateMaintenance } from '../controllers/maintenanceController.js';
const router = express.Router();

//get all maintenances
router.get('/', getMaintenance);

//get single maintenance
router.get('/:id', getSingleMaintenance)

//post maintenance
router.post('/', postMaintenance)

//put maintenance
router.put('/:id', updateMaintenance)

//delete maintenance
router.delete('/:id', deleteMaintenance)

export default router;