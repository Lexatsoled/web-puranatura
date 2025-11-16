import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type EventCategory =
  | 'page_view'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'search'
  | 'user'
  | 'blog'
  | 'therapy';

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

interface PageViewEvent {
  path: string;
  title: string;
  referrer: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  init() {
    if (this.initialized) return;

    // Inicializar servicios de analytics
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (process.env.REACT_APP_GA_ID) {
        this.loadScript(
          `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_ID}`
        );
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (...args) {
          window.dataLayer.push(...args);
        };
        window.gtag('js', new Date());
        window.gtag('config', process.env.REACT_APP_GA_ID);
      }

      // Facebook Pixel
      if (process.env.REACT_APP_FB_PIXEL_ID) {
        this.loadScript('https://connect.facebook.net/en_US/fbevents.js');
        window.fbq =
          window.fbq ||
          function (...args) {
            (window.fbq.q = window.fbq.q || []).push(...args);
          };
        window.fbq('init', process.env.REACT_APP_FB_PIXEL_ID);
      }
    }

    this.initialized = true;
    this.flushQueue();
  }

  private loadScript(src: string) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  private flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) this.trackEvent(event);
    }
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    // Registrar en nuestro backend para análisis personalizado
    this.logEventToBackend(event);
  }

  trackPageView({ path, title, referrer }: PageViewEvent) {
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

  private async logEventToBackend(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          sessionId: this.getSessionId(),
        }),
      });
    } catch {
      // Silent fail - analytics no debe bloquear funcionalidad
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
}

// Hook personalizado para analytics
export function useAnalytics() {
  const location = useLocation();
  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    analytics.init();
  }, [analytics]);

  // Seguimiento automático de vistas de página
  useEffect(() => {
    analytics.trackPageView({
      path: location.pathname + location.search,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location, analytics]);

  const trackEvent = useCallback((event: Omit<AnalyticsEvent, 'timestamp'>) => {
    analytics.trackEvent(event);
  }, [analytics]);

  return { trackEvent };
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
