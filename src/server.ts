import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import auth from './routes/auth';
import categories from './routes/categories';
import maintenance from './routes/maintenance';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

//Routes
app.use('/api/maintenance', maintenance);
app.use('/api/categories', categories);
app.use('/api/auth', auth);
app.use((err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server working on http://localhost:${PORT}`);
});
