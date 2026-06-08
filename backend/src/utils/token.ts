import jwt from 'jsonwebtoken';
import env from '../utils/envValidator';

export const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
