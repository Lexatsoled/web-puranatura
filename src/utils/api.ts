import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useNotifications } from '../contexts/NotificationContext';
import transformApiError from './transformApiError';
import {
  sanitizeRequestMiddleware,
  sanitizeResponseMiddleware,
} from './sanitizationMiddleware';
import RateLimiter, { RateLimitConfig } from './rateLimiter';

const apiBaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Añadir middleware de sanitización
api.interceptors.request.use(sanitizeRequestMiddleware);
api.interceptors.response.use(sanitizeResponseMiddleware);

// RateLimiter se exporta desde src/utils/rateLimiter.ts — lo importamos

// Instancia global del rate limiter (usar implementación centralizada)
const rateLimiter = new RateLimiter();

// Hook personalizado para hacer peticiones a la API
export const useApi = () => {
  const { showNotification } = useNotifications();

  const makeRequest = async <T>(
    config: AxiosRequestConfig,
    rateLimitConfig?: Partial<RateLimitConfig>
  ): Promise<T> => {
    const limiter = rateLimitConfig
      ? new RateLimiter(rateLimitConfig)
      : rateLimiter;

    try {
      // Esperar si es necesario por el rate limiting
      await limiter.waitForSlot();

      const response = await api(config);
      // Detect accidental HTML responses (e.g., when preview serves index.html
      // for unknown /api routes) and treat them as errors so the caller falls
      // back to legacy data instead of attempting to .map() a string.
      if (
        response &&
        response.data &&
        typeof response.data === 'string' &&
        response.data.trim().startsWith('<')
      ) {
        throw new Error('Unexpected HTML response from API');
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        showNotification({
          type: 'warning',
          title: 'Demasiadas solicitudes',
          message: 'Por favor, espera un momento antes de intentar nuevamente.',
        });

        // Esperar el tiempo indicado y reintentar
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            Number(error.response?.headers['retry-after']) * 1000 || 5000
          )
        );
        return makeRequest(config, rateLimitConfig);
      }

      throw transformApiError(error);
    }
  };

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'PUT', url, data }),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'PATCH', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'DELETE', url }),
  };
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);
