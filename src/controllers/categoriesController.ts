import { categories } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma.js';
import { CategoryBody } from '../types/category-interface.js';
import { AppError } from '../utils/AppError.js';

//@desc Get all categories
//@route GET/api/categories
export const getCategories = async (
  req: Request<{ user_id: string }>,
  res: Response<categories[]>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new AppError('User not found.', 400));
  }
  try {
    const categories = await prisma.categories.findMany({
      where: { user_id },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json(categories);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Get categories by id
//@route GET/api/categories/:id
export const getCategoryById = async (
  req: Request<{ id: string; user_id: string }>,
  res: Response<categories | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!id || !user_id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const categories = await prisma.categories.findFirst({
      where: { id, user_id },
    });
    res.status(200).json(categories);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc POST category
//@route POST/api/categories
export const postCategory = async (
  req: Request<{ user_id: string }, object, CategoryBody>,
  res: Response<categories | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { name } = req.body;
  if (!user_id || !name) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const category = await prisma.categories.create({
      data: {
        user_id,
        name,
      },
    });
    res.status(200).json(category);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc UPDATE category
//@route PUT/api/categories/:id
export const updateCategory = async (
  req: Request<{ id: string; user_id: string }, object, CategoryBody>,
  res: Response<categories | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  const { name } = req.body;
  if (!user_id || !name || !id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const existing = await prisma.categories.findFirst({
      where: { id, user_id },
    });
    if (!existing) {
      return next(new AppError('Category not found.', 404));
    }
    const updated = await prisma.categories.update({
      where: { id, user_id },
      data: {
        name,
      },
    });
    res.status(200).json(updated);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc DELETE category
//@route DELETE/api/categories/:id
export const deleteCategory = async (
  req: Request<{ user_id: string; id: string }>,
  res: Response<{ message: string; data: categories }>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!user_id || !id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const existing = await prisma.categories.findFirst({
      where: { id, user_id },
    });
    if (!existing) {
      return next(new AppError('Category not found.', 404));
    }
    await prisma.categories.delete({
      where: { user_id, id },
    });
    res.status(200).json({ message: 'Succesfully deleted category', data: existing });
  } catch (err) {
    return next(new AppError(`Something went wrong while updating maintenance. ${err}`, 500));
  }
};
