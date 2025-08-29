import express from "express";

import {
  deleteMaintenance,
  getMaintenance,
  getSingleMaintenance,
  postMaintenance,
  updateMaintenance,
} from "../controllers/maintenanceController";
import { authenticateToken } from "../middleware/authMiddleware";
const router = express.Router();

//get all maintenances
router.get("/", authenticateToken, getMaintenance);

//get single maintenance
router.get("/:id", authenticateToken, getSingleMaintenance);

//post maintenance
router.post("/", authenticateToken, postMaintenance);

//put maintenance
router.put("/:id", authenticateToken, updateMaintenance);

//delete maintenance
router.delete("/:id", authenticateToken, deleteMaintenance);

export default router;
