import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
  isAdmin?: boolean;
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

const isAdminEmail = (email: string | undefined): boolean =>
  !!email && env.adminEmails.includes(email.toLowerCase());

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    req.userId = user.id;
    req.userEmail = user.email;
    req.isAdmin = isAdminEmail(user.email?.toLowerCase());
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Requiere rol admin' });
  }
  return next();
};
