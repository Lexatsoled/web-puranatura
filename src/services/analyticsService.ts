import { AnalyticsEvent, PageViewEvent } from '../types/analytics';
import {
  initGoogleAnalytics,
  initFacebookPixel,
  logEventToProviders,
  logEventToBackend,
  getSessionId,
} from './analyticsProviders';

/**
 * AnalyticsService: singleton service that centralizes analytics behaviour
 * (initialization, consent handling, queueing, and dispatching).
 * Extracted from the hook for better testability and separation of concerns.
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];
  private consentGranted: boolean = false;
  private readonly enabled =
    String(import.meta.env.VITE_ENABLE_ANALYTICS || '').toLowerCase() ===
    'true';
  private readonly gaId = import.meta.env.VITE_GA_ID;
  private readonly fbPixelId = import.meta.env.VITE_FB_PIXEL_ID;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // For tests -> allow resetting the singleton
  static __resetInstanceForTests() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (AnalyticsService as any).instance = undefined;
  }

  isEnabled() {
    return this.enabled;
  }

  setConsent(granted: boolean) {
    this.consentGranted = granted && this.enabled;
    if (this.consentGranted) {
      this.init();
    } else {
      this.queue = [];
    }
  }

  init() {
    if (this.initialized || !this.consentGranted || !this.enabled) return;

    if (typeof window !== 'undefined') {
      this.initGoogleAnalytics();
      this.initFacebookPixel();
    }

    this.initialized = true;
    this.flushQueue();
  }

  private initGoogleAnalytics() {
    initGoogleAnalytics(this.gaId);
  }

  private initFacebookPixel() {
    initFacebookPixel(this.fbPixelId);
  }

  private flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) this.trackEvent(event);
    }
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.consentGranted || !this.enabled) {
      return;
    }
    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    logEventToProviders(event);
    void logEventToBackend(event, getSessionId());
  }

  trackPageView({ path, title, referrer }: PageViewEvent) {
    if (!this.consentGranted || !this.enabled) return;
    this.trackEvent({
      category: 'page_view',
      action: 'view',
      label: path,
      metadata: {
        page_title: title,
        page_location: path,
        page_referrer: referrer,
      },
    });
  }
}

export default AnalyticsService;
