import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import RateLimiter, { RateLimitConfig } from './rateLimiter';
import {
  isHtmlResponse,
  handleRateLimitRetry,
  handleAuthError,
} from './apiHelpers.handlers';
import transformApiError from './transformApiError';

export const isRateLimitError = (error: unknown): error is AxiosError =>
  error instanceof AxiosError && error.response?.status === 429;

export const buildLimiter = (
  rateLimitConfig?: Partial<RateLimitConfig>,
  fallback?: RateLimiter
) => (rateLimitConfig ? new RateLimiter(rateLimitConfig) : fallback);

export const buildRequestConfig = (
  url: string,
  method: AxiosRequestConfig['method'],
  data?: any,
  config?: AxiosRequestConfig
) => ({ ...config, method, url, data });

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const sendRequest = async <T>(
  api: AxiosInstance,
  config: AxiosRequestConfig,
  limiter: RateLimiter
): Promise<T> => {
  await limiter.waitForSlot();
  const response = await api(config);
  if (isHtmlResponse(response.data)) {
    throw new Error('Unexpected HTML response from API');
  }
  return response.data as T;
};

export { handleRateLimitRetry, handleAuthError, transformApiError };
