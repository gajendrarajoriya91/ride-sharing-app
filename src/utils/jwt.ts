import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (
  id: string,
  isDriver: boolean,
  isAdmin: boolean,
  isRider: boolean,
) => {
  return jwt.sign(
    { id, isDriver, isAdmin, isRider },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    throw new Error('Invalid token');
  }
};
