import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useNotifications } from '../contexts/NotificationContext';
import { transformApiError } from './errorHandler';
import {
  sanitizeRequestMiddleware,
  sanitizeResponseMiddleware,
} from './sanitizationMiddleware';

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

// Configuración de rate limiting
interface RateLimitConfig {
  maxRequests: number; // Número máximo de solicitudes
  timeWindow: number; // Ventana de tiempo en milisegundos
  retryAfter: number; // Tiempo de espera antes de reintentar en milisegundos
}

const defaultRateLimitConfig: RateLimitConfig = {
  maxRequests: 60, // 60 solicitudes
  timeWindow: 60000, // por minuto
  retryAfter: 1000, // esperar 1 segundo antes de reintentar
};

// Clase para manejar el rate limiting
class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...defaultRateLimitConfig, ...config };
  }

  async checkRateLimit(): Promise<boolean> {
    const now = Date.now();

    // Limpiar solicitudes antiguas
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.config.timeWindow
    );

    // Verificar si excedemos el límite
    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }

    // Registrar nueva solicitud
    this.requests.push(now);
    return true;
  }

  async waitForSlot(): Promise<void> {
    while (!(await this.checkRateLimit())) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.retryAfter)
      );
    }
  }
}

// Instancia global del rate limiter
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
