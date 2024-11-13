// src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
