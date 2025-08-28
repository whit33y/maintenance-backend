import { pool } from "../database";
import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

interface Maintenance {
  id: string;
  title: string;
  category_id: string;
  start_date: string;
  repeat_interval: string;
  reminder_days_before: number;
  completed: boolean;
  user_id: string;
}

//@desc Get all maintenance
//@route GET/api/maintenance
export const getMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as Request & { user: { id: string } }).user.id;
    const [rows] = await pool.query(
      "SELECT * FROM maintenance WHERE user_id = ?",
      [userId]
    );
    const maintenance = rows as Maintenance[];
    res.status(200).json(maintenance);
  } catch (err) {
    return next(new AppError("Something went wrong.", 404));
  }
};

//@desc Get all upcoming maintenance
//@route GET/api/maintenance
// export const getUpcomingMaintenance = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { days } = req.params;
//   try {
//     const userId = (req as Request & { user: { id: string } }).user.id;

//   } catch (err) {
//     console.error(err);
//     const error: AppError = new Error("Something went wrong.");
//     error.status = 500;
//     return next(error);
//   }
// };

//@desc Get maintenance by id
//@route GET/api/maintenance/:id
export const getSingleMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const userId = (req as Request & { user: { id: string } }).user.id;

    const [rows] = await pool.query(
      "SELECT * FROM maintenance WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    const maintenance = rows as Maintenance[];

    if (maintenance.length === 0) {
      return next(new AppError("Maintenance not found.", 404));
    }

    res.status(200).json(maintenance[0]);
  } catch (err) {
    return next(new AppError("Something went wrong.", 500));
  }
};

//@desc Post maintenance
//@route POST/api/maintenance
export const postMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    category_id,
    start_date,
    repeat_interval,
    reminder_days_before,
  } = req.body;
  if (
    !title ||
    !category_id ||
    !start_date ||
    !repeat_interval ||
    reminder_days_before == null
  ) {
    return next(new AppError("Please include all information.", 400));
  }
  try {
    const id = v4();
    const completed = false;
    const userId = (req as Request & { user: { id: string } }).user.id;

    const [result] = await pool.query(
      `INSERT INTO maintenance 
            (id, title, category_id, start_date, repeat_interval, reminder_days_before, completed, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        category_id,
        start_date,
        repeat_interval,
        reminder_days_before,
        completed,
        userId,
      ]
    );

    res.status(201).json({
      id,
      title,
      category_id,
      start_date,
      repeat_interval,
      reminder_days_before,
      completed,
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while creating maintenance.", 500)
    );
  }
};

//@desc Update maintenance
//@route PUT/api/maintenance/:id
export const updateMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    title,
    category_id,
    start_date,
    repeat_interval,
    reminder_days_before,
    completed,
  } = req.body;

  if (
    !title ||
    !category_id ||
    !start_date ||
    !repeat_interval ||
    reminder_days_before == null ||
    completed == null
  ) {
    return next(new AppError("Please include all information.", 400));
  }

  try {
    const userId = (req as Request & { user: { id: string } }).user.id;

    const [rows] = await pool.query(
      `UPDATE maintenance 
             SET title = ?, category_id = ?, start_date = ?, repeat_interval = ?, reminder_days_before = ?, completed = ?
             WHERE id = ? AND user_id = ?`,
      [
        title,
        category_id,
        start_date,
        repeat_interval,
        reminder_days_before,
        completed,
        id,
        userId,
      ]
    );

    const maintenance = rows as Maintenance[];

    if (maintenance.length === 0) {
      return next(new AppError("Maintenance not found.", 404));
    }

    res.status(200).json({
      id,
      title,
      category_id,
      start_date,
      repeat_interval,
      reminder_days_before,
      completed,
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while updating maintenance.", 500)
    );
  }
};

//@desc Delete maintenance
//@route DELETE/api/maintenance/:id
export const deleteMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Please pass necessary information.", 400));
  }

  try {
    const userId = (req as Request & { user: { id: string } }).user.id;

    const [rows] = await pool.query(
      `SELECT * FROM maintenance WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    const maintenance = rows as Maintenance[];

    if (maintenance.length === 0) {
      return next(new AppError("Maintenance not found.", 404));
    }

    await pool.query(`DELETE FROM maintenance WHERE id = ? AND user_id = ?`, [
      id,
      userId,
    ]);

    res.status(200).json({
      message: "Maintenance deleted successfully",
      maintenance: maintenance[0],
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while deleting maintenance.", 500)
    );
  }
};
