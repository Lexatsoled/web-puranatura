/**
 * Global Error Handler
 * Captura errores no manejados y promesas rechazadas
 */

import { errorLogger, ErrorSeverity, ErrorCategory } from '../services/errorLogger';

/**
 * Inicializa los manejadores globales de errores
 */
export function initializeGlobalErrorHandlers(): void {
  // Manejar errores no capturados
  window.addEventListener('error', (event: ErrorEvent) => {
    errorLogger.log(
      new Error(event.message),
      ErrorSeverity.HIGH,
      ErrorCategory.UNKNOWN,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
  });

  // Manejar promesas rechazadas no manejadas
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));

    errorLogger.log(
      error,
      ErrorSeverity.MEDIUM,
      ErrorCategory.UNKNOWN,
      {
        type: 'unhandledRejection',
        reason: event.reason,
      }
    );

    // Prevenir que el error se propague a la consola (opcional)
    // event.preventDefault();
  });

  // Log de información del entorno
  if (import.meta.env.DEV) {
    console.log('✅ Global error handlers initialized');
  }
}

/**
 * Captura errores de red de fetch
 */
export function createFetchWithErrorHandling() {
  const originalFetch = window.fetch;

  return async function fetchWithErrorHandling(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    try {
      const response = await originalFetch(input, init);

      // Log de errores HTTP
      if (!response.ok) {
        const url = typeof input === 'string' ? input : input.toString();
        errorLogger.logNetworkError(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          url,
          init?.method || 'GET',
          response.status
        );
      }

      return response;
    } catch (error) {
      // Log de errores de red
      const url = typeof input === 'string' ? input : input.toString();
      errorLogger.logNetworkError(
        error instanceof Error ? error : new Error(String(error)),
        url,
        init?.method || 'GET'
      );

      throw error;
    }
  };
}

/**
 * Wrapper para funciones async que maneja errores automáticamente
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  errorCategory: ErrorCategory = ErrorCategory.UNKNOWN
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.log(
        error instanceof Error ? error : new Error(String(error)),
        ErrorSeverity.MEDIUM,
        errorCategory,
        {
          functionName: fn.name,
          arguments: args,
        }
      );
      throw error;
    }
  }) as T;
}
