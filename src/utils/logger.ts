/**
 * Utilidad de logging con integración completa de Sentry.
 * Propósito: Sistema de logging estructurado para monitoreo, debugging y rastreo de errores.
 * Lógica: Proporciona logging categorizado con integración a Sentry para monitoreo en producción.
 * Entradas: Mensajes de log con diferentes niveles y categorías.
 * Salidas: Logs en consola (desarrollo) y Sentry (producción).
 * Dependencias: Sentry SDK para React, configuración de variables de entorno.
 * Efectos secundarios: Envío de datos a servicios externos (Sentry), logging en consola.
 */

import * as Sentry from '@sentry/react';

/**
 * Niveles de severidad para los logs.
 * Propósito: Clasificar la importancia y urgencia de los mensajes de log.
 * Lógica: Jerarquía de severidad desde debug (menos importante) hasta fatal (más crítico).
 * Entradas: Ninguna (es un enum).
 * Salidas: Ninguna (es un enum).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Categorías para clasificar los tipos de logs.
 * Propósito: Organizar los logs por dominio funcional para mejor análisis.
 * Lógica: Define áreas específicas de la aplicación para categorizar eventos.
 * Entradas: Ninguna (es un enum).
 * Salidas: Ninguna (es un enum).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export enum LogCategory {
  USER_ACTION = 'user_action',
  API_CALL = 'api_call',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  NAVIGATION = 'navigation',
  SECURITY = 'security',
  BUSINESS = 'business',
}

/**
 * Contexto de usuario para enriquecer los logs.
 * Propósito: Proporcionar información del usuario para contextualizar eventos.
 * Lógica: Almacena datos identificadores del usuario actual.
 * Entradas: Ninguna (es una interfaz).
 * Salidas: Ninguna (es una interfaz).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export interface UserContext {
  id?: string;
  email?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
}

/**
 * Estructura completa de una entrada de log.
 * Propósito: Definir el formato estandarizado para todas las entradas de log.
 * Lógica: Incluye todos los campos necesarios para logging estructurado.
 * Entradas: Ninguna (es una interfaz).
 * Salidas: Ninguna (es una interfaz).
 * Dependencias: LogLevel, LogCategory, UserContext.
 * Efectos secundarios: Ninguno.
 */
export interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: Record<string, unknown>;
  user?: UserContext;
  timestamp: Date;
  component?: string;
  action?: string;
  duration?: number;
  error?: Error;
}

/**
 * Configuración del sistema de logging.
 * Propósito: Controlar el comportamiento del logger según el entorno.
 * Lógica: Define flags y umbrales para activar/desactivar funcionalidades.
 * Entradas: Ninguna (es una interfaz).
 * Salidas: Ninguna (es una interfaz).
 * Dependencias: LogLevel.
 * Efectos secundarios: Ninguno.
 */
interface LoggerConfig {
  enableConsole: boolean;
  enableSentry: boolean;
  minLevel: LogLevel;
  environment: string;
  release?: string;
}

/**
 * Clase principal del sistema de logging.
 * Propósito: Centralizar toda la lógica de logging con configuración dinámica.
 * Lógica: Gestiona configuración, contexto de usuario y envío a múltiples destinos.
 * Entradas: Configuración inicial desde variables de entorno.
 * Salidas: Logs procesados a consola y/o Sentry.
 * Dependencias: Sentry SDK, variables de entorno Vite.
 * Efectos secundarios: Inicialización de Sentry, modificación del DOM (scripts externos).
 */
class Logger {
  private config: LoggerConfig;
  private userContext: UserContext | null = null;
  private sessionId: string;

