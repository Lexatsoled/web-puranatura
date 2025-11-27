import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsEvent, PageViewEvent } from '../types/analytics';
import {
  initGoogleAnalytics,
  initFacebookPixel,
  logEventToProviders,
  logEventToBackend,
  getSessionId,
} from '../services/analyticsProviders';

class AnalyticsService {
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

  // El método interno 'logEventToBackend' se removió porque usamos
  // el helper compartido `logEventToBackend` desde services/analyticsProviders
  // (evita duplicidad y problemas de tipos LSP en el cliente).

  // Session management uses the shared helper in services/analyticsProviders.
  // Eliminar el helper local para evitar duplicidad y errores de linter/ts.
}

// Hook personalizado para analytics
export function useAnalytics() {
  const location = useLocation();
  const analytics = useMemo(() => AnalyticsService.getInstance(), []);
  const [consentGranted, setConsentGranted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (!analytics.isEnabled()) return false;
    try {
      return (
        window.localStorage.getItem('puranatura-consent-analytics') ===
        'granted'
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!analytics.isEnabled()) return;
    analytics.setConsent(consentGranted);
    try {
      window.localStorage.setItem(
        'puranatura-consent-analytics',
        consentGranted ? 'granted' : 'denied'
      );
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [analytics, consentGranted]);

  useEffect(() => {
    if (!analytics.isEnabled() || !consentGranted) return;
    analytics.trackPageView({
      path: location.pathname + location.search,
      title: document.title,
      referrer: document.referrer,
    });
  }, [analytics, consentGranted, location]);

  const trackEvent = useCallback(
    (event: Omit<AnalyticsEvent, 'timestamp'>) => {
      if (!analytics.isEnabled() || !consentGranted) return;
      analytics.trackEvent(event);
    },
    [analytics, consentGranted]
  );

  const setConsent = useCallback((granted: boolean) => {
    setConsentGranted(granted);
  }, []);

  return {
    trackEvent,
    setConsent,
    enabled: analytics.isEnabled(),
    consentGranted,
  };
}

// Tipos de eventos predefinidos
export const ANALYTICS_EVENTS = {
  PRODUCT: {
    VIEW: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    ADD_TO_WISHLIST: 'add_to_wishlist',
  },
  CART: {
    VIEW: 'cart_view',
    BEGIN_CHECKOUT: 'begin_checkout',
    ADD_SHIPPING_INFO: 'add_shipping_info',
    ADD_PAYMENT_INFO: 'add_payment_info',
  },
  PURCHASE: {
    COMPLETE: 'purchase_complete',
    CANCEL: 'purchase_cancel',
  },
  SEARCH: {
    SEARCH: 'search',
    FILTER: 'filter',
    SORT: 'sort',
  },
  USER: {
    SIGN_UP: 'sign_up',
    LOGIN: 'login',
    LOGOUT: 'logout',
  },
  BLOG: {
    VIEW_POST: 'view_post',
    SHARE_POST: 'share_post',
    COMMENT: 'comment',
  },
  THERAPY: {
    VIEW: 'therapy_view',
    BOOK: 'therapy_book',
    CANCEL: 'therapy_cancel',
  },
} as const;
