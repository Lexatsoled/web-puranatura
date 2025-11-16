import * as Sentry from '@sentry/react';

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        // BrowserTracing and Replay integrations if available
      ],
      
      // Performance
      tracesSampleRate: 0.1, // 10% de transacciones
      
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0, // 100% en errores
      
      // Environment
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION,
      
      // Filtros
      beforeSend(event, _hint) {
        // No enviar errores de extensiones
        if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
          return null;
        }
        return event;
      },
      
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
      ],
    });
  }
}

// Error boundaries
export const SentryErrorBoundary = Sentry.ErrorBoundary;