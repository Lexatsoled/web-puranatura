import type { Response, Request } from 'express';

export const TRACE_ID_HEADER = 'x-request-id';

export interface ErrorPayload {
  status: number;
  code: string;
  message: string;
  details?: string;
}

export const getTraceId = (req: Request): string => {
  try {
    const incoming = (req as any).traceId || req.header(TRACE_ID_HEADER);
    return incoming ?? '';
  } catch (e) {
    void e;
    return '';
  }
};

export const sendErrorResponse = (
  res: Response,
  _req: Request,
  payload: ErrorPayload
): void => {
  try {
    const traceId = getTraceId(_req);
    if (traceId) {
      res.setHeader('X-Trace-Id', traceId);
    }

    res.status(payload.status).json({
      code: payload.code,
      message: payload.message,
      details: payload.details,
    });
  } catch (e) {
    try {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Fallback error' });
    } catch (innerError) {
      void innerError;
    }
    void e;
  }
};
