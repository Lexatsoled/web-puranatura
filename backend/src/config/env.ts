import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

// Load environment variables for the backend.
// Priority:
//  1. process.env.BACKEND_ENV_PATH (explicit)
//  2. ./backend/.env.local if present (developer local overrides)
//  3. default dotenv resolution (./.env)
const explicitPath = process.env.BACKEND_ENV_PATH;
let envPath: string | undefined = undefined;
if (explicitPath) {
  envPath = explicitPath;
} else {
  const localDotEnv = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(localDotEnv)) {
    envPath = localDotEnv;
  }
}

dotenv.config({ path: envPath });

// If no DATABASE_URL is defined in the environment and we are in a
// non-production environment, choose a sensible default for local dev
// to avoid failing out when running `npm run dev`.
if (
  !process.env.DATABASE_URL &&
  (process.env.NODE_ENV || 'development') !== 'production'
) {
  // Use the sqlite file inside the backend/prisma folder
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
  // eslint-disable-next-line no-console
  console.warn(
    '[env] DATABASE_URL not found — falling back to file:./prisma/dev.db for local development'
  );
}

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
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
  analyticsRateLimitMax: toNumber(process.env.ANALYTICS_RATE_LIMIT_MAX, 20),
  analyticsRateLimitWindowMs: toNumber(
    process.env.ANALYTICS_RATE_LIMIT_WINDOW,
    5 * 60 * 1000
  ),
  analyticsIngestEnabled: toBoolean(process.env.ANALYTICS_INGEST_ENABLED, true),
  // Per-route rate-limits (defaults chosen for sensible protection in dev)
  authRateLimitMax: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
  authRateLimitWindowMs: toNumber(
    process.env.AUTH_RATE_LIMIT_WINDOW,
    60 * 1000
  ),
  // (previously) AI endpoint rate-limits removed — no built-in AI endpoint
  // Controla si la política CSP se aplica en modo report-only o enforce.
  // En entornos de prueba/desarrollo defaulta a true (report-only).
  cspReportOnly: toBoolean(process.env.CSP_REPORT_ONLY, true),
};
