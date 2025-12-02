import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import RateLimiter, { RateLimitConfig } from './rateLimiter';

export const isHtmlResponse = (value: unknown) =>
  typeof value === 'string' && value.trim().startsWith('<');

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

export const handleRateLimitRetry = async <T>(
  error: AxiosError,
  notify: (args: { type: 'warning'; title: string; message: string }) => void,
  retry: () => Promise<T>
) => {
  notify({
    type: 'warning',
    title: 'Demasiadas solicitudes',
    message: 'Por favor, espera un momento antes de intentar nuevamente.',
  });
  const retryAfter =
    Number(error.response?.headers['retry-after']) * 1000 || 5000;
  await delay(retryAfter);
  return retry();
};

export const handleAuthError = (error: any) => {
  if (error?.response?.status === 401) {
    window.dispatchEvent(new Event('auth:logout'));
  }
  return Promise.reject(error);
};
