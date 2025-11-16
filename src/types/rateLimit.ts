/**
 * Comprehensive Rate Limiting Types and Interfaces
 * Provides type definitions for client-side rate limiting, circuit breaker,
 * exponential backoff, and request deduplication patterns.
 */

export const RateLimitCategory = {
  API: 'api',
  AUTH: 'auth',
  USER_INTERACTION: 'user_interaction',
  SEARCH: 'search',
  CART: 'cart',
  WISHLIST: 'wishlist',
  FORM_SUBMISSION: 'form_submission',
  FILE_UPLOAD: 'file_upload',
  CUSTOM: 'custom',
} as const;

export type RateLimitCategory =
  (typeof RateLimitCategory)[keyof typeof RateLimitCategory];

export interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
  retryAfter: number; // in milliseconds
  category: RateLimitCategory;
  enabled: boolean;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number; // in milliseconds
  monitoringPeriod: number; // in milliseconds
  successThreshold: number;
}

export interface ExponentialBackoffConfig {
  initialDelay: number; // in milliseconds
  maxDelay: number; // in milliseconds
  multiplier: number;
  maxRetries: number;
  jitter: boolean;
}

export interface RequestDeduplicationConfig {
  enabled: boolean;
  cacheTime: number; // in milliseconds
  keyGenerator?: (request: unknown) => string;
}

export interface RateLimitState {
  requests: number[];
  lastReset: number;
  isBlocked: boolean;
  blockUntil?: number;
}

export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime?: number;
  successes: number;
  nextAttemptTime?: number;
}

export interface BackoffState {
  attempt: number;
  lastAttemptTime?: number;
  nextAttemptTime?: number;
}

export interface DeduplicationCache {
  [key: string]: {
    promise: Promise<unknown>;
    timestamp: number;
  };
}

export interface RateLimitMetrics {
  totalRequests: number;
  blockedRequests: number;
  successfulRequests: number;
  averageResponseTime: number;
  lastRequestTime?: number;
  category: RateLimitCategory;
}

export class RateLimitError extends Error {
  category: RateLimitCategory;
  retryAfter?: number;
  isCircuitBreaker?: boolean;
  isRateLimited?: boolean;

  constructor(
    message: string,
    category: RateLimitCategory,
    retryAfter?: number,
    isCircuitBreaker?: boolean,
    isRateLimited?: boolean
  ) {
    super(message);
    this.name = 'RateLimitError';
    this.category = category;
    this.retryAfter = retryAfter;
    this.isCircuitBreaker = isCircuitBreaker;
    this.isRateLimited = isRateLimited;
  }
}

export interface EnvironmentRateLimits {
  development: Partial<Record<RateLimitCategory, RateLimitConfig>>;
  staging: Partial<Record<RateLimitCategory, RateLimitConfig>>;
  production: Partial<Record<RateLimitCategory, RateLimitConfig>>;
}

export interface RateLimitManagerConfig {
  defaultConfig: RateLimitConfig;
  circuitBreaker: CircuitBreakerConfig;
  backoff: ExponentialBackoffConfig;
  deduplication: RequestDeduplicationConfig;
  environmentLimits: EnvironmentRateLimits;
  monitoring: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    metricsInterval: number; // in milliseconds
  };
}

export interface RateLimitHookOptions {
  category: RateLimitCategory;
  customConfig?: Partial<RateLimitConfig>;
  onBlocked?: (error: RateLimitError) => void;
  onRetry?: (attempt: number, delay: number) => void;
  onSuccess?: () => void;
  onFailure?: (error: unknown) => void;
}

export interface RateLimitHookReturn {
  isBlocked: boolean;
  remainingRequests: number;
  resetTime: number;
  execute: <T>(fn: () => Promise<T>) => Promise<T>;
  reset: () => void;
  getMetrics: () => RateLimitMetrics;
}
