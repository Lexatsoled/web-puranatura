/* Lightweight logger with named exports to satisfy TypeScript imports.
	 Avoids default-export interop issues by providing a named `logger` object
	 which contains the typical logging methods used across the backend. */

export const logger = {
  info: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.log(...args);
    } catch (e) {
      void e;
    }
  },
  warn: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.warn(...args);
    } catch (e) {
      void e;
    }
  },
  error: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.error(...args);
    } catch (e) {
      void e;
    }
  },
  debug: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.debug(...args);
    } catch (e) {
      void e;
    }
  },
};

export type Logger = typeof logger;
