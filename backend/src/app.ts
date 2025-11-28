import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './routes';
import { env } from './config/env';
import { prisma } from './prisma';
import { csrfDoubleSubmit } from './middleware/csrf';
import { traceIdMiddleware } from './middleware/traceId';
import { requestLogger } from './middleware/requestLogger';
import metricsRouter from './routes/metrics';
import { logger } from './utils/logger';
import { sendErrorResponse } from './utils/response';

export const app = express();

// Default metrics are collected via `backend/src/utils/metrics.ts` to
// avoid double-registration — keep the app bootstrap clean here.

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      // `reportOnly` controlado por env para permitir monitorización
      // en producción pausada y un pase final a enforce.
      reportOnly: env.cspReportOnly,
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          'https://connect.facebook.net',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
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
        upgradeInsecureRequests: [],
      },
    },
    hsts: { maxAge: 15552000, includeSubDomains: true, preload: false },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);
app.use(
  rateLimit({
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
app.use(cookieParser());
app.use(traceIdMiddleware);
app.use(requestLogger);
app.use(csrfDoubleSubmit);

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
    logger.error(
      {
        error,
        route: req.originalUrl,
        traceId: res.locals.traceId,
      },
      'Error global de la API'
    );
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
