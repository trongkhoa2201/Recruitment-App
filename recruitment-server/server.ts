import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import jobRoutes from './routes/jobRoutes';
import User from './models/user';
import Job from './models/job';
import JobLog from './models/jobLog';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recruitment-app';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Recruitment App API is running');
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working' });
});

// Routes
app.use('/api/jobs', jobRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
