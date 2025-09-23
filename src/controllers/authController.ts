import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { LoginBody, RegisterBody } from '../types/auth-interface.js';
import { AppError } from '../utils/AppError.js';

export const register = async (
  req: Request<object, object, RegisterBody>,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Please include all information', 400));
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('User already exists.', 400));
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = v4();

    const newUser = await prisma.users.create({
      data: {
        id,
        name,
        email,
        password_hash,
      },
    });

    res.status(201).json({
      message: 'User successfully created!',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    return next(new AppError(`Something went wrong while creating account. ${err}`, 500));
  }
};

export const login = async (
  req: Request<object, object, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please include all information', 400));
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new AppError('Wrong email or password.', 401));
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return next(new AppError('Wrong email or password.', 401));
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET, {
      expiresIn: '168h',
    });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc DELETE account
//@route DELETE/api/auth
export const deleteAccount = async (
  req: Request<{ user_id: string }, object, { password: string }>,
  res: Response<{ message: string }>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { password } = req.body;
  if (!user_id || !password) {
    return next(new AppError('Something went wrong. Missing information', 401));
  }
  try {
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return next(new AppError('Account not found', 404));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return next(new AppError('Wrong credentials!', 404));
    }
    await prisma.users.delete({ where: { id: user_id } });
    res.status(200).json({ message: 'Succesfully deleted account' });
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};

//@desc Change password
//@route PATCH /api/auth/change-password
export const changePassword = async (
  req: Request<{ user_id: string }, object, { oldPassword: string; newPassword: string }>,
  res: Response<{ message: string }>,
  next: NextFunction,
) => {
  const user_id = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  if (!user_id || !oldPassword || !newPassword) {
    return next(new AppError('Missing information', 400));
  }

  try {
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return next(new AppError('Account not found', 404));
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      return next(new AppError('Wrong current password!', 401));
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: user_id },
      data: { password_hash: newPasswordHash },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return next(new AppError(`Something went wrong. ${err}`, 500));
  }
};
