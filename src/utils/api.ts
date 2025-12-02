import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useNotifications } from '../contexts/NotificationContext';
import transformApiError from './transformApiError';
import {
  sanitizeRequestMiddleware,
  sanitizeResponseMiddleware,
} from './sanitizationMiddleware';
import RateLimiter, { RateLimitConfig } from './rateLimiter';

const API_TIMEOUT_MS = 10000;
const apiBaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(sanitizeRequestMiddleware);
api.interceptors.response.use(sanitizeResponseMiddleware);

const rateLimiter = new RateLimiter();

const isHtmlResponse = (value: unknown) =>
  typeof value === 'string' && value.trim().startsWith('<');

const buildConfig = (
  url: string,
  method: AxiosRequestConfig['method'],
  data?: any,
  config?: AxiosRequestConfig
) => ({ ...config, method, url, data });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleRateLimit = async (
  error: AxiosError,
  config: AxiosRequestConfig,
  rateLimitConfig: Partial<RateLimitConfig> | undefined,
  showNotification: ReturnType<typeof useNotifications>['showNotification'],
  retry: () => Promise<unknown>
) => {
  showNotification({
    type: 'warning',
    title: 'Demasiadas solicitudes',
    message: 'Por favor, espera un momento antes de intentar nuevamente.',
  });

  const retryAfter =
    Number(error.response?.headers['retry-after']) * 1000 || 5000;
  await delay(retryAfter);
  return retry();
};

const sendRequest = async <T>(
  config: AxiosRequestConfig,
  limiter: RateLimiter
): Promise<T> => {
  await limiter.waitForSlot();
  const response = await api(config);
  if (isHtmlResponse(response.data)) {
    throw new Error('Unexpected HTML response from API');
  }
  return response.data;
};

const isRateLimitError = (error: unknown): error is AxiosError =>
  error instanceof AxiosError && error.response?.status === 429;

export const useApi = () => {
  const { showNotification } = useNotifications();

  const makeRequest = async <T>(
    config: AxiosRequestConfig,
    rateLimitConfig?: Partial<RateLimitConfig>
  ): Promise<T> => {
    const limiter = rateLimitConfig
      ? new RateLimiter(rateLimitConfig)
      : rateLimiter;

    const execute = () => makeRequest<T>(config, rateLimitConfig);

    try {
      return await sendRequest<T>(config, limiter);
    } catch (error) {
      if (isRateLimitError(error)) {
        return handleRateLimit(
          error,
          config,
          rateLimitConfig,
          showNotification,
          execute
        );
      }
      throw transformApiError(error);
    }
  };

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildConfig(url, 'GET', undefined, config)),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildConfig(url, 'POST', data, config)),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildConfig(url, 'PUT', data, config)),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildConfig(url, 'PATCH', data, config)),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildConfig(url, 'DELETE', undefined, config)),
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
