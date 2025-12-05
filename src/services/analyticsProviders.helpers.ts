import { AnalyticsEvent } from '../types/analytics';

export interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  // fbq is a function but also holds a queue property on the function
  fbq?: ((...args: unknown[]) => void) & { q?: unknown[] };
}

const loadExternalScript = (src: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const getAnalyticsWindow = (): AnalyticsWindow => window as AnalyticsWindow;

const initDataLayer = (win: AnalyticsWindow) => {
  win.dataLayer = win.dataLayer || [];
};

const ensureGtag = (win: AnalyticsWindow) => {
  if (!win.gtag) {
    win.gtag = function () {
      win.dataLayer!.push(arguments);
    };
  }
};

export const initializeGtag = (gaId: string) => {
  loadExternalScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
  const win = getAnalyticsWindow();
  initDataLayer(win);
  ensureGtag(win);
  win.gtag!('js', new Date());
  win.gtag!('config', gaId);
};

const ensureFbq = (win: AnalyticsWindow) => {
  if (!win.fbq) {
    // create a function object and attach a queue property
    const fn = function (..._args: unknown[]) {
      // no-op for now
    } as ((...args: unknown[]) => void) & { q?: unknown[] };
    fn.q = fn.q || [];
    win.fbq = fn;
  }
};

export const initializeFbq = (fbPixelId: string) => {
  loadExternalScript('https://connect.facebook.net/en_US/fbevents.js');
  const win = getAnalyticsWindow();
  ensureFbq(win);
  win.fbq!('init', fbPixelId);
};

export const trackCustomEvent = (event: AnalyticsEvent) => {
  const win = getAnalyticsWindow();
  if (win.gtag) {
    win.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }
  if (win.fbq) {
    win.fbq('trackCustom', event.action, {
      category: event.category,
      label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }
};
