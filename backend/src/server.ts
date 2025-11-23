import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './routes';
import { env } from './config/env';
import { prisma } from './prisma';
import { csrfDoubleSubmit } from './middleware/csrf';

const app = express();

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
app.use(csrfDoubleSubmit);

// Respuesta informativa en la raíz para evitar 404 en navegadores
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend PuraNatura operativo. Usa /api/health para diagnóstico.',
  });
});

registerRoutes(app);

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[API error]', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Error interno en el backend',
      traceId: req.headers['x-request-id'],
      details: env.nodeEnv === 'development' ? error.message : undefined,
    });
  }
);

const port = env.port;
app.listen(port, () => {
  console.log(`API de PuraNatura lista en http://localhost:${port}`);
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
