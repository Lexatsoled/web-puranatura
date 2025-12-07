import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { env } from '../config/env';
import { enqueueAnalyticsEvent } from '../services/analyticsService';
import { getTraceId } from '../utils/response';

const router = Router();

const analyticsEventSchema = z.object({
  category: z.string().min(1),
  action: z.string().min(1),
  label: z.string().optional(),
  value: z.number().optional(),
  metadata: z.object({}).passthrough().optional(),
  sessionId: z.string().optional(),
  timestamp: z.string().datetime().optional(),
});

const analyticsLimiter = rateLimit({
  windowMs: env.analyticsRateLimitWindowMs,
  max: env.analyticsRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Demasiados eventos analytics en poco tiempo',
  },
  handler: (req, res) => {
    const traceId = getTraceId(req);
    res.setHeader('X-Trace-Id', traceId);
    res.status(429).json({
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiados eventos analytics en poco tiempo',
      traceId,
    });
  },
  keyGenerator: (req) => {
    if (env.nodeEnv === 'test') {
      const key = req.headers['x-rate-key'];
      if (key) return String(key);
    }
    // Prefiere sessionId o userId en metadata para limitar por usuario/sesión
    const body: any = req.body || {};
    const session = body.sessionId ? String(body.sessionId) : null;
    const userId =
      body.metadata && body.metadata.userId
        ? String(body.metadata.userId)
        : null;
    if (session) return session;
    if (userId) return userId;
    return String(req.ip);
  },
});

const normalizeIp = (req: Request): string | undefined => {
  const xForwarded = req.headers['x-forwarded-for'];
  if (Array.isArray(xForwarded)) {
    return xForwarded[0];
  }
  if (typeof xForwarded === 'string') {
    return xForwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? undefined;
};

router.post(
  '/events',
  analyticsLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!env.analyticsIngestEnabled) {
      return res.status(503).json({
        code: 'FEATURE_DISABLED',
        message: 'El ingestion de analytics está deshabilitado',
      });
    }

    try {
      const parsed = analyticsEventSchema.parse(req.body);
      const timestamp = parsed.timestamp
        ? new Date(parsed.timestamp)
        : new Date();
      const traceId = getTraceId(req);

      void enqueueAnalyticsEvent({
        category: parsed.category,
        action: parsed.action,
        label: parsed.label,
        value: parsed.value,
        metadata: parsed.metadata,
        sessionId: parsed.sessionId,
        timestamp,
        traceId,
        userIp: normalizeIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.setHeader('X-Trace-Id', traceId);
      return res.status(202).json({ ok: true, traceId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          code: 'INVALID_ANALYTICS_PAYLOAD',
          message: 'Payload analytics inválido',
          details: error.issues,
          traceId: getTraceId(req),
        });
      }
      return next(error);
    }
  }
);

export default router;
