import express from 'express';
import { deleteCategory, getCategories, getSingleCategory, postCategory, updateCategory } from '../controllers/categoriesController.js';

const router = express.Router();

//get all categories
router.get('/', getCategories);

//get single category
router.get('/:id', getSingleCategory);

//post category
router.post('/', postCategory);

//put category
router.put('/:id', updateCategory)

//delete category
router.delete('/:id', deleteCategory);

export default router;