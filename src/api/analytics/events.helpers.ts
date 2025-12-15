// import { Request } from 'express';
type Request = any;
import { AnalyticsEvent } from '../../types/analytics';
import { getClientIp } from './network.helpers';

export interface ExtendedAnalyticsEvent extends AnalyticsEvent {
  timestamp: string;
  sessionId: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

export const validateEvent = (event: Partial<ExtendedAnalyticsEvent>) =>
  Boolean(event?.category && event?.action);

export const enrichEvent = (event: ExtendedAnalyticsEvent, req: Request) => ({
  ...event,
  ip: getClientIp(req),
  userAgent: req.headers['user-agent'],
  referrer: req.headers.referer,
});

export const handlers: Record<
  string,
  (event: ExtendedAnalyticsEvent) => Promise<void>
> = {
  product: async () => {},
  cart: async () => {},
};
