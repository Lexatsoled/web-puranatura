import { prisma } from '../prisma';
import { logger } from '../utils/logger';

export interface AnalyticsEventPayload {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  timestamp: Date;
  traceId?: string;
  userIp?: string;
  userAgent?: string;
}

export const enqueueAnalyticsEvent = (
  payload: AnalyticsEventPayload
): Promise<void> => {
  const serializedMetadata =
    payload.metadata && Object.keys(payload.metadata).length > 0
      ? JSON.stringify(payload.metadata)
      : null;

  const promise = prisma.analyticsEvent
    .create({
      data: {
        category: payload.category,
        action: payload.action,
        label: payload.label,
        value: payload.value,
        metadata: serializedMetadata,
        sessionId: payload.sessionId,
        traceId: payload.traceId,
        userIp: payload.userIp,
        userAgent: payload.userAgent,
        eventTime: payload.timestamp,
      },
    })
    .then(() => {
      logger.debug('Analytic event persisted', {
        category: payload.category,
        action: payload.action,
        traceId: payload.traceId,
      });
    })
    .catch((error) => {
      logger.warn('No se pudo guardar evento analytics', {
        error,
        category: payload.category,
        action: payload.action,
        traceId: payload.traceId,
      });
    });

  return promise.then(() => undefined);
};
