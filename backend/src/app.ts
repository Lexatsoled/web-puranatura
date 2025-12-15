import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { randomBytes } from 'crypto';
import { registerRoutes } from './routes';
import { env } from './config/env';
import { prisma } from './prisma';
import { csrfDoubleSubmit } from './middleware/csrf';
import { traceIdMiddleware } from './middleware/traceId';
import { requestLogger } from './middleware/requestLogger';
import metricsRouter from './routes/metrics';
import { logger } from './utils/logger';
import { sendErrorResponse } from './utils/response';
import RedisStore from 'rate-limit-redis';
import { redis } from './lib/redis';

export const app = express();

// Detrás de proxies (NGINX / hosts locales) confiar en el primer proxy
// para respetar cabeceras como X-Forwarded-For y permitir que cookies Secure
// y rutas dependientes del proxy funcionen correctamente en staging/infra.
app.set('trust proxy', env.trustProxy);
// Default metrics are collected via `backend/src/utils/metrics.ts` to
// avoid double-registration — keep the app bootstrap clean here.

app.disable('x-powered-by');
app.use(compression());

// CSP con nonce por petición; enforce/reportOnly via env
app.use((req, res, next) => {
  const nonce = randomBytes(16).toString('base64');
  res.locals.cspNonce = nonce;

  const directives: Record<string, any> = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      `'nonce-${nonce}'`,
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://connect.facebook.net',
    ],
    scriptSrcAttr: ["'none'"],
    styleSrc: ["'self'", `'nonce-${nonce}'`, 'https://fonts.googleapis.com'],
    styleSrcAttr: ["'none'"],
    connectSrc: [
      "'self'",
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://maps.googleapis.com',
      'https://maps.gstatic.com',
      'https://connect.facebook.net',
    ],
    imgSrc: ["'self'", 'data:', 'https:', 'https://maps.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    frameAncestors: ["'none'"],
    frameSrc: ["'self'", 'https://www.google.com'],
    reportUri: ['/api/security/csp-report'],
  };
  if (!env.cspReportOnly) directives.upgradeInsecureRequests = [];

  return helmet({
    contentSecurityPolicy: {
      reportOnly: env.cspReportOnly,
      useDefaults: false,
      directives,
    },
    hsts: { maxAge: 15552000, includeSubDomains: true, preload: false },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })(req, res, next);
});

app.use(
  rateLimit({
    store: new RedisStore({
      // @ts-expect-error - Known type mismatch between ioredis and rate-limit-redis
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/api/health',
  })
);
app.use(
  cors({
    origin: env.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
// parse standard json and CSP report content-type (some browsers use application/csp-report)
app.use(
  express.json({
    limit: '1mb',
    type: (req) => {
      const t = String(req.headers['content-type'] ?? '');
      if (t.includes('application/csp-report')) return true;
      return t.includes('application/json');
    },
  })
);
// IMPORTANT: cookieParser must be before CSRF middleware to parse cookies
app.use(cookieParser());
app.use(traceIdMiddleware);
app.use(requestLogger);
// CSRF protection applied after cookieParser - this is correct order
app.use(csrfDoubleSubmit);

// Hardening: headers adicionales base mínimos
app.use((_req, res, next) => {
  // Evitar que el Referer salga a terceros por defecto
  res.setHeader('Referrer-Policy', 'same-origin');

  // Permitir únicamente capacidades muy limitadas (deny-by-default)
  // Estas directivas son deliberadamente restrictivas; añadir excepciones
  // solo cuando sean necesarias y documentadas.
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );

  // Protege a usuarios de ciertas descargas inseguras en navegadores antiguos
  res.setHeader('X-Download-Options', 'noopen');
  next();
});

// Respuesta informativa en la raíz para evitar 404 en navegadores
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend PuraNatura operativo. Usa /api/health para diagnóstico.',
  });
});

registerRoutes(app);
app.use(metricsRouter);

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error('Error global de la API', {
      error,
      route: req.originalUrl,
      traceId: res.locals.traceId,
    });
    sendErrorResponse(res, req, {
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'Error interno en el backend',
      details: env.nodeEnv === 'development' ? error.message : undefined,
    });
  }
);

export const closeApp = async () => {
  await prisma.$disconnect();
};
