import { env } from '../config/env';

export const logger = {
  info: (msg: unknown, meta?: Record<string, unknown>): void => {
    try {
      const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
      // If your ESLint disallows console, replace these with your logger
      // eslint-disable-next-line no-console
      console.log('INFO', message, meta ?? '');
    } catch (e) {
      void e;
    }
  },

  error: (msg: unknown, meta?: Record<string, unknown>): void => {
    try {
      const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
      // eslint-disable-next-line no-console
      console.error('ERROR', message, meta ?? '');
    } catch (e) {
      void e;
    }
  },

  warn: (msg: unknown, meta?: Record<string, unknown>): void => {
    try {
      const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
      // eslint-disable-next-line no-console
      console.warn('WARN', message, meta ?? '');
    } catch (e) {
      void e;
    }
  },
};

// Keep a lightweight env reference in case other parts expect it.
export const NODE_ENV = env.nodeEnv;
