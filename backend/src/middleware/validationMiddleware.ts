import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import AppError from '../utils/appError';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Debug logging for incoming request body
    console.log(`[Validation Debug] Incoming request to ${req.originalUrl}:`);
    console.log(`[Validation Debug] Request Body:`, JSON.stringify(req.body, null, 2));

    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log('[Validation Debug] Request validation passed successfully.');
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('❌ [Validation Debug] Validation Failed:');
        error.errors.forEach((err) => {
          console.error(`   - Field [${err.path.join('.') || 'body'}]: ${err.message}`);
        });

        const errorMessages = error.errors
          .map((err) => `${err.path.join(': ') || 'body'}: ${err.message}`)
          .join(', ');
        next(new AppError(`Validation failed: ${errorMessages}`, 400));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
