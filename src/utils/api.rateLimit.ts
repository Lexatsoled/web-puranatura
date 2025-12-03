import RateLimiter, { RateLimitConfig } from './rateLimiter';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  buildLimiter,
  isRateLimitError,
  delay,
  sendRequest,
} from './apiHelpers';
import { handleRateLimitRetry } from './apiHelpers.handlers';
import transformApiError from './transformApiError';
import { NotificationsHook } from './api.types';

export const createRateLimitedRequester = (
  api: AxiosInstance,
  rateLimiter: RateLimiter,
  showNotification: NotificationsHook['showNotification']
) => {
  const makeRequest = async <T>(
    config: AxiosRequestConfig,
    rateLimitConfig?: Partial<RateLimitConfig>
  ): Promise<T> => {
    const limiter = buildLimiter(rateLimitConfig, rateLimiter) ?? rateLimiter;
    const execute = () => makeRequest<T>(config, rateLimitConfig);

    try {
      const response = await sendRequest<T>(api, config, limiter);
      return response;
    } catch (error) {
      if (isRateLimitError(error)) {
        return handleRateLimitRetry(error, showNotification, execute, delay);
      }
      throw transformApiError(error);
    }
  };

  return { makeRequest };
};
