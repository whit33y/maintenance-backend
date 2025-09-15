import { reminders } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma.js';
import { RemindersBody, UpdateRemindersBody } from '../types/reminders-interface.js';
import { AppError } from '../utils/AppError.js';

//@desc Get all reminders
//@route GET/api/reminders
export const getReminders = async (
  req: Request<{ user_id: string; maintenance_id: string }>,
  res: Response<reminders[]>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { maintenance_id } = req.params;
  if (!user_id || !maintenance_id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const reminder = await prisma.reminders.findMany({
      where: {
        user_id,
        maintenance_id,
      },
    });
    res.status(200).json(reminder);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc GET single reminder
//@route GET/api/reminders/:id
export const getReminder = async (
  req: Request<{ user_id: string; id: string }>,
  res: Response<reminders | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!user_id || !id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const reminder = await prisma.reminders.findFirst({
      where: {
        user_id,
        id,
      },
    });
    res.status(200).json(reminder);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc POST reminder
//@route POST/api/reminders
export const postReminder = async (
  req: Request<object, object, RemindersBody>,
  res: Response<reminders | null>,
  next: NextFunction,
) => {
  const { user_id, maintenance_id, due_date, is_sent } = req.body;
  if (!user_id || !maintenance_id || !due_date) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const reminder = await prisma.reminders.create({
      data: {
        user_id,
        maintenance_id,
        due_date,
        is_sent,
      },
    });
    res.status(201).json(reminder);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc UPDATE reminder
//@route UPDATE/api/reminders/:id
export const updateReminder = async (
  req: Request<{ user_id: string; id: string }, object, UpdateRemindersBody>,
  res: Response<reminders | null>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  const { maintenance_id, due_date, is_sent } = req.body;
  if (!user_id || !id || !maintenance_id || !due_date) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const existing = await prisma.reminders.findFirst({
      where: {
        id,
        user_id,
      },
    });
    if (!existing) {
      return next(new AppError('Reminder not found.', 404));
    }
    const reminder = await prisma.reminders.update({
      where: {
        id,
        user_id,
      },
      data: {
        maintenance_id,
        due_date,
        is_sent,
      },
    });
    res.status(201).json(reminder);
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc DELETE reminer
//@route DELETE/api/reminders/:reminder_id
export const deleteReminder = async (
  req: Request<{ user_id: string; id: string }>,
  res: Response<{ message: string; data: reminders }>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { id } = req.params;
  if (!user_id || !id) {
    return next(new AppError('Something went wrong. Missing information', 400));
  }
  try {
    const existing = await prisma.reminders.findFirst({
      where: { id, user_id },
    });
    if (!existing) {
      return next(new AppError('Reminder not found.', 404));
    }
    await prisma.reminders.delete({
      where: { id, user_id },
    });
    res.status(200).json({ message: 'Succesfully deleted reminder', data: existing });
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 404));
  }
};
