import dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config({ path: process.env.BACKEND_ENV_PATH || undefined });

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined): string[] => {
  if (!value) return ['http://localhost:5173'];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parseList = (value: string | undefined): string[] =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const requireEnv = (value: string | undefined, key: string): string => {
  if (value) return value;

  // In non-production environments, provide a secure ephemeral secret so
  // developers can run the backend locally without needing to set real
  // secrets. In production we still fail fast to avoid silent misconfiguration.
  if ((process.env.NODE_ENV || 'development') !== 'production') {
    const generated = randomBytes(32).toString('hex');
    // eslint-disable-next-line no-console
    console.warn(
      `[env] variable ${key} no definida - usando valor efímero (solo dev)`
    );
    return generated;
  }

  throw new Error(`Falta la variable de entorno ${key}`);
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 3001),
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  jwtSecret: requireEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  jwtRefreshSecret: requireEnv(
    process.env.JWT_REFRESH_SECRET,
    'JWT_REFRESH_SECRET'
  ),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  rateLimitMax: toNumber(process.env.RATE_LIMIT_MAX, 300),
  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW, 15 * 60 * 1000),
  adminEmails: parseList(process.env.ADMIN_EMAILS),
};
