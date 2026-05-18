import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './error.middleware';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    // Transform errors into a more usable format
    const errorMap: Record<string, string> = {};
    errors.array().forEach((error) => {
      if ('path' in error && typeof error.path === 'string') {
        if (!errorMap[error.path]) {
          errorMap[error.path] = error.msg as string;
        }
      }
    });

    next(new ValidationError(errorMap));
  };
};
