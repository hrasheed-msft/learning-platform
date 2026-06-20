import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  errors?: Record<string, string>;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // CooldownError gets its own flat response shape for frontend countdown UI
  if (err instanceof CooldownError) {
    res.status(429).json({
      error: err.message,
      retryAfterMinutes: err.retryAfterMinutes,
      retryAt: err.retryAt,
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const isOperational = err.isOperational || false;

  // Log error
  if (!isOperational) {
    console.error('Unexpected error:', err);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    },
  });
};

// Custom error classes
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Record<string, string>;

  constructor(message: string, statusCode: number, errors?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors?: Record<string, string>) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(errors: Record<string, string>) {
    super('Validation Error', 422, errors);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class CooldownError extends AppError {
  retryAfterMinutes: number;
  retryAt: string;

  constructor(message: string, retryAfterMinutes: number, retryAt: string) {
    super(message, 429);
    this.retryAfterMinutes = retryAfterMinutes;
    this.retryAt = retryAt;
  }
}
