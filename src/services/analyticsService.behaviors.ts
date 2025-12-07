import { AnalyticsEvent, PageViewEvent } from '../types/analytics';
import {
  buildPageViewEvent,
  dispatchEvent,
  flushQueue,
  initProviders,
} from './analyticsService.helpers';
import { AnalyticsService } from './analyticsService';

const isTrackingActive = (svc: AnalyticsService) =>
  svc.consentGranted && svc.enabled;

const initProvidersIfBrowser = (svc: AnalyticsService) => {
  if (typeof window !== 'undefined') {
    initProviders(svc.gaId, svc.fbPixelId);
  }
};

export const shouldInit = (svc: AnalyticsService) =>
  svc.initialized || !isTrackingActive(svc);

export const performInit = (svc: AnalyticsService) => {
  initProvidersIfBrowser(svc);
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
  if (!isTrackingActive(svc)) return;

  svc.initialized ? dispatchEvent(event) : svc.queue.push(event);
};

export const trackPageViewEvent = (
  svc: AnalyticsService,
  payload: PageViewEvent
) => {
  trackEventOrQueue(svc, buildPageViewEvent(payload));
};
