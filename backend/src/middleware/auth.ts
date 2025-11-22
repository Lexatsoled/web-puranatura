import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const extractToken = (req: Request): string | null => {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith('Bearer ')) {
    return bearer.substring('Bearer '.length);
  }
  if (req.cookies?.token) {
    return req.cookies.token as string;
  }
  return null;
};

export const getUserIdFromRequest = (req: Request): string | null => {
  try {
    const token = extractToken(req);
    if (!token) return null;
    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string };
    return decoded.sub;
  } catch {
    return null;
  }
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  req.userId = userId;
  return next();
};
