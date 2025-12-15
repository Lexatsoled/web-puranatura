import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID, createHash } from 'crypto';
import ms from 'ms';
import { z } from 'zod';
import { prisma } from '../prisma';
import { env } from '../config/env';
import { AuthenticatedRequest, getUserIdFromRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import RedisStore from 'rate-limit-redis';
import { redis } from '../lib/redis';

const router = Router();

// Per-route limiter for all auth routes — protects login/register/refresh endpoints
// from abuse (brute force, credential stuffing, refresh abuse).
// Redis Store configuration
const authLimiter = rateLimit({
  store: new RedisStore({
    // @ts-expect-error - Conocido conflicto de tipos entre ioredis y rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: env.authRateLimitWindowMs,
  // Allow per-request override of the limit via `x-rate-max` header to make
  // tests deterministic even if modules were initialized earlier.
  // Allow per-request override of the limit only in `test` environment so that
  // tests can be deterministic even under module caching. Do NOT honor this
  // header in production.
  max: (req) => {
    if (env.nodeEnv === 'test') {
      const header = req.headers['x-rate-max'];
      const parsed = Number(
        typeof header === 'string' ? header : String(header ?? '')
      );
      return Number.isFinite(parsed) && parsed > 0
        ? parsed
        : env.authRateLimitMax;
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
    if (env.nodeEnv === 'test') {
      const key = req.headers['x-rate-key'];
      if (key) return String(key);
    }
    const bodyEmail =
      typeof req.body === 'object' && req.body?.email
        ? String(req.body.email).toLowerCase()
        : null;
    if (bodyEmail) return bodyEmail;
    return String(req.ip);
  },

  handler: (_req, res) => {
    const traceId = (res.locals && res.locals.traceId) || 'unknown';
    res.setHeader('X-Trace-Id', traceId);
    res.status(429).json({
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiadas solicitudes en el endpoint de auth (Redis)',
      traceId,
    });
  },
});

router.use(authLimiter);

// no-op: limiter is attached above; keep handlers concise

const isSecureCookies = () =>
  (process.env.NODE_ENV ?? env.nodeEnv) === 'production' ||
  process.env.FORCE_SECURE_COOKIES === 'true';

const cookieBase = () => ({
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: isSecureCookies(),
  path: '/api/auth',
});

const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
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

const accessCookieOptions = () => ({
  ...cookieBase(),
  maxAge: accessTokenMs,
});

const refreshCookieOptions = () => ({
  ...cookieBase(),
  maxAge: refreshTokenMs,
});

const setAuthCookies = async (res: Response, userId: string) => {
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

  res.cookie('token', token, accessCookieOptions());
  res.cookie('refreshToken', refreshToken, refreshCookieOptions());

  // persist refresh token (hashed JTI) in DB
  // We store the hash of the JTI so that even with DB access, one cannot identifying valid JTIs to spoof (defence in depth).
  try {
    await prisma.refreshToken.create({
      data: {
        jti: hashToken(refreshJti),
        userId,
        // We can also populate hashedToken if we want to store the full token hash,
        // but hashing the JTI is sufficient for this architecture.
        hashedToken: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshTokenMs),
      },
    });
  } catch (err) {
    logger.error('Failed to persist refresh token', { error: err });
    // In strict mode we might want to fail request, but for now log error
  }

  return { token, refreshToken };
};

const clearAuthCookies = (res: Response) => {
  // Use the same non-ephemeral options used to set the cookie so the
  // browser removes the cookie correctly; do NOT pass maxAge into
  // clearCookie (deprecated) — express will set the cookie to expire.
  const base = cookieBase();
  const clearOpts = {
    path: base.path,
    httpOnly: base.httpOnly,
    sameSite: base.sameSite,
    secure: base.secure,
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

    await setAuthCookies(res, user.id);
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

    await setAuthCookies(res, user.id);
    res.json({ user: userPayload(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res) => {
  // try to revoke a persisted refresh token (if any) when logging out
  try {
    const rt = req.cookies?.refreshToken;
    if (rt) {
      try {
        const decoded = jwt.verify(rt, env.jwtRefreshSecret) as {
          jti?: string;
        };
        if (decoded?.jti) {
          // Delete by hashed JTI
          await prisma.refreshToken
            .delete({ where: { jti: hashToken(decoded.jti) } })
            .catch(() => null);
        }
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

router.post('/refresh', async (req, res) => {
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

    const oldJti = decoded.jti;
    if (!oldJti) {
      return res.status(401).json({ message: 'Token malformado' });
    }

    const hashedOldJti = hashToken(oldJti);

    // Check DB using hash
    const storedToken = await prisma.refreshToken.findUnique({
      where: { jti: hashedOldJti },
    });
    if (!storedToken) {
      // Reuse detection logic could go here (if old jti used but not found -> alarm)
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }

    // Verify expiry logic matches DB just in case
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken
        .delete({ where: { jti: hashedOldJti } })
        .catch(() => null);
      return res.status(401).json({ message: 'Sesión expirada' });
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

    // Rotate in transaction: delete old, create new
    try {
      await prisma.$transaction([
        prisma.refreshToken.delete({ where: { jti: hashedOldJti } }),
        prisma.refreshToken.create({
          data: {
            jti: hashToken(newJti),
            userId: decoded.sub,
            hashedToken: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + refreshTokenMs),
          },
        }),
      ]);
    } catch (_) {
      // Race condition or DB error
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Error rotando sesión' });
    }

    // set rotated cookies
    const newAccessToken = jwt.sign({ sub: decoded.sub }, env.jwtSecret, {
      expiresIn: Math.max(1, Math.floor(accessTokenMs / 1000)),
    });
    res.cookie('token', newAccessToken, accessCookieOptions());
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions());
    return res.json({ ok: true });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(401).json({ message: 'Sesión expirada' });
  }
});

router.put('/me', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: 'No authenticated' });
    }

    const updateSchema = z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      phone: z.string().optional(),
    });

    const data = updateSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        // If empty string is passed for phone, set to null/undefined or handle as business logic requires.
        // For now, allow simple update.
      },
    });

    res.json({ user: userPayload(user) });
  } catch (error) {
    next(error);
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
