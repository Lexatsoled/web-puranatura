import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import {
  errorCounter,
  inFlightGauge,
  recordError,
  recordRequest,
  requestCounter,
  requestDurationHistogram,
  requestDurationSummary,
  requestQueueHistogram,
} from '../utils/metrics';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime.bigint();
  const traceId = res.locals.traceId;
  const method = req.method;
  const route = req.route?.path || req.originalUrl;
  inFlightGauge.inc();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const status = res.statusCode.toString();

    logger.info(`${method} ${route} ${status}`, {
      method,
      route,
      status,
      durationMs,
      traceId,
    });

    const queueStart = res.locals.requestQueuedAt;
    if (queueStart) {
      const queueDurationMs = Number(start - queueStart) / 1_000_000;
      requestQueueHistogram.observe({ method, route }, queueDurationMs / 1000);
    }

    requestDurationHistogram.observe(
      { method, route, status, traceId: traceId ?? '' },
      durationMs / 1000
    );
    requestDurationSummary.observe(
      { method, route, status, traceId: traceId ?? '' },
      durationMs / 1000
    );
    requestCounter.inc({ method, route, status, traceId: traceId ?? '' });
    recordRequest();
    if (res.statusCode >= 500) {
      errorCounter.inc({ method, route, status });
      recordError();
    }
    inFlightGauge.dec();
  });

  next();
};
