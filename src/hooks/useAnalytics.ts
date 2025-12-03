import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsEvent } from '../types/analytics';
import AnalyticsService from '../services/analyticsService';
import {
  readConsentFromStorage,
  writeConsentToStorage,
} from './analytics/useConsentStorage';

// AnalyticsService behaviour has been extracted into `src/services/analyticsService.ts`

// Hook personalizado para analytics
export function useAnalytics() {
  const location = useLocation();
  const analytics = useMemo(() => AnalyticsService.getInstance(), []);
  const [consentGranted, setConsentGranted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (!analytics.isEnabled()) return false;
    return readConsentFromStorage('puranatura-consent-analytics');
  });

  useEffect(() => {
    if (!analytics.isEnabled()) return;
    analytics.setConsent(consentGranted);
    writeConsentToStorage('puranatura-consent-analytics', consentGranted);
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
