import { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma';
import { maintenance_events } from '../generated/prisma';
import { MaintenanceEventBody } from '../types/maintenance-events-interface';
import { AppError } from '../utils/AppError';

//@desc Get all maintenance events
//@route GET/api/maintenance-event
export const getMaintenanceEvents = async (
  req: Request<{ user_id: string }>,
  res: Response<maintenance_events[]>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new AppError('User not found.', 400));
  }
  try {
    const maintenance_events = await prisma.maintenance_events.findMany({
      where: {
        user_id,
      },
    });
    res.status(200).json(maintenance_events);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Get single maintenance event
//@route GET/api/maintenance-event/:id
export const getMaintenanceEvent = async (
  req: Request<{ user_id: string; id: string }>,
  res: Response<maintenance_events | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!id || !user_id) {
    return next(new AppError('Please pass necessary information.', 400));
  }
  try {
    const maintenance_event = await prisma.maintenance_events.findFirst({
      where: { id, user_id },
    });
    res.status(200).json(maintenance_event);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 404));
  }
};

//@desc POST maintenance event
//@route POST/api/maintenance-event
export const postMaintenanceEvent = async (
  req: Request<{ user_id: string }, object, MaintenanceEventBody>,
  res: Response<maintenance_events | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { maintenance_id, completion_date, notes } = req.body;
  if (!user_id || !maintenance_id) {
    return next(new AppError('Please pass necessary information.', 400));
  }
  try {
    const maintenance_event = await prisma.maintenance_events.create({
      data: {
        user_id,
        maintenance_id,
        completion_date,
        notes,
      },
    });

    res.status(201).json(maintenance_event);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc UPDATE maintenance event
//@route UPDATE/api/maintenance-event/:id
export const updateMaintenanceEvent = async (
  req: Request<{ user_id: string; id: string }, object, MaintenanceEventBody>,
  res: Response<maintenance_events | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { maintenance_id, completion_date, notes } = req.body;
  const { id } = req.params;
  if (!user_id || !maintenance_id || !id) {
    return next(new AppError('Please pass necessary information.', 400));
  }
  try {
    const existing = await prisma.maintenance_events.findFirst({
      where: {
        id,
        user_id,
      },
    });
    if (!existing) {
      return next(new AppError('Maintenance event not found.', 404));
    }
    const updated = await prisma.maintenance_events.update({
      where: {
        id,
        user_id,
      },
      data: {
        user_id,
        maintenance_id,
        completion_date,
        notes,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};
//@desc DELETE maintenance event
//@route DELETE/api/maintenance-event/:id
export const deleteMaintenanceEvent = async (
  req: Request<{ user_id: string; id: string }>,
  res: Response<{ message: string; data: maintenance_events }>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!id || !user_id) {
    return next(new AppError('Please pass necessary information.', 400));
  }
  try {
    const existing = await prisma.maintenance_events.findFirst({
      where: { user_id, id },
    });
    if (!existing) {
      return next(new AppError('Maintenance event not found.', 404));
    }

    await prisma.maintenance_events.delete({
      where: { user_id, id },
    });
    res.status(200).json({ message: 'Succesfully deleted maintenance event', data: existing });
  } catch (err) {
    return next(new AppError(`Something went wrong while deleting maintenance event. ${err}`, 500));
  }
};
