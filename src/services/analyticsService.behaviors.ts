import { AnalyticsEvent, PageViewEvent } from '../types/analytics';
import {
  buildPageViewEvent,
  dispatchEvent,
  flushQueue,
  initProviders,
} from './analyticsService.helpers';
import { AnalyticsService } from './analyticsService';

export const shouldInit = (svc: AnalyticsService) =>
  svc.initialized || !svc.consentGranted || !svc.enabled;

export const performInit = (svc: AnalyticsService) => {
  if (typeof window !== 'undefined') {
    initProviders(svc.gaId, svc.fbPixelId);
  }
  svc.initialized = true;
  flushQueue(svc.queue, (event: AnalyticsEvent) => svc.trackEvent(event));
};

export const setConsentState = (svc: AnalyticsService, granted: boolean) => {
  svc.consentGranted = granted && svc.enabled;
  if (!svc.consentGranted) {
    svc.queue = [];
  }
};

export const trackEventOrQueue = (
  svc: AnalyticsService,
  event: AnalyticsEvent
) => {
  if (!svc.consentGranted || !svc.enabled) return;
  if (!svc.initialized) {
    svc.queue.push(event);
    return;
  }
  dispatchEvent(event);
};

export const trackPageViewEvent = (
  svc: AnalyticsService,
  payload: PageViewEvent
) => {
  if (!svc.consentGranted || !svc.enabled) return;
  trackEventOrQueue(svc, buildPageViewEvent(payload));
};
