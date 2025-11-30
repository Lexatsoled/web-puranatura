import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import ms from 'ms';
import { z } from 'zod';
import { prisma } from '../prisma';
import { env } from '../config/env';
import { AuthenticatedRequest, getUserIdFromRequest } from '../middleware/auth';
import {
  addToken as addRefreshToken,
  hasToken as hasRefreshToken,
  revokeToken as revokeRefreshToken,
  replaceToken as replaceRefreshToken,
} from '../storage/refreshTokenStore';

const router = Router();

// Per-route limiter for all auth routes — protects login/register/refresh endpoints
// from abuse (brute force, credential stuffing, refresh abuse).
const authLimiter = rateLimit({
  windowMs: env.authRateLimitWindowMs,
  // Allow per-request override of the limit via `x-rate-max` header to make
  // tests deterministic even if modules were initialized earlier.
    // Allow per-request override of the limit only in `test` environment so that
    // tests can be deterministic even under module caching. Do NOT honor this
    // header in production.
    max: (req) => {
      if (env.nodeEnv === 'test') {
        const header = req.headers['x-rate-max'];
        const parsed = Number(typeof header === 'string' ? header : String(header ?? ''));
        return Number.isFinite(parsed) && parsed > 0 ? parsed : env.authRateLimitMax;
      }
      return env.authRateLimitMax;
    },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Demasiadas solicitudes en el endpoint de auth',
  },
  // Allow using a test header to key the limiter so tests can deterministically
  // hit the same bucket — when running in production this header is ignored.
    // In tests we allow a header override to make the limiter deterministic.
    // In non-test envs, always use req.ip to avoid trusting client-supplied data.
    keyGenerator: (req) => {
      if (env.nodeEnv === 'test') return String(req.headers['x-rate-key'] ?? req.ip);
      return String(req.ip);
    },

  handler: (req, res) => {
    const traceId = (res.locals && res.locals.traceId) || 'unknown';
    res.setHeader('X-Trace-Id', traceId);
    res.status(429).json({
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiadas solicitudes en el endpoint de auth',
      traceId,
    });
  },
});

router.use(authLimiter);

// no-op: limiter is attached above; keep handlers concise

const cookieBase = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: env.nodeEnv === 'production',
  path: '/api/auth',
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
  const refreshJti = randomUUID();
  const refreshToken = jwt.sign(
    { sub: userId, jti: refreshJti },
    env.jwtRefreshSecret,
    {
      expiresIn: Math.max(1, Math.floor(refreshTokenMs / 1000)),
    }
  );

  res.cookie('token', token, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  // persist refresh token (file-based store) to support rotation/revocation
  try {
    addRefreshToken({
      jti: refreshJti,
      userId,
      expiresAt: new Date(Date.now() + refreshTokenMs).toISOString(),
    });
  } catch (_) {
    // non fatal
  }

  return { token, refreshToken };
};

const clearAuthCookies = (res: Response) => {
  // Use the same non-ephemeral options used to set the cookie so the
  // browser removes the cookie correctly; do NOT pass maxAge into
  // clearCookie (deprecated) — express will set the cookie to expire.
  const clearOpts = {
    path: cookieBase.path,
    httpOnly: cookieBase.httpOnly,
    sameSite: cookieBase.sameSite,
    secure: cookieBase.secure,
  } as any;

  try {
    res.clearCookie('token', clearOpts);
  } catch (_) {
    // best-effort
  }
  try {
    res.clearCookie('refreshToken', clearOpts);
  } catch (_) {
    // best-effort
  }
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
  isAdmin: env.adminEmails.includes(user.email.toLowerCase()),
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

router.post('/logout', (req, res) => {
  // try to revoke a persisted refresh token (if any) when logging out
  try {
    const rt = req.cookies?.refreshToken;
    if (rt) {
      try {
        const decoded = jwt.verify(rt, env.jwtRefreshSecret) as {
          jti?: string;
        };
        if (decoded?.jti) revokeRefreshToken(decoded.jti);
      } catch (err) {
        // ignore
      }
    }
  } catch (err) {
    // ignore
  }

  clearAuthCookies(res);
  res.json({ ok: true });
});

router.post('/refresh', (req, res) => {
  // refresh handler
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No hay sesión' });
  }

  try {
    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as {
      sub: string;
      jti?: string;
    };
    // debug the decoded token + check presence in persisted store

    const oldJti = decoded.jti;
    if (!oldJti || !hasRefreshToken(oldJti)) {
      return res.status(401).json({ message: 'Sesión inválida' });
    }

    // generate a rotated refresh token
    const newJti = randomUUID();
    const newRefreshToken = jwt.sign(
      { sub: decoded.sub, jti: newJti },
      env.jwtRefreshSecret,
      {
        expiresIn: Math.max(1, Math.floor(refreshTokenMs / 1000)),
      }
    );

    // replace persisted token
    try {
      replaceRefreshToken(oldJti, {
        jti: newJti,
        userId: decoded.sub,
        expiresAt: new Date(Date.now() + refreshTokenMs).toISOString(),
      });
    } catch (_) {
      // not fatal
    }

    // set rotated cookies
    const newAccessToken = jwt.sign({ sub: decoded.sub }, env.jwtSecret, {
      expiresIn: Math.max(1, Math.floor(accessTokenMs / 1000)),
    });
    res.cookie('token', newAccessToken, accessCookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);
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
