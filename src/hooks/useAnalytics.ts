import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AnalyticsService from '../services/analyticsService';
import {
  getInitialConsent,
  syncConsent,
  trackPageView,
  createTrackEvent,
} from './analytics/useAnalytics.helpers';

// AnalyticsService behaviour has been extracted into `src/services/analyticsService.ts`

// Hook personalizado para analytics
export function useAnalytics() {
  const location = useLocation();
  const analytics = useMemo(() => AnalyticsService.getInstance(), []);
  const [consentGranted, setConsentGranted] = useState<boolean>(() =>
    getInitialConsent(analytics)
  );

  useEffect(() => {
    syncConsent(analytics, consentGranted);
  }, [analytics, consentGranted]);

  useEffect(() => {
    trackPageView(
      analytics,
      consentGranted,
      location.pathname + location.search,
      document.title,
      document.referrer
    );
  }, [analytics, consentGranted, location]);

  const trackEvent = useCallback(createTrackEvent(analytics, consentGranted), [
    analytics,
    consentGranted,
  ]);

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
