import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { sanitizeFormValues, sanitizeObject, sanitizeText } from './sanitizer';

export const sanitizeRequestMiddleware = <T extends InternalAxiosRequestConfig>(config: T): T => {
  if (config.data && typeof config.data === 'object') {
    config.data = sanitizeObject(config.data);
  }

  if (config.params && typeof config.params === 'object') {
    config.params = sanitizeObject(config.params);
  }

  if (config.headers) {
    const sensitiveHeaders = ['x-api-key', 'x-client-id', 'x-correlation-id'];
    sensitiveHeaders.forEach((header) => {
      const value = config.headers?.[header];
      if (typeof value === 'string') {
        config.headers[header] = sanitizeText(value);
      }
    });
  }

  return config;
};

export const sanitizeResponseMiddleware = <T extends AxiosResponse>(response: T): T => {
  if (response.data && typeof response.data === 'object') {
    response.data = sanitizeObject(response.data as Record<string, unknown>);
  }
  return response;
};

export const sanitizeErrorMiddleware = (error: AxiosError) => {
  if (!error) return Promise.reject(error);
  if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
    const message = (error.response.data as { message?: string }).message;
    if (typeof message === 'string') {
      (error.response.data as { message?: string }).message = sanitizeText(message);
    }
  }
  if (error.message) {
    error.message = sanitizeText(error.message);
  }
  return Promise.reject(error);
};

export const setupAxiosSanitization = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use((config) => sanitizeRequestMiddleware(config));
  axiosInstance.interceptors.response.use(
    (response) => sanitizeResponseMiddleware(response),
    sanitizeErrorMiddleware,
  );
  return axiosInstance;
};

export const sanitizeFormData = <T>(formData: T): T => sanitizeFormValues(formData);
