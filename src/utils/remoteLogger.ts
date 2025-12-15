type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp?: string;
}

const API_LOGS_URL = '/api/logs';

class RemoteLogger {
  private static instance: RemoteLogger;
  private isDev = import.meta.env.DEV;

  private constructor() {}

  public static getInstance(): RemoteLogger {
    if (!RemoteLogger.instance) {
      RemoteLogger.instance = new RemoteLogger();
    }
    return RemoteLogger.instance;
  }

  public async log(level: LogLevel, message: string, context?: any) {
    // Always log to console in dev or if it's an error
    if (this.isDev || level === 'error') {
      const consoleMethod =
        level === 'warn'
          ? console.warn
          : level === 'error'
            ? console.error
            : console.info;
      consoleMethod(`[RemoteLogger] ${message}`, context);
    }

    if (this.isDev) return; // Optional: Skip remote logging in dev to avoid noise

    const payload: LogPayload = {
      level,
      message,
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      // Use sendBeacon for reliability during unload, fallback to fetch
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      });

      const success = navigator.sendBeacon(API_LOGS_URL, blob);

      if (!success) {
        // Fallback to fetch if sendBeacon fails (e.g. payload too large)
        await fetch(API_LOGS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch (err) {
      // Fail silently to avoid infinite error loops
      console.error('Failed to send remote log:', err);
    }
  }

  public info(message: string, context?: any) {
    this.log('info', message, context);
  }

  public warn(message: string, context?: any) {
    this.log('warn', message, context);
  }

  public error(message: string, context?: any) {
    this.log('error', message, context);
  }
}

export const remoteLogger = RemoteLogger.getInstance();
