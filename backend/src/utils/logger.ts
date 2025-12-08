/* Lightweight logger with named exports to satisfy TypeScript imports.
	 Avoids default-export interop issues by providing a named `logger` object
	 which contains the typical logging methods used across the backend. */

export const logger = {
  info: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.log(...args);
    } catch {
      // Intentionally silent to prevent logger from throwing
    }
  },
  warn: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.warn(...args);
    } catch {
      // Intentionally silent to prevent logger from throwing
    }
  },
  error: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.error(...args);
    } catch {
      // Intentionally silent to prevent logger from throwing
    }
  },
  debug: (...args: unknown[]): void => {
    try {
      // eslint-disable-next-line no-console
      console.debug(...args);
    } catch {
      // Intentionally silent to prevent logger from throwing
    }
  },
};

export type Logger = typeof logger;
