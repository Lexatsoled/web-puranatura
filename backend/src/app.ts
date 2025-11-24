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
import { collectDefaultMetrics } from 'prom-client';
import { logger } from './utils/logger';
import { sendErrorResponse } from './utils/response';

export const app = express();

collectDefaultMetrics();

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
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
app.use(express.json({ limit: '1mb' }));
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
