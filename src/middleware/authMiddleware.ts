import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !decoded) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = {
      id: decoded.id as string,
      email: decoded.email as string,
      name: decoded.name as string,
    };
    next();
  });
};
