import { Request, Response, NextFunction } from 'express';
import logger from './logger';

interface ErrorResponse {
  status: number;
  message: string;
  details?: any;
}

export class AppError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(
    status: number,
    message: string,
    isOperational = true,
    stack = '',
  ) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    if (stack) this.stack = stack;
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const response: ErrorResponse = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.details = err.stack;
  }

  if (!err.isOperational) {
    logger.error('Unexpected Error:', err);
  }

  res.status(response.status).json(response);
};

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
