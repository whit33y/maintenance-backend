import express from "express";
import { pool } from "./database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test endpoint
app.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});