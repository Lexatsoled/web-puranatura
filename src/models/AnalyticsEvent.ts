import { nanoid } from 'nanoid';

export enum AnalyticsCategory {
  PAGE_VIEW = 'page_view',
  PRODUCT = 'product',
  CART = 'cart',
  CHECKOUT = 'checkout',
  SEARCH = 'search',
  USER = 'user',
  BLOG = 'blog',
  THERAPY = 'therapy',
}

export interface AnalyticsEventData {
  _id?: string;
  category: AnalyticsCategory | string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  sessionId: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  timestamp?: Date;
}

export const createAnalyticsEvent = (
  data: Omit<AnalyticsEventData, '_id' | 'timestamp'>
): AnalyticsEventData => ({
  _id: nanoid(),
  timestamp: new Date(),
  ...data,
});