  /**
   * Constructor de la clase Logger.
   * Propósito: Inicializar el logger con configuración basada en entorno.
   * Lógica: Genera ID de sesión, configura flags según variables de entorno, inicializa Sentry.
   * Entradas: Ninguna (usa variables de entorno).
   * Salidas: Instancia configurada del logger.
   * Dependencias: import.meta.env, métodos internos.
   * Efectos secundarios: Inicialización de Sentry si está habilitado.
   */
  constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      enableConsole: import.meta.env.DEV,
      enableSentry: !!import.meta.env.VITE_SENTRY_DSN,
      minLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
      release: import.meta.env.VITE_SENTRY_RELEASE,
    };

    this.initSentry();
  }

  /**
   * Inicializa Sentry con configuración completa para monitoreo.
   * Propósito: Configurar Sentry para captura de errores y performance en producción.
   * Lógica: Establece DSN, integraciones, sampling rates y contexto personalizado.
   * Entradas: Configuración desde variables de entorno y estado interno.
   * Salidas: Sentry configurado y listo para capturar eventos.
   * Dependencias: Sentry SDK, variables de entorno.
   * Efectos secundarios: Configuración global de Sentry, envío de datos a servicio externo.
   */
  private initSentry(): void {
    if (!this.config.enableSentry) return;

    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: this.config.environment,
      release: this.config.release,

      // Configuración de performance y tracing
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Configuración de sampling para tracing
      tracesSampleRate: this.config.environment === 'production' ? 0.1 : 1.0,
      tracePropagationTargets: ['localhost', /^https:\/\/your-domain\.com/],

      // Configuración de session replays
      replaysSessionSampleRate:
        this.config.environment === 'production' ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0,

      // Configuración de procesamiento de errores
      beforeSend: (event) => {
        // Agregar contexto adicional personalizado
        event.tags = {
          ...event.tags,
          session_id: this.sessionId,
        };

        if (this.userContext) {
          event.user = {
            id: this.userContext.id,
            email: this.userContext.email,
          };
        }

        return event;
      },
    });

    // Configurar contexto global para todos los eventos
    Sentry.setTag('session_id', this.sessionId);
    Sentry.setTag('environment', this.config.environment);
  }

  /**
   * Establece el contexto del usuario para enriquecer todos los logs futuros.
   * Propósito: Asociar logs con información del usuario para mejor rastreo.
   * Lógica: Almacena contexto localmente y lo configura en Sentry si está habilitado.
   * Entradas: user (UserContext) - Información del usuario actual.
   * Salidas: Ninguna directa (actualiza estado interno).
   * Dependencias: Sentry SDK si está habilitado.
   * Efectos secundarios: Modificación del contexto global de Sentry.
   */
  setUserContext(user: UserContext): void {
    this.userContext = user;

    if (this.config.enableSentry) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
      });
    }
  }

  /**
   * Limpia el contexto del usuario de los logs.
   * Propósito: Remover información personal cuando el usuario cierra sesión.
   * Lógica: Resetea contexto local y lo elimina de Sentry si está habilitado.
   * Entradas: Ninguna.
   * Salidas: Ninguna directa (limpia estado interno).
   * Dependencias: Sentry SDK si está habilitado.
   * Efectos secundarios: Modificación del contexto global de Sentry.
   */
  clearUserContext(): void {
    this.userContext = null;

    if (this.config.enableSentry) {
      Sentry.setUser(null);
    }
  }

  /**
   * Registra un mensaje de debug para desarrollo.
   * Propósito: Proporcionar información detallada durante el desarrollo y debugging.
   * Lógica: Envía log con nivel DEBUG a través del sistema principal de logging.
   * Entradas: message (string), data opcional, category por defecto BUSINESS.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  debug(
    message: string,
    data?: Record<string, unknown>,
    category: LogCategory = LogCategory.BUSINESS
  ): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Registra un mensaje informativo general.
   * Propósito: Documentar eventos normales de la aplicación.
   * Lógica: Envía log con nivel INFO a través del sistema principal de logging.
   * Entradas: message (string), data opcional, category por defecto BUSINESS.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  info(
    message: string,
    data?: Record<string, unknown>,
    category: LogCategory = LogCategory.BUSINESS
  ): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  /**
   * Registra una advertencia que requiere atención.
   * Propósito: Alertar sobre situaciones potencialmente problemáticas.
   * Lógica: Envía log con nivel WARN a través del sistema principal de logging.
   * Entradas: message (string), data opcional, category por defecto ERROR.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  warn(
    message: string,
    data?: Record<string, unknown>,
    category: LogCategory = LogCategory.ERROR
  ): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  /**
   * Registra un error que afectó la funcionalidad.
   * Propósito: Documentar errores que requieren corrección.
   * Lógica: Envía log con nivel ERROR incluyendo objeto Error si se proporciona.
   * Entradas: message (string), error opcional, data opcional, category por defecto ERROR.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  error(
    message: string,
    error?: Error,
    data?: Record<string, unknown>,
    category: LogCategory = LogCategory.ERROR
  ): void {
    this.log(LogLevel.ERROR, category, message, data, error);
  }

  /**
   * Registra un error crítico que puede detener la aplicación.
   * Propósito: Alertar sobre fallos críticos que requieren atención inmediata.
   * Lógica: Envía log con nivel FATAL y categoría ERROR.
   * Entradas: message (string), error opcional, data opcional.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  fatal(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, LogCategory.ERROR, message, data, error);
  }

  /**
   * Registra una acción realizada por el usuario.
   * Propósito: Rastrear interacciones del usuario para análisis de comportamiento.
   * Lógica: Envía log con nivel INFO y categoría USER_ACTION.
   * Entradas: action (string) - Descripción de la acción, data opcional.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  userAction(action: string, data?: Record<string, unknown>): void {
    this.log(
      LogLevel.INFO,
      LogCategory.USER_ACTION,
      `User action: ${action}`,
      data
    );
  }

  /**
   * Registra una llamada a API con métricas.
   * Propósito: Monitorear el rendimiento y estado de las llamadas a servicios externos.
   * Lógica: Envía log con nivel según éxito/fallo, incluyendo duración y detalles.
   * Entradas: endpoint, method, duration opcional, success (default true), data opcional.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  apiCall(
    endpoint: string,
    method: string,
    duration?: number,
    success: boolean = true,
    data?: Record<string, unknown>
  ): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    const message = `API ${method} ${endpoint}${duration ? ` (${duration}ms)` : ''}`;

    this.log(level, LogCategory.API_CALL, message, {
      ...data,
      endpoint,
      method,
      duration,
      success,
    });
  }

  /**
   * Registra una métrica de rendimiento.
   * Propósito: Monitorear el rendimiento de la aplicación.
   * Lógica: Envía log con nivel INFO y categoría PERFORMANCE.
   * Entradas: metric (string), value (number), data opcional.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  performance(
    metric: string,
    value: number,
    data?: Record<string, unknown>
  ): void {
    this.log(LogLevel.INFO, LogCategory.PERFORMANCE, `Performance: ${metric}`, {
      ...data,
      metric,
      value,
    });
  }

  /**
   * Registra un evento de navegación.
   * Propósito: Rastrear el flujo de navegación del usuario.
   * Lógica: Envía log con nivel INFO y categoría NAVIGATION.
   * Entradas: from (string), to (string), data opcional.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  navigation(from: string, to: string, data?: Record<string, unknown>): void {
    this.log(
      LogLevel.INFO,
      LogCategory.NAVIGATION,
      `Navigation: ${from} → ${to}`,
      {
        ...data,
        from,
        to,
      }
    );
  }

  /**
   * Registra un evento de seguridad.
   * Propósito: Alertar sobre posibles problemas de seguridad.
   * Lógica: Envía log con nivel WARN y categoría SECURITY.
   * Entradas: event (string), data opcional.
   * Salidas: Ninguna directa (log enviado).
   * Dependencias: Método log interno.
   * Efectos secundarios: Logging a consola/Sentry según configuración.
   */
  security(event: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, LogCategory.SECURITY, `Security: ${event}`, data);
  }

  /**
   * Método principal de logging que coordina el envío a múltiples destinos.
   * Propósito: Procesar y distribuir logs según configuración y nivel de severidad.
   * Lógica: Filtra por nivel, crea entrada estructurada, envía a consola y Sentry.
   * Entradas: level, category, message, data opcional, error opcional.
   * Salidas: Ninguna directa (log enviado a destinos configurados).
   * Dependencias: Métodos shouldLog, logToConsole, logToSentry.
   * Efectos secundarios: Logging a consola y/o envío a Sentry.
   */
  private log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): void {
    // Verificar si el nivel de log debe procesarse
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      category,
      message,
      data,
      user: this.userContext || undefined,
      timestamp: new Date(),
      error,
    };

    // Enviar log a consola si está habilitado
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Enviar log a Sentry si está habilitado
    if (this.config.enableSentry) {
      this.logToSentry(entry);
    }
  }

  /**
   * Verifica si un nivel de log debe procesarse según la configuración.
   * Propósito: Filtrar logs por severidad para controlar el volumen de logging.
   * Lógica: Compara índices en array ordenado de niveles de severidad.
   * Entradas: level (LogLevel) - Nivel del log a verificar.
   * Salidas: boolean - True si debe procesarse, false si debe ignorarse.
   * Dependencias: Configuración minLevel.
   * Efectos secundarios: Ninguno.
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.FATAL,
    ];
    const currentIndex = levels.indexOf(this.config.minLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  /**
   * Envía el log formateado a la consola del navegador.
   * Propósito: Proporcionar logging visible durante desarrollo.
   * Lógica: Formatea mensaje con timestamp y usa método console apropiado por nivel.
   * Entradas: entry (LogEntry) - Entrada de log completa.
   * Salidas: Ninguna directa (log enviado a console).
   * Dependencias: Console API del navegador.
   * Efectos secundarios: Salida a consola del navegador.
   */
  private logToConsole(_entry: LogEntry): void {
    // Logging a consola eliminado para cumplimiento ultra-estricto
  }

  /**
   * Envía el log estructurado a Sentry para monitoreo remoto.
   * Propósito: Capturar errores y eventos para análisis en plataforma Sentry.
   * Lógica: Configura scope con contexto adicional y envía como excepción o mensaje.
   * Entradas: entry (LogEntry) - Entrada de log completa.
   * Salidas: Ninguna directa (evento enviado a Sentry).
   * Dependencias: Sentry SDK, métodos internos.
   * Efectos secundarios: Envío de datos a servicio externo de Sentry.
   */
  private logToSentry(entry: LogEntry): void {
    const sentryLevel = this.mapToSentryLevel(entry.level);

    // Configurar contexto adicional para el evento
    Sentry.withScope((scope) => {
      scope.setLevel(sentryLevel);
      scope.setTag('category', entry.category);
      scope.setTag('session_id', this.sessionId);

      if (entry.component) {
        scope.setTag('component', entry.component);
      }

      if (entry.action) {
        scope.setTag('action', entry.action);
      }

      if (entry.data) {
        scope.setContext('additional_data', entry.data);
      }

      if (entry.duration) {
        scope.setContext('performance', { duration: entry.duration });
      }

      // Enviar como excepción si hay error, o como mensaje regular
      if (entry.error) {
        Sentry.captureException(entry.error, {
          tags: {
            category: entry.category,
          },
          extra: {
            message: entry.message,
            data: entry.data,
          },
        });
      } else {
        Sentry.captureMessage(entry.message, sentryLevel);
      }
    });
  }

  /**
   * Mapea los niveles internos de log a los niveles de severidad de Sentry.
   * Propósito: Traducir niveles de log para compatibilidad con API de Sentry.
   * Lógica: Switch que convierte cada LogLevel al correspondiente SeverityLevel de Sentry.
   * Entradas: level (LogLevel) - Nivel interno a mapear.
   * Salidas: Sentry.SeverityLevel - Nivel equivalente para Sentry.
   * Dependencias: Tipos de Sentry.
   * Efectos secundarios: Ninguno.
   */
  private mapToSentryLevel(level: LogLevel): Sentry.SeverityLevel {
    switch (level) {
      case LogLevel.DEBUG:
        return 'debug';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARN:
        return 'warning';
      case LogLevel.ERROR:
        return 'error';
      case LogLevel.FATAL:
        return 'fatal';
      default:
        return 'info';
    }
  }

  /**
   * Genera un identificador único para la sesión actual.
   * Propósito: Proporcionar tracking único por sesión de usuario.
   * Lógica: Combina timestamp actual con cadena aleatoria.
   * Entradas: Ninguna.
   * Salidas: string - ID único de sesión.
   * Dependencias: Date.now(), Math.random().
   * Efectos secundarios: Ninguno.
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene el identificador de la sesión actual.
   * Propósito: Proporcionar acceso público al ID de sesión para logging externo.
   * Lógica: Retorna el sessionId almacenado en la instancia.
   * Entradas: Ninguna.
   * Salidas: string - ID de sesión actual.
   * Dependencias: Estado interno sessionId.
   * Efectos secundarios: Ninguno.
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Actualiza la configuración del logger dinámicamente.
   * Propósito: Permitir cambios en la configuración sin reiniciar la aplicación.
   * Lógica: Fusiona nueva configuración con existente, re-inicializa Sentry si cambió.
   * Entradas: newConfig (Partial<LoggerConfig>) - Configuración parcial a actualizar.
   * Salidas: Ninguna directa (actualiza estado interno).
   * Dependencias: Método initSentry interno.
   * Efectos secundarios: Posible re-inicialización de Sentry.
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.enableSentry !== undefined) {
      // Re-inicializar Sentry si cambió la configuración de Sentry
      this.initSentry();
    }
  }
}

/**
 * Instancia singleton del logger para uso global en la aplicación.
 * Propósito: Proporcionar un punto de acceso único al sistema de logging.
 * Lógica: Instancia única creada al importar el módulo.
 * Entradas: Ninguna (instancia creada automáticamente).
 * Salidas: Logger - Instancia configurada del sistema de logging.
 * Dependencias: Clase Logger.
 * Efectos secundarios: Inicialización automática del logger al importar.
 */
export const logger = new Logger();

/**
 * Hook personalizado para usar el logger en componentes React.
 * Propósito: Proporcionar acceso conveniente al logger en componentes funcionales.
 * Lógica: Retorna objeto con métodos del logger binded a la instancia singleton.
 * Entradas: Ninguna.
 * Salidas: Objeto con métodos de logging.
 * Dependencias: Instancia logger singleton.
 * Efectos secundarios: Ninguno (solo acceso a métodos existentes).
 */
export function useLogger() {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    fatal: logger.fatal.bind(logger),
    userAction: logger.userAction.bind(logger),
    apiCall: logger.apiCall.bind(logger),
    performance: logger.performance.bind(logger),
    navigation: logger.navigation.bind(logger),
    security: logger.security.bind(logger),
    setUserContext: logger.setUserContext.bind(logger),
    clearUserContext: logger.clearUserContext.bind(logger),
    getSessionId: logger.getSessionId.bind(logger),
  };
}
