import express from 'express';
import cors from 'cors';
import env from './utils/envValidator';
import { connectDB } from './config/db';
import requestLogger from './middleware/loggerMiddleware';
import errorHandler from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import AppError from './utils/appError';

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API Route Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Base Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'PlanoraAI API Server is active and healthy.' });
});

// Catch unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find route ${req.originalUrl} on this server.`, 404));
});

// Centralized Global Error Handler Middleware
app.use(errorHandler as any);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 PlanoraAI Server booting up in ${process.env.NODE_ENV || 'development'} mode...`);
  console.log(`📡 Active Server listening on http://localhost:${PORT}`);
});
