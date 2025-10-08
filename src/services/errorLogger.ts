/**
 * Error Logger Service
 * Servicio centralizado para logging de errores con soporte para Sentry
 */

// Tipos de errores
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  RENDER = 'render',
  STATE = 'state',
  NAVIGATION = 'navigation',
  API = 'api',
  UNKNOWN = 'unknown',
}

export interface ErrorLogEntry {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  userAgent: string;
  url: string;
  componentStack?: string;
  additionalData?: Record<string, unknown>;
}

class ErrorLogger {
  private errors: ErrorLogEntry[] = [];
  private maxErrors = 100; // Límite de errores en memoria
  private sentryEnabled = false;

  constructor() {
    // Detectar si Sentry está disponible
    this.sentryEnabled = typeof window !== 'undefined' && 'Sentry' in window;
  }

  /**
   * Registra un error
   */
  log(
    error: Error,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    additionalData?: Record<string, unknown>
  ): void {
    const errorEntry: ErrorLogEntry = {
      id: this.generateId(),
      message: error.message,
      stack: error.stack,
      severity,
      category,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      additionalData,
    };

    // Guardar en memoria
    this.errors.push(errorEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remover el más antiguo
    }

    // Log en consola (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.group(`🚨 Error [${severity}] - ${category}`);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      if (additionalData) {
        console.error('Additional Data:', additionalData);
      }
      console.groupEnd();
    }

    // Enviar a Sentry si está disponible
    if (this.sentryEnabled && this.shouldSendToSentry(severity)) {
      this.sendToSentry(error, errorEntry);
    }

    // Guardar en localStorage para análisis posterior
    this.persistError(errorEntry);
  }

  /**
   * Registra un error de React Error Boundary
   */
  logBoundaryError(
    error: Error,
    errorInfo: React.ErrorInfo,
    componentName: string
  ): void {
    this.log(
      error,
      ErrorSeverity.HIGH,
      ErrorCategory.RENDER,
      {
        componentStack: errorInfo.componentStack,
        componentName,
      }
    );
  }

  /**
   * Registra un error de red
   */
  logNetworkError(
    error: Error,
    url: string,
    method: string,
    statusCode?: number
  ): void {
    this.log(
      error,
      statusCode && statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      ErrorCategory.NETWORK,
      {
        requestUrl: url,
        method,
        statusCode,
      }
    );
  }

  /**
   * Registra un error de API
   */
  logApiError(
    error: Error,
    endpoint: string,
    responseData?: unknown
  ): void {
    this.log(
      error,
      ErrorSeverity.MEDIUM,
      ErrorCategory.API,
      {
        endpoint,
        responseData,
      }
    );
  }

  /**
   * Obtiene todos los errores registrados
   */
  getErrors(): ErrorLogEntry[] {
    return [...this.errors];
  }

  /**
   * Obtiene errores por severidad
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLogEntry[] {
    return this.errors.filter(e => e.severity === severity);
  }

  /**
   * Limpia todos los errores
   */
  clearErrors(): void {
    this.errors = [];
    this.clearPersistedErrors();
  }

  /**
   * Inicializa Sentry (llamar al inicio de la app)
   */
  initSentry(dsn: string, environment: string): void {
    if (typeof window === 'undefined') return;

    // Placeholder para inicialización de Sentry
    // En producción, esto debería cargar e inicializar el SDK de Sentry
    console.log('Sentry initialized with DSN:', dsn, 'Environment:', environment);
    this.sentryEnabled = true;
  }

  // Métodos privados

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldSendToSentry(severity: ErrorSeverity): boolean {
    // Solo enviar errores HIGH y CRITICAL a Sentry
    return severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL;
  }

  private sendToSentry(_error: Error, errorEntry: ErrorLogEntry): void {
    if (!this.sentryEnabled) return;

    // Placeholder para envío a Sentry
    // En producción con Sentry instalado:
    // Sentry.captureException(error, {
    //   level: this.getSentryLevel(errorEntry.severity),
    //   tags: {
    //     category: errorEntry.category,
    //   },
    //   extra: errorEntry.additionalData,
    // });

    console.log('Error sent to Sentry:', errorEntry.id);
  }

  /**
   * Convierte severidad a nivel de Sentry
   * Descomentado cuando se integre Sentry
   */
  // private getSentryLevel(severity: ErrorSeverity): string {
  //   switch (severity) {
  //     case ErrorSeverity.LOW:
  //       return 'info';
  //     case ErrorSeverity.MEDIUM:
  //       return 'warning';
  //     case ErrorSeverity.HIGH:
  //       return 'error';
  //     case ErrorSeverity.CRITICAL:
  //       return 'fatal';
  //     default:
  //       return 'error';
  //   }
  // }

  private persistError(errorEntry: ErrorLogEntry): void {
    try {
      const key = 'puranatura_errors';
      const stored = localStorage.getItem(key);
      const errors = stored ? JSON.parse(stored) : [];
      
      errors.push({
        ...errorEntry,
        timestamp: errorEntry.timestamp.toISOString(),
      });

      // Mantener solo los últimos 50 errores en localStorage
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }

      localStorage.setItem(key, JSON.stringify(errors));
    } catch (e) {
      // Ignorar errores de localStorage (puede estar lleno o deshabilitado)
      console.warn('Could not persist error to localStorage:', e);
    }
  }

  private clearPersistedErrors(): void {
    try {
      localStorage.removeItem('puranatura_errors');
    } catch (e) {
      console.warn('Could not clear persisted errors:', e);
    }
  }
}

// Exportar instancia singleton
export const errorLogger = new ErrorLogger();

// Hook para usar el logger en componentes React
export function useErrorLogger() {
  return {
    logError: errorLogger.log.bind(errorLogger),
    logNetworkError: errorLogger.logNetworkError.bind(errorLogger),
    logApiError: errorLogger.logApiError.bind(errorLogger),
    getErrors: errorLogger.getErrors.bind(errorLogger),
    clearErrors: errorLogger.clearErrors.bind(errorLogger),
  };
}
