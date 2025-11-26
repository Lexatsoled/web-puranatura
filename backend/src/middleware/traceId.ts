import { context, propagation, SpanContext, SpanStatusCode, trace } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { NextFunction, Request, Response } from 'express';
import { tracer } from '../tracing/initTracing';
import { TRACE_ID_HEADER } from '../utils/response';

const formatTraceparent = (spanContext: SpanContext): string =>
  `00-${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags
    .toString(16)
    .padStart(2, '0')}`;

export const traceIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const extractedContext = propagation.extract(context.active(), req.headers);
  const span = tracer.startSpan(
    `${req.method} ${req.originalUrl}`,
    {
      attributes: {
        [SemanticAttributes.HTTP_METHOD]: req.method,
        [SemanticAttributes.HTTP_TARGET]: req.originalUrl,
        [SemanticAttributes.HTTP_ROUTE]: req.route?.path ?? req.originalUrl,
        [SemanticAttributes.HTTP_USER_AGENT]: req.headers['user-agent'] ?? '',
      },
    },
    extractedContext
  );

  const spanContext = span.spanContext();
  const spanWithContext = trace.setSpan(extractedContext, span);

  const traceId = spanContext.traceId;
  const traceparent = formatTraceparent(spanContext);
  let ended = false;
  const finalizeSpan = () => {
    if (ended) return;
    ended = true;
    span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, res.statusCode);
    if (res.statusCode >= 500) {
      span.setStatus({ code: SpanStatusCode.ERROR });
    }
    span.end();
  };

  res.locals.traceSpan = span;
  res.locals.traceId = traceId;
  (req as any).traceId = traceId;

  res.setHeader('X-Trace-Id', traceId);
  res.setHeader('X-Request-ID', traceId);
  res.setHeader('traceparent', traceparent);
  res.setHeader(TRACE_ID_HEADER, traceId);

  res.on('finish', finalizeSpan);
  res.on('close', finalizeSpan);

  context.with(spanWithContext, () => {
    next();
  });
};
