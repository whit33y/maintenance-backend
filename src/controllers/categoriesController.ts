import { pool } from "../database";
import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

interface Category {
  id: string;
  name: string;
  is_private: boolean;
  user_id: string;
}

//@desc Get all categories
//@route GET/api/categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    const categories = rows as Category[];
    res.status(200).json(categories);
  } catch (err) {
    return next(new AppError("Something went wrong.", 404));
  }
};

//@desc Get categories by id
//@route GET/api/categories/:id
export const getSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    const category = rows as Category[];

    if (category.length === 0) {
      return next(new AppError("Category not found.", 404));
    }

    res.status(200).json(category[0]);
  } catch (err) {
    return next(new AppError("Something went wrong.", 500));
  }
};

//@desc POST category
//@route POST/api/categories
export const postCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, is_private, user_id } = req.body;
  console.log(req.body);
  if (!name || user_id == null || is_private == null) {
    return next(new AppError("Please include all information.", 400));
  }
  try {
    const id = v4();

    const [result] = await pool.query(
      `INSERT INTO categories 
            (id, name, is_private, user_id) 
            VALUES (?, ?, ?, ?)`,
      [id, name, is_private, user_id]
    );

    res.status(201).json({
      id,
      name,
      is_private,
      user_id,
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while creating category.", 500)
    );
  }
};

//@desc UPDATE category
//@route PUT/api/categories/:id
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, is_private, user_id } = req.body;
  if (!name || !user_id || is_private == null) {
    return next(new AppError("Please include all information.", 400));
  }
  try {
    const [rows] = await pool.query(
      `UPDATE categories 
             SET name = ?, is_private = ?, user_id = ?
             WHERE id = ?`,
      [name, is_private, user_id, id]
    );

    const category = rows as Category[];

    if (category.length === 0) {
      return next(new AppError("Category not found.", 404));
    }

    res.status(200).json({
      id,
      name,
      is_private,
      user_id,
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while updating category.", 500)
    );
  }
};

//@desc DELETE category
//@route DELETE/api/categories/:id
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Please pass necessary information.", 400));
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM categories WHERE id = ?`, [
      id,
    ]);

    const category = rows as Category[];
    if (category.length === 0) {
      return next(new AppError("Category not found.", 404));
    }

    await pool.query(`DELETE FROM categories WHERE id = ?`, [id]);

    res.status(200).json({
      message: "Category deleted successfully",
      category: category[0],
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while deleting category.", 500)
    );
  }
};
