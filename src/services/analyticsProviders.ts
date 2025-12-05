import {
  initializeFbq,
  initializeGtag,
  trackCustomEvent,
} from './analyticsProviders.helpers';
import { AnalyticsEvent } from '../types/analytics';

export const initGoogleAnalytics = (gaId?: string) => {
  if (!gaId) return;
  initializeGtag(gaId);
};

export const initFacebookPixel = (fbPixelId?: string) => {
  if (!fbPixelId) return;
  initializeFbq(fbPixelId);
};

export const logEventToProviders = (event: AnalyticsEvent) => {
  trackCustomEvent(event);
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const logEventToBackend = async (
  event: AnalyticsEvent,
  sessionId: string
) => {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        sessionId,
      }),
    });
  } catch (error) {
    console.error('Error al registrar el evento de analítica:', error);
  }
};
