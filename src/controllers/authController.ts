import { pool } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";


interface AppError extends Error {
  status?: number;
}

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
    const error: AppError = new Error("Please include all information");
    error.status = 400;
    return next(error);
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const existingUser = rows as User[];
    if (existingUser.length > 0) {
      const error: AppError = new Error("User already exists.");
      error.status = 400;
      return next(error);
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
    console.error(err);
    const error: AppError = new Error(
      "Something went wrong while creating account."
    );
    error.status = 500;
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error: AppError = new Error("Please include all informations.");
    error.status = 400;
    return next(error);
  }
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = rows as User[];

    if (users.length === 0) {
      const error: AppError = new Error("Wrong email or password.");
      error.status = 401;
      return next(error);
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const error: AppError = new Error("Wrong email or password.");
      error.status = 401;
      return next(error);
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
    const error: AppError = new Error("Something went wrong, server error.");
    error.status = 500;
    return next(error);
  }
};
