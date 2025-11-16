import dotenv from 'dotenv';
import { z } from 'zod';

// TODO: Cargar variables de entorno
dotenv.config();

const booleanFromEnv = (fallback: boolean) =>
  z.preprocess((value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
      if (normalized === '') return fallback;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return fallback;
  }, z.boolean());

const numberFromEnv = (fallback: number) =>
  z.preprocess((value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return fallback;
      const parsed = Number(trimmed);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }, z.number().int().positive());

const numberRangeFromEnv = (fallback: number, min: number, max: number) =>
  z.preprocess((value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return fallback;
      const parsed = Number(trimmed);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }, z.number().int().min(min).max(max));

const numberFloatFromEnv = (fallback: number, min: number, max: number) =>
  z.preprocess((value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return fallback;
      const parsed = Number(trimmed);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }, z.number().min(min).max(max));

// TODO: Crear schema de validación con Zod
const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3001'),
  DATABASE_URL: z.string().min(1),
  DATABASE_PATH: z.string().min(1),
  DB_POOL_SIZE: numberFromEnv(5),
  DB_POOL_IDLE_TIMEOUT: numberFromEnv(60000),
  WAL_CHECKPOINT_INTERVAL: numberFromEnv(300000),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET debe tener al menos 32 caracteres'),
  COOKIE_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('100'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().positive()).default('60000'),
  RATE_LIMIT_WHITELIST: z.string().default('127.0.0.1,::1'),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().optional(),
  REDIS_ENABLED: booleanFromEnv(true),
  ADMIN_EMAILS: z.string().default(''),
  LOG_LEVEL: z.string().default('info'),
  LOG_SAMPLING_RATE: numberFloatFromEnv(1, 0, 1),
  LOG_FILE_ENABLED: booleanFromEnv(true),
  LOG_ROTATION_DAYS: numberFromEnv(30),
  SENTRY_DSN: z.string().optional(),
  APP_DOMAIN: z.string().default('localhost'),
  CDN_URL: z.string().optional(),
  API_BASE_URL: z.string().optional(),
  API_VERSION_DEFAULT: z.enum(['v1', 'v2']).default('v1'),
  API_V1_SUNSET_DATE: z
    .string()
    .default('2026-06-01')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'API_V1_SUNSET_DATE debe ser una fecha ISO válida',
    }),
  CSP_REPORT_URI: z.string().optional(),
  CSP_REPORT_ONLY: z
    .preprocess((value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value.toLowerCase() === 'true';
      return undefined;
    }, z.boolean())
    .default(false),
  BACKUP_DIR: z.string().default('./backups'),
  BACKUP_ENCRYPTION_KEY: z.string().optional(),
  BACKUP_DAILY_RETENTION: z.preprocess((value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') return Number(value);
    return 30;
  }, z.number().int().positive()),
  BACKUP_MONTHLY_RETENTION: z.preprocess((value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') return Number(value);
    return 12;
  }, z.number().int().positive()),
  BACKUP_COMPRESS: z.preprocess((value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return true;
  }, z.boolean()),
  BACKUP_SCHEDULE: z.string().default('0 2 * * *'),
  CACHE_TTL_PRODUCTS: numberFromEnv(3600),
  CACHE_TTL_SEARCH: numberFromEnv(1800),
  CACHE_TTL_SESSIONS: numberFromEnv(86400),
  HEALTH_CHECK_ENABLED: booleanFromEnv(true),
  HEALTH_CHECK_INTERVAL: numberFromEnv(15000),
  COMPRESSION_ENABLED: booleanFromEnv(true),
  COMPRESSION_THRESHOLD: numberFromEnv(1024),
  COMPRESSION_LEVEL: numberRangeFromEnv(4, 0, 11),
});

// TODO: Parsear y validar variables de entorno
const parseConfig = () => {
  try {
    const resolvedDatabasePath = process.env.DATABASE_PATH || process.env.DATABASE_URL || './backend/database.sqlite';
    return configSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: resolvedDatabasePath,
      DATABASE_PATH: resolvedDatabasePath,
      DB_POOL_SIZE: process.env.DB_POOL_SIZE,
      DB_POOL_IDLE_TIMEOUT: process.env.DB_POOL_IDLE_TIMEOUT,
      WAL_CHECKPOINT_INTERVAL: process.env.WAL_CHECKPOINT_INTERVAL,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      COOKIE_SECRET: process.env.COOKIE_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
      RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
      RATE_LIMIT_WHITELIST: process.env.RATE_LIMIT_WHITELIST,
      REDIS_URL: process.env.REDIS_URL,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_DB: process.env.REDIS_DB,
      REDIS_ENABLED: process.env.REDIS_ENABLED,
      ADMIN_EMAILS: process.env.ADMIN_EMAILS,
      LOG_LEVEL: process.env.LOG_LEVEL,
      LOG_SAMPLING_RATE: process.env.LOG_SAMPLING_RATE,
      LOG_FILE_ENABLED: process.env.LOG_FILE_ENABLED,
      LOG_ROTATION_DAYS: process.env.LOG_ROTATION_DAYS,
      SENTRY_DSN: process.env.SENTRY_DSN,
      APP_DOMAIN: process.env.APP_DOMAIN,
      CDN_URL: process.env.CDN_URL,
      API_BASE_URL: process.env.API_BASE_URL,
      API_VERSION_DEFAULT: process.env.API_VERSION_DEFAULT,
      API_V1_SUNSET_DATE: process.env.API_V1_SUNSET_DATE,
      CSP_REPORT_URI: process.env.CSP_REPORT_URI,
      CSP_REPORT_ONLY: process.env.CSP_REPORT_ONLY,
      BACKUP_DIR: process.env.BACKUP_DIR,
      BACKUP_ENCRYPTION_KEY: process.env.BACKUP_ENCRYPTION_KEY,
      BACKUP_DAILY_RETENTION: process.env.BACKUP_DAILY_RETENTION,
      BACKUP_MONTHLY_RETENTION: process.env.BACKUP_MONTHLY_RETENTION,
      BACKUP_COMPRESS: process.env.BACKUP_COMPRESS,
      BACKUP_SCHEDULE: process.env.BACKUP_SCHEDULE,
      CACHE_TTL_PRODUCTS: process.env.CACHE_TTL_PRODUCTS,
      CACHE_TTL_SEARCH: process.env.CACHE_TTL_SEARCH,
      CACHE_TTL_SESSIONS: process.env.CACHE_TTL_SESSIONS,
      HEALTH_CHECK_ENABLED: process.env.HEALTH_CHECK_ENABLED,
      HEALTH_CHECK_INTERVAL: process.env.HEALTH_CHECK_INTERVAL,
      COMPRESSION_ENABLED: process.env.COMPRESSION_ENABLED,
      COMPRESSION_THRESHOLD: process.env.COMPRESSION_THRESHOLD,
      COMPRESSION_LEVEL: process.env.COMPRESSION_LEVEL,
    });
  } catch (error) {
    throw error;
  }
};

// TODO: Exportar configuración tipada
export const config = parseConfig();

// Tipo inferido del schema
export type Config = z.infer<typeof configSchema>;

