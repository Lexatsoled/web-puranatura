import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { z } from 'zod';
import { prisma } from '../prisma';
import { env } from '../config/env';
import { AuthenticatedRequest, getUserIdFromRequest } from '../middleware/auth';

const router = Router();

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.nodeEnv === 'production',
};

type DurationInput = Parameters<typeof ms>[0];

const toMilliseconds = (
  value: string | number | undefined,
  fallbackMs: number
): number => {
  if (typeof value === 'number') return value;
  if (!value) return fallbackMs;
  const parsed = ms(value as DurationInput);
  return typeof parsed === 'number' ? parsed : fallbackMs;
};

const accessTokenMs = toMilliseconds(env.jwtExpiresIn, 15 * 60 * 1000);
const refreshTokenMs = toMilliseconds(
  env.jwtRefreshExpiresIn,
  7 * 24 * 60 * 60 * 1000
);

const accessCookieOptions = {
  ...cookieBase,
  maxAge: accessTokenMs,
};

const refreshCookieOptions = {
  ...cookieBase,
  maxAge: refreshTokenMs,
};

const setAuthCookies = (res: Response, userId: string) => {
  const token = jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: Math.max(1, Math.floor(accessTokenMs / 1000)),
  });
  const refreshToken = jwt.sign({ sub: userId }, env.jwtRefreshSecret, {
    expiresIn: Math.max(1, Math.floor(refreshTokenMs / 1000)),
  });

  res.cookie('token', token, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  return { token, refreshToken };
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
};

const userPayload = (user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone ?? undefined,
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(8).optional(),
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } =
      registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
      },
    });

    setAuthCookies(res, user.id);
    res.status(201).json({ user: userPayload(user) });
  } catch (error) {
    next(error);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    setAuthCookies(res, user.id);
    res.json({ user: userPayload(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true });
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No hay sesión' });
  }

  try {
    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as {
      sub: string;
    };
    setAuthCookies(res, decoded.sub);
    return res.json({ ok: true });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(401).json({ message: 'Sesión expirada' });
  }
});

router.get('/me', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      clearAuthCookies(res);
      return res.json({ user: null });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      clearAuthCookies(res);
      return res.json({ user: null });
    }
    res.json({ user: userPayload(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
