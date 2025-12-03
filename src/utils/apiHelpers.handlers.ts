import { AxiosError } from 'axios';
import transformApiError from './transformApiError';

export const isHtmlResponse = (value: unknown) =>
  typeof value === 'string' && value.trim().startsWith('<');

export const handleRateLimitRetry = async <T>(
  error: AxiosError,
  notify: (args: { type: 'warning'; title: string; message: string }) => void,
  retry: () => Promise<T>,
  delayMs: (ms: number) => Promise<unknown>
) => {
  notify({
    type: 'warning',
    title: 'Demasiadas solicitudes',
    message: 'Por favor, espera un momento antes de intentar nuevamente.',
  });
  const retryAfter =
    Number(error.response?.headers['retry-after']) * 1000 || 5000;
  await delayMs(retryAfter);
  return retry();
};

export const handleAuthError = (error: any) => {
  if (error?.response?.status === 401) {
    window.dispatchEvent(new Event('auth:logout'));
  }
  return Promise.reject(transformApiError(error));
};
