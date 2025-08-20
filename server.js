import express from "express";
import dotenv from "dotenv";
import maintenance from "./routes/maintenance.js";
import categories from "./routes/categories.js";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000;

//Routes
app.use('/api/maintenance', maintenance);
app.use('/api/categories', categories);
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server working on http://localhost:${PORT}`);
});