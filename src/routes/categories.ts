import express from 'express';

import {
  deleteCategory,
  getCategories,
  getSingleCategory,
  postCategory,
  updateCategory,
} from '../controllers/categoriesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

//get all categories
router.get('/', authenticateToken, getCategories);

//get single category
router.get('/:id', authenticateToken, getSingleCategory);

//post category
router.post('/', authenticateToken, postCategory);

//put category
router.put('/:id', authenticateToken, updateCategory);

//delete category
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
