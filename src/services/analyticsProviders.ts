import { AnalyticsEvent } from '../types/analytics';

const loadScript = (src: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

export const initGoogleAnalytics = (gaId?: string) => {
  if (!gaId) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
  const anyWindow = window as any;
  anyWindow.dataLayer = anyWindow.dataLayer || [];
  anyWindow.gtag = function () {
    anyWindow.dataLayer.push(arguments);
  };
  anyWindow.gtag('js', new Date());
  anyWindow.gtag('config', gaId);
};

export const initFacebookPixel = (fbPixelId?: string) => {
  if (!fbPixelId) return;
  loadScript('https://connect.facebook.net/en_US/fbevents.js');
  const anyWindow = window as any;
  anyWindow.fbq =
    anyWindow.fbq ||
    function () {
      (anyWindow.fbq.q = anyWindow.fbq.q || []).push(arguments);
    };
  anyWindow.fbq('init', fbPixelId);
};

export const logEventToProviders = (event: AnalyticsEvent) => {
  const anyWindow = window as any;
  if (anyWindow.gtag) {
    anyWindow.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }
  if (anyWindow.fbq) {
    anyWindow.fbq('trackCustom', event.action, {
      category: event.category,
      label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }
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
