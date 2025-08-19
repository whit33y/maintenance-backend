import { pool } from "../database.js";
import { v4 as uuidv4 } from 'uuid';

//@desc Get all categories
//@route GET/api/categories
export const getCategories = async (req, res, next) => {
    try {
        const [rows] = await pool.query("SELECT * FROM categories");
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong.');
        error.status = 404;
        return next(error);
    }
};

//@desc Get categories by id
//@route GET/api/categories/:id
export const getSingleCategory = async (req, res, next) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            const error = new Error('Category not found.');
            error.status = 404;
            return next(error);
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong.');
        error.status = 500;
        return next(error);
    }
};

//@desc POST category
//@route POST/api/categories
export const postCategory = async (req, res, next) => {
    const { name, isPrivate, user_id } = req.body;
    console.log(req.body);
    if (!name || user_id == null || isPrivate == null) {
        const error = new Error('Please include all information.');
        error.status = 400;
        return next(error);
    }
    try {
        const id = uuidv4();

        const [result] = await pool.query(
            `INSERT INTO categories 
            (id, name, isPrivate, user_id) 
            VALUES (?, ?, ?, ?)`,
            [id, name, isPrivate, user_id]
        );

        res.status(201).json({
            id,
            name,
            isPrivate,
            user_id
        });
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong while creating category.');
        error.status = 500;
        return next(error);
    }
}

//@desc DELETE category
//@route DELETE/api/categories/:id
export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        const error = new Error('Please pass necessary information.');
        error.status = 400;
        return next(error);
    }

    try {
        const [rows] = await pool.query(`SELECT * FROM categories WHERE id = ?`, [id]);
        if (rows.length === 0) {
            const error = new Error('Category not found.');
            error.status = 404;
            return next(error);
        }

        await pool.query(`DELETE FROM categories WHERE id = ?`, [id]);

        res.status(200).json({
            message: 'Category deleted successfully',
            category: rows[0]
        });

    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong while deleting category.');
        error.status = 500;
        return next(error);
    }
};