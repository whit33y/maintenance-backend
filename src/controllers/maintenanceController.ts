import { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma';
import { maintenance } from '../generated/prisma';
import { MaintenanceBody } from '../types/maintenance-interface';
import { AppError } from '../utils/AppError';

//@desc Get all maintenance
//@route GET/api/maintenance
export const getMaintenances = async (
  req: Request<{ user_id: string }>,
  res: Response<maintenance[]>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new AppError('User not found.', 400));
  }
  try {
    const maintenances = await prisma.maintenance.findMany({
      where: { user_id },
    });
    res.status(200).json(maintenances);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Get maintenance by id
//@route GET/api/maintenance/:id
export const getMaintenanceById = async (
  req: Request<{ user_id: string; id: string }>,
  res: Response<maintenance | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!user_id || !id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const maintenance = await prisma.maintenance.findFirst({
      where: { id, user_id },
    });
    res.status(200).json(maintenance);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Get maintenance by category
//@route GET/api/maintenance/category/:category_id
export const getMaintenancesByCategory = async (
  req: Request<{ user_id: string; category_id: string }>,
  res: Response<maintenance[]>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { category_id } = req.params;
  if (!user_id || !category_id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const maintenances = await prisma.maintenance.findMany({
      where: { category_id, user_id },
    });
    res.status(200).json(maintenances);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Post maintenance
//@route POST/api/maintenance
export const postMaintenance = async (
  req: Request<{ user_id: string }, object, MaintenanceBody>,
  res: Response<maintenance | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { title, start_date, repetition_unit, repetition_value, category_id, notes } = req.body;
  if (!user_id || !title || !start_date || !repetition_unit || !repetition_value || !category_id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  const startDateObject = new Date(start_date);

  try {
    const maintenance = await prisma.maintenance.create({
      data: {
        user_id,
        title,
        start_date: startDateObject,
        repetition_unit,
        repetition_value,
        category_id,
        notes,
      },
    });
    res.status(201).json(maintenance);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Update maintenance
//@route PUT/api/maintenance/:id
export const updateMaintenance = async (
  req: Request<{ id: string; user_id: string }, object, MaintenanceBody>,
  res: Response<maintenance | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  const { title, start_date, repetition_unit, repetition_value, category_id, notes } = req.body;
  if (
    !user_id ||
    !id ||
    !title ||
    !start_date ||
    !repetition_unit ||
    !repetition_value ||
    !category_id
  ) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const existing = await prisma.maintenance.findFirst({
      where: { id, user_id },
    });
    if (!existing) {
      return next(new AppError('Maintenance not found.', 404));
    }
    const updated = await prisma.maintenance.update({
      where: { id, user_id },
      data: {
        title,
        start_date,
        repetition_unit,
        repetition_value,
        category_id,
        notes,
      },
    });
    res.status(200).json(updated);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Delete maintenance
//@route DELETE/api/maintenance/:id
export const deleteMaintenance = async (
  req: Request<{
    user_id: string;
    id: string;
  }>,
  res: Response<{ message: string; data: maintenance }>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!user_id || !id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const existing = await prisma.maintenance.findFirst({
      where: {
        id,
        user_id,
      },
    });
    if (!existing) {
      return next(new AppError('Maintenance not found.', 404));
    }
    await prisma.maintenance.delete({
      where: {
        id,
        user_id,
      },
    });
    res.status(200).json({ message: 'Succesfully deleted maintenance.', data: existing });
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};
