import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";
import { RegisterBody, LoginBody } from "../types/auth-interface";

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please include all information", 400));
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError("User already exists.", 400));
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
      message: "User successfully created!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while creating account.", 500)
    );
  }
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please include all information", 400));
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new AppError("Wrong email or password.", 401));
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return next(new AppError("Wrong email or password.", 401));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      env.JWT_SECRET,
      { expiresIn: "168h" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return next(new AppError("Something went wrong, server error.", 500));
  }
};
