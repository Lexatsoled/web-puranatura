import { AxiosRequestConfig } from 'axios';
import { useNotifications } from '../contexts/NotificationContext';
import { api } from './api.client';
import { buildRequestConfig, handleAuthError } from './apiHelpers';
import { createRateLimitedRequester } from './api.rateLimit';
import RateLimiter from './rateLimiter';
import { Method } from './api.types';

const rateLimiter = new RateLimiter();

const makeRequestByMethod =
  (makeRequest: <T>(config: AxiosRequestConfig) => Promise<T>) =>
  <T>(method: Method, url: string, data?: any, config?: AxiosRequestConfig) =>
    makeRequest<T>(buildRequestConfig(url, method, data, config));

export const useApi = () => {
  const { showNotification } = useNotifications();
  const { makeRequest } = createRateLimitedRequester(
    api,
    rateLimiter,
    showNotification
  );
  const withMethod = makeRequestByMethod(makeRequest);

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      withMethod<T>('GET', url, undefined, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      withMethod<T>('POST', url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      withMethod<T>('PUT', url, data, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      withMethod<T>('PATCH', url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      withMethod<T>('DELETE', url, undefined, config),
  };
};

api.interceptors.response.use(
  (response) => response,
  (error) => handleAuthError(error)
);
