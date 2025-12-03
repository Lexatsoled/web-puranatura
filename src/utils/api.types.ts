import { AxiosRequestConfig } from 'axios';
import { RateLimitConfig } from './rateLimiter';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type NotificationsHook = {
  showNotification: (input: any) => void;
};

export type RequestBuilder = {
  makeRequest: <T>(
    config: AxiosRequestConfig,
    rateLimitConfig?: Partial<RateLimitConfig>
  ) => Promise<T>;
};
