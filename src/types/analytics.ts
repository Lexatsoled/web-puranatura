export type EventCategory =
  | 'page_view'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'search'
  | 'user'
  | 'blog'
  | 'therapy';

export interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
}

export {};
