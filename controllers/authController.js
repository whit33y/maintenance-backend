import { pool } from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = new Error("Please include all information");
        error.status = 400;
        return next(error);
    }

    try {
        const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            const error = new Error("User already exists.");
            error.status = 400;
            return next(error);
        }

        const password_hash = await bcrypt.hash(password, 10);
        const id = uuidv4();

        const [result] = await pool.query(`
            INSERT INTO users 
            (id, name, email, password_hash, created_at)
            VALUES(?, ?, ?, ?, NOW())`,
            [id, name, email, password_hash]
        );

        res.status(201).json({ message: 'User succesfully created!', user: { id, name, email } },);
    } catch (err) {
        console.error(err);
        const error = new Error('Something went wrong while creating account.');
        error.status = 500;
        return next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = new Error("Please include all informations.");
        error.status = 400;
        return next(error);
    }
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            const error = new Error("Wrong email or password.");
            error.status = 401;
            return next(error);
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            const error = new Error("Wrong email or password.");
            error.status = 401;
            return next(error);
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "168h" }
        );
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong, server error." });
        error.status = 500;
        return next(error);
    }
}
