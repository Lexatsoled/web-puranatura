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

// Tipos para Google Analytics
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  fbq: (...args: any[]) => void;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}
