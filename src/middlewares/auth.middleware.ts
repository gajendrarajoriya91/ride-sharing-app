import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

const publicRoutes = ['login', 'register'];

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (req.body?.variables?.operationName) {
      const operationName = req.body.variables.operationName;

      if (publicRoutes.includes(operationName)) {
        next();
        return;
      }
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.warn('Access denied: No token provided');
      res.status(401).send({
        statusCode: 401,
        msg: 'Access denied. No token provided.',
        data: null,
      });
      return;
    }

    const decoded = verifyToken(token) as JwtPayload;
    req.user = decoded;

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(400).send({
      statusCode: 400,
      msg: 'Invalid token or authentication failed.',
      data: null,
    });
  }
};
