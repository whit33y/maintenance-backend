import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

import { prisma } from '../config/prisma';
import { maintenance } from '../generated/prisma';
import { CreateMaintenanceBody, UpdateMaintenanceBody } from '../types/maintenance-interface';
import { AppError } from '../utils/AppError';

//@desc Get all maintenance
//@route GET/api/maintenance
export const getMaintenance = async (
  req: Request<{ user_id: string }>,
  res: Response<maintenance[]>,
  next: NextFunction,
) => {
  try {
    const user_id = req.params.user_id;
    const maintenance = await prisma.maintenance.findMany({
      where: { user_id },
    });
    res.status(200).json(maintenance);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 404));
  }
};

//@desc Get maintenance by id
//@route GET/api/maintenance/:id
export const getSingleMaintenance = async (
  req: Request<{ id: string; user_id: string }>,
  res: Response<maintenance | null>,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user_id = req.params.user_id;
    const maintenance = await prisma.maintenance.findFirst({
      where: { user_id, id },
    });
    if (!maintenance) {
      return next(new AppError('Maintenance not found.', 404));
    }
    res.status(200).json(maintenance);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Post maintenance
//@route POST/api/maintenance
export const postMaintenance = async (
  req: Request<{ user_id: string }, object, CreateMaintenanceBody>,
  res: Response<maintenance | null>,
  next: NextFunction,
) => {
  const { title, category_id, start_date, repeat_interval, reminder_days_before } = req.body;
  if (!title || !category_id || !start_date || !repeat_interval || reminder_days_before == null) {
    return next(new AppError('Please include all information.', 400));
  }
  try {
    const id = v4();
    const user_id = req.params.user_id;

    const maintenance = await prisma.maintenance.create({
      data: {
        id,
        title,
        category_id,
        start_date,
        repeat_interval,
        reminder_days_before,
        completed: false,
        user_id,
      },
    });

    res.status(201).json(maintenance);
  } catch (err) {
    return next(new AppError(`Something went wrong while creating maintenance. ${err}`, 500));
  }
};

//@desc Update maintenance
//@route PUT/api/maintenance/:id
export const updateMaintenance = async (
  req: Request<{ id: string; user_id: string }, object, UpdateMaintenanceBody>,
  res: Response<{ updated: maintenance }>,

  next: NextFunction,
) => {
  const { id } = req.params;
  const { title, category_id, start_date, repeat_interval, reminder_days_before, completed } =
    req.body;

  if (
    !title ||
    !category_id ||
    !start_date ||
    !repeat_interval ||
    reminder_days_before == null ||
    completed == null
  ) {
    return next(new AppError('Please include all information.', 400));
  }
  try {
    const user_id = req.params.user_id;
    const existing = await prisma.maintenance.findFirst({
      where: { id, user_id },
    });
    if (!existing) {
      return next(new AppError('Maintenance not found.', 404));
    }
    const updated = await prisma.maintenance.update({
      where: { id },
      data: {
        title,
        category_id,
        start_date,
        repeat_interval,
        reminder_days_before,
        completed,
      },
    });
    res.status(200).json({ updated });
  } catch (err) {
    return next(new AppError(`Something went wrong while updating maintenance. ${err}`, 500));
  }
};

//@desc Delete maintenance
//@route DELETE/api/maintenance/:id
export const deleteMaintenance = async (
  req: Request<{ id: string; user_id: string }>,
  res: Response<{ message: string; maintenance: maintenance }>,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Please pass necessary information.', 400));
  }

  try {
    const user_id = req.params.user_id;

    const existing = await prisma.maintenance.findFirst({
      where: { id, user_id },
    });

    if (!existing) {
      return next(new AppError('Maintenance not found.', 404));
    }

    await prisma.maintenance.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Maintenance deleted successfully',
      maintenance: existing,
    });
  } catch (err) {
    return next(new AppError(`Something went wrong while deleting maintenance. ${err}`, 500));
  }
};
