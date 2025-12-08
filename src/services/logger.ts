import axios from 'axios';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp?: string;
}

const sendLog = async (entry: LogEntry) => {
  try {
    // Only send logs to backend if not in dev mode, or if strictly configured.
    // For now, we allow sending if explicitly enabled or if in production.
    const shouldSend =
      import.meta.env.PROD ||
      import.meta.env.VITE_ENABLE_REMOTE_LOGGING === 'true';

    if (shouldSend) {
      await axios.post('/api/logs', entry);
    }
  } catch (err) {
    // Fail silently to avoid infinite loops if logging fails
    console.error('Failed to send remote log:', err);
  }
};

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    console.log(message, context);
    sendLog({
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(message, context);
    sendLog({
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  },
  error: (message: string, context?: Record<string, any>) => {
    console.error(message, context);
    sendLog({
      level: 'error',
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  },
};
