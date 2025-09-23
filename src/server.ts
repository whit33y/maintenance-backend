import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import { startCronJobs } from './jobs/cron-jobs.js';
import auth from './routes/auth.js';
import categories from './routes/categories.js';
import maintenance from './routes/maintenance.js';
import maintenanceEvents from './routes/maintenanceEvents.js';
import reminders from './routes/reminders.js';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

//Routes
app.use('/api/reminders', reminders);
app.use('/api/maintenance-events', maintenanceEvents);
app.use('/api/maintenance', maintenance);
app.use('/api/categories', categories);
app.use('/api/auth', auth);
app.use((err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

startCronJobs();

app.listen(PORT, () => {
  console.log(`Server working on ${PORT}`);
});
