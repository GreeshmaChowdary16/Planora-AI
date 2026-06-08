import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message || 'Something went wrong';
  error.statusCode = err.statusCode || 500;

  // Log full error stacks during development
  console.error(`[Error Log]`, err);

  // Mongoose Cast Error (e.g. invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    const msg = `Resource not found with id of ${err.value}`;
    error = new AppError(msg, 404);
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const msg = `Duplicate field value entered. The ${field} '${err.keyValue[field]}' is already in use.`;
    res.status(400).json({
      status: 'fail',
      message: msg,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new AppError(`Validation failed: ${message}`, 400);
  }

  // JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  res.status(error.statusCode).json({
    status: error.statusCode >= 500 ? 'error' : 'fail',
    message: error.message,
    // Add stacks for debugging if in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
