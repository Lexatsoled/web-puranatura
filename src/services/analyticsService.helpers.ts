import { AnalyticsEvent, PageViewEvent } from '../types/analytics';
import {
  getSessionId,
  initFacebookPixel,
  initGoogleAnalytics,
  logEventToBackend,
  logEventToProviders,
} from './analyticsProviders';

export const isAnalyticsEnabled = () =>
  String(import.meta.env.VITE_ENABLE_ANALYTICS || '').toLowerCase() === 'true';

export const buildIds = () => ({
  gaId: import.meta.env.VITE_GA_ID,
  fbPixelId: import.meta.env.VITE_FB_PIXEL_ID,
});

export const flushQueue = (
  queue: AnalyticsEvent[],
  track: (event: AnalyticsEvent) => void
) => {
  while (queue.length > 0) {
    const event = queue.shift();
    if (event) track(event);
  }
};

export const dispatchEvent = (event: AnalyticsEvent) => {
  logEventToProviders(event);
  void logEventToBackend(event, getSessionId());
};

export const buildPageViewEvent = ({ path, title, referrer }: PageViewEvent) =>
  ({
    category: 'page_view',
    action: 'view',
    label: path,
    metadata: {
      page_title: title,
      page_location: path,
      page_referrer: referrer,
    },
  }) satisfies AnalyticsEvent;

export const initProviders = (gaId?: string, fbPixelId?: string) => {
  initGoogleAnalytics(gaId);
  initFacebookPixel(fbPixelId);
};
