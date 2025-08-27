import { pool } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("Please include all information", 400));
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const existingUser = rows as User[];
    if (existingUser.length > 0) {
      return next(new AppError("User already exists.", 400));
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = v4();

    const [result] = await pool.query(
      `
            INSERT INTO users 
            (id, name, email, password_hash, created_at)
            VALUES(?, ?, ?, ?, NOW())`,
      [id, name, email, password_hash]
    );

    res.status(201).json({
      message: "User succesfully created!",
      user: { id, name, email },
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while creating account.", 500)
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please include all information", 400));
  }
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = rows as User[];

    if (users.length === 0) {
      return next(new AppError("Wrong email or password.", 401));
    }

    const user = users[0];
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
