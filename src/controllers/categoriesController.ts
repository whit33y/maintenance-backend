import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";

//@desc Get all categories
//@route GET/api/categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.categories.findMany();
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
    const category = await prisma.categories.findFirst({
      where: { id },
    });
    res.status(200).json(category);
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
  if (!name || user_id == null || is_private == null) {
    return next(new AppError("Please include all information.", 400));
  }
  try {
    const id = v4();

    const category = await prisma.categories.create({
      data: {
        id,
        name,
        is_private,
        user_id,
      },
    });
    res.status(201).json({ category });
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
    const existing = await prisma.categories.findFirst({ where: { id } });
    if (!existing) {
      return next(new AppError("Category not found.", 404));
    }
    const updated = await prisma.categories.update({
      where: { id },
      data: {
        name,
        user_id,
        is_private,
      },
    });
    res.status(200).json({ updated });
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
    const existing = await prisma.categories.findFirst({
      where: { id },
    });

    if (!existing) {
      return next(new AppError("Category not found.", 404));
    }

    await prisma.categories.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Category deleted successfully",
      category: existing,
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while deleting category.", 500)
    );
  }
};
