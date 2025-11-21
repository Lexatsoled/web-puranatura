import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const extractToken = (req: Request): string | null => {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith('Bearer ')) {
    return bearer.substring('Bearer '.length);
  }
  if (req.cookies?.token) {
    return req.cookies.token as string;
  }
  return null;
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string };
    req.userId = decoded.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Sesión no válida' });
  }
};
