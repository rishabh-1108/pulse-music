import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { AppError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const message = Object.values(errors).flat().join(', ');
      return next(new AppError(message || 'Validation failed', 400));
    }
    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;
    next();
  };
};
