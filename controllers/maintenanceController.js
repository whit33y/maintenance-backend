import { pool } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
//@desc Get all maintenance
//@route GET/api/maintenance
export const getMaintenance = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query("SELECT * FROM maintenance WHERE user_id = ?", [userId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong.');
        error.status = 404;
        return next(error);
    }
};

//@desc Get all upcoming maintenance
//@route GET/api/maintenance
export const getUpcomingMaintenance = async (req, res, next) => {
    const { days } = req.params;
    try {
        const userId = req.user.id;
    }
    catch (err) {
        console.error(err);
        const error = new Error('Something went wrong.');
        error.status = 500;
        return next(error);
    }
}


//@desc Get maintenance by id
//@route GET/api/maintenance/:id
export const getSingleMaintenance = async (req, res, next) => {
    const { id } = req.params;
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            "SELECT * FROM maintenance WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (rows.length === 0) {
            const error = new Error('Maintenance not found.');
            error.status = 404;
            return next(error);
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong.');
        error.status = 500;
        return next(error);
    }
};

//@desc Post maintenance 
//@route POST/api/maintenance
export const postMaintenance = async (req, res, next) => {
    const { title, category_id, start_date, repeat_interval, reminder_days_before } = req.body;
    if (!title || !category_id || !start_date || !repeat_interval || reminder_days_before == null) {
        const error = new Error('Please include all information.');
        error.status = 400;
        return next(error);
    }
    try {
        const id = uuidv4();
        const completed = false;
        const userId = req.user.id;
        const [result] = await pool.query(
            `INSERT INTO maintenance 
            (id, title, category_id, start_date, repeat_interval, reminder_days_before, completed, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, category_id, start_date, repeat_interval, reminder_days_before, completed, userId]
        );

        res.status(201).json({
            id,
            title,
            category_id,
            start_date,
            repeat_interval,
            reminder_days_before,
            completed
        });
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong while creating maintenance.');
        error.status = 500;
        return next(error);
    }
}

//@desc Update maintenance 
//@route PUT/api/maintenance/:id
export const updateMaintenance = async (req, res, next) => {
    const { id } = req.params;
    const { title, category_id, start_date, repeat_interval, reminder_days_before, completed } = req.body;

    if (!title || !category_id || !start_date || !repeat_interval || reminder_days_before == null || completed == null) {
        const error = new Error('Please include all information.');
        error.status = 400;
        return next(error);
    }

    try {
        const userId = req.user.id;
        const [result] = await pool.query(
            `UPDATE maintenance 
             SET title = ?, category_id = ?, start_date = ?, repeat_interval = ?, reminder_days_before = ?, completed = ?
             WHERE id = ? AND user_id = ?`,
            [title, category_id, start_date, repeat_interval, reminder_days_before, completed, id, userId]
        );

        if (result.affectedRows === 0) {
            const error = new Error('Maintenance not found.');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            id,
            title,
            category_id,
            start_date,
            repeat_interval,
            reminder_days_before,
            completed
        });
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong while updating maintenance.');
        error.status = 500;
        return next(error);
    }
};

//@desc Delete maintenance 
//@route DELETE/api/maintenance/:id
export const deleteMaintenance = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        const error = new Error('Please pass necessary information.');
        error.status = 400;
        return next(error);
    }

    try {
        const userId = req.user.id;
        const [rows] = await pool.query(`SELECT * FROM maintenance WHERE id = ? AND user_id = ?`, [id, userId]);
        if (rows.length === 0) {
            const error = new Error('Maintenance not found.');
            error.status = 404;
            return next(error);
        }

        await pool.query(`DELETE FROM maintenance WHERE id = ? AND user_id = ?`, [id, userId]);

        res.status(200).json({
            message: 'Maintenance deleted successfully',
            maintenance: rows[0]
        });

    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong while deleting maintenance.');
        error.status = 500;
        return next(error);
    }
};
