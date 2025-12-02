import axios, { AxiosRequestConfig } from 'axios';
import { useNotifications } from '../contexts/NotificationContext';
import transformApiError from './transformApiError';
import {
  sanitizeRequestMiddleware,
  sanitizeResponseMiddleware,
} from './sanitizationMiddleware';
import RateLimiter, { RateLimitConfig } from './rateLimiter';
import {
  buildLimiter,
  buildRequestConfig,
  handleAuthError,
  handleRateLimitRetry,
  isRateLimitError,
  sendRequest,
} from './apiHelpers';

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

export const useApi = () => {
  const { showNotification } = useNotifications();

  const makeRequest = async <T>(
    config: AxiosRequestConfig,
    rateLimitConfig?: Partial<RateLimitConfig>
  ): Promise<T> => {
    const limiter = buildLimiter(rateLimitConfig, rateLimiter) ?? rateLimiter;

    const execute = () => makeRequest<T>(config, rateLimitConfig);

    try {
      return await sendRequest<T>(api, config, limiter);
    } catch (error) {
      if (isRateLimitError(error)) {
        return handleRateLimitRetry(error, showNotification, execute);
      }
      throw transformApiError(error);
    }
  };

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildRequestConfig(url, 'GET', undefined, config)),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildRequestConfig(url, 'POST', data, config)),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildRequestConfig(url, 'PUT', data, config)),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildRequestConfig(url, 'PATCH', data, config)),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>(buildRequestConfig(url, 'DELETE', undefined, config)),
  };
};

api.interceptors.response.use(
  (response) => response,
  (error) => handleAuthError(error)
);
