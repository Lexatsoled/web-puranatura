import { AnalyticsEvent, PageViewEvent } from '../types/analytics';
import { buildIds, isAnalyticsEnabled } from './analyticsService.helpers';
import {
  performInit,
  setConsentState,
  shouldInit,
  trackEventOrQueue,
  trackPageViewEvent,
} from './analyticsService.behaviors';

/**
 * AnalyticsService: singleton service that centralizes analytics behaviour
 * (initialization, consent handling, queueing, and dispatching).
 * Extracted from the hook for better testability and separation of concerns.
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  initialized: boolean = false;
  queue: AnalyticsEvent[] = [];
  consentGranted: boolean = false;
  readonly enabled = isAnalyticsEnabled();
  readonly gaId: string | undefined;
  readonly fbPixelId: string | undefined;

  private constructor() {
    const ids = buildIds();
    this.gaId = ids.gaId;
    this.fbPixelId = ids.fbPixelId;
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // For tests -> allow resetting the singleton
  static __resetInstanceForTests() {
    (AnalyticsService as any).instance = undefined;
  }

  isEnabled() {
    return this.enabled;
  }

  setConsent(granted: boolean) {
    setConsentState(this, granted);
    if (this.consentGranted) this.init();
  }

  init() {
    if (shouldInit(this)) return;
    performInit(this);
  }

  trackEvent(event: AnalyticsEvent) {
    trackEventOrQueue(this, event);
  }

  trackPageView({ path, title, referrer }: PageViewEvent) {
    trackPageViewEvent(this, { path, title, referrer });
  }
}

export default AnalyticsService;
