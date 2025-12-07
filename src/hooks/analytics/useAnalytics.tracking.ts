import { AnalyticsEvent } from '../../types/analytics';
import AnalyticsService from '../../services/analyticsService';

type AnalyticsInstance = ReturnType<typeof AnalyticsService.getInstance>;

export const shouldTrack = (
  analyticsInstance: AnalyticsInstance,
  consent: boolean
): boolean => {
  return analyticsInstance.isEnabled() && consent;
};

export const trackPageView = (
  analyticsInstance: AnalyticsInstance,
  consent: boolean,
  path: string,
  title: string,
  referrer: string
) => {
  if (!shouldTrack(analyticsInstance, consent)) return;
  analyticsInstance.trackPageView({
    path,
    title,
    referrer,
  });
};

export const createTrackEvent =
  (analyticsInstance: AnalyticsInstance, consent: boolean) =>
  (event: Omit<AnalyticsEvent, 'timestamp'>) => {
    if (!shouldTrack(analyticsInstance, consent)) return;
    analyticsInstance.trackEvent(event);
  };
