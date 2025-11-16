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
  metadata?: Record<string, unknown>;
}

// Tipos para Google Analytics
interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  fbq: (...args: unknown[]) => void;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}
