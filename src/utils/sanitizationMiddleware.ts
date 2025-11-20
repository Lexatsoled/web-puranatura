import { InternalAxiosRequestConfig } from 'axios';
import { sanitizeObject } from './sanitizer';

/**
 * Middleware para sanitizar automáticamente las peticiones a la API
 */
export const sanitizeRequestMiddleware = (
  config: InternalAxiosRequestConfig
) => {
  if (config.data && typeof config.data === 'object') {
    config.data = sanitizeObject(config.data);
  }

  if (config.params && typeof config.params === 'object') {
    config.params = sanitizeObject(config.params);
  }

  return config;
};

/**
 * Middleware para sanitizar automáticamente las respuestas de la API
 */
export const sanitizeResponseMiddleware = (response: any) => {
  if (response.data) {
    if (Array.isArray(response.data)) {
      response.data = response.data.map((item: any) =>
        item && typeof item === 'object' ? sanitizeObject(item) : item
      );
    } else if (typeof response.data === 'object') {
      response.data = sanitizeObject(response.data);
    }
  }
  return response;
};
