/**
 * Comprehensive Rate Limiting Utilities
 * Implements circuit breaker, exponential backoff, request deduplication,
 * and advanced rate limiting patterns for client-side applications.
 */

import {
  RateLimitConfig,
  CircuitBreakerConfig,
  ExponentialBackoffConfig,
  RequestDeduplicationConfig,
  RateLimitState,
  CircuitBreakerState,
  BackoffState,
  DeduplicationCache,
  RateLimitMetrics,
  RateLimitError,
  RateLimitCategory,
  RateLimitManagerConfig,
  EnvironmentRateLimits,
} from '@/types/rateLimit';

// Default configurations
const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 60,
  timeWindow: 60000, // 1 minute
  retryAfter: 1000,
  category: 'api',
  enabled: true,
};

const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeout: 30000, // 30 seconds
  monitoringPeriod: 60000, // 1 minute
  successThreshold: 3,
};

const DEFAULT_BACKOFF_CONFIG: ExponentialBackoffConfig = {
  initialDelay: 1000,
  maxDelay: 30000,
  multiplier: 2,
  maxRetries: 5,
  jitter: true,
};

const DEFAULT_DEDUPLICATION_CONFIG: RequestDeduplicationConfig = {
  enabled: true,
  cacheTime: 30000, // 30 seconds
  keyGenerator: (request: unknown) => JSON.stringify(request),
};

// Environment-specific rate limits
const ENVIRONMENT_LIMITS: EnvironmentRateLimits = {
  development: {
    api: {
      maxRequests: 100,
      timeWindow: 60000,
      retryAfter: 500,
      category: 'api',
      enabled: false,
    },
    auth: {
      maxRequests: 10,
      timeWindow: 60000,
      retryAfter: 1000,
      category: 'auth',
      enabled: false,
    },
    user_interaction: {
      maxRequests: 50,
      timeWindow: 10000,
      retryAfter: 200,
      category: 'user_interaction',
      enabled: false,
    },
  },
  staging: {
    api: {
      maxRequests: 30,
      timeWindow: 60000,
      retryAfter: 2000,
      category: 'api',
      enabled: true,
    },
    auth: {
      maxRequests: 5,
      timeWindow: 300000,
      retryAfter: 30000,
      category: 'auth',
      enabled: true,
    },
    user_interaction: {
      maxRequests: 20,
      timeWindow: 10000,
      retryAfter: 500,
      category: 'user_interaction',
      enabled: true,
    },
  },
  production: {
    api: {
      maxRequests: 20,
      timeWindow: 60000,
      retryAfter: 5000,
      category: 'api',
      enabled: true,
    },
    auth: {
      maxRequests: 3,
      timeWindow: 900000,
      retryAfter: 60000,
      category: 'auth',
      enabled: true,
    },
    user_interaction: {
      maxRequests: 10,
      timeWindow: 10000,
      retryAfter: 1000,
      category: 'user_interaction',
      enabled: true,
    },
  },
};

/**
 * Circuit Breaker Implementation
 */
export class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CIRCUIT_BREAKER_CONFIG, ...config };
    this.state = {
      state: 'closed',
      failures: 0,
      successes: 0,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state.state = 'half-open';
      } else {
        throw createRateLimitError(
          'Circuit breaker is open',
          'api',
          undefined,
          true
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return this.state.nextAttemptTime
      ? Date.now() >= this.state.nextAttemptTime
      : false;
  }

  private onSuccess(): void {
    this.state.failures = 0;
    this.state.successes++;

    if (
      this.state.state === 'half-open' &&
      this.state.successes >= this.config.successThreshold
    ) {
      this.state.state = 'closed';
      this.state.successes = 0;
    }
  }

  private onFailure(): void {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();

    if (this.state.failures >= this.config.failureThreshold) {
      this.state.state = 'open';
      this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      state: 'closed',
      failures: 0,
      successes: 0,
    };
  }
}

/**
 * Exponential Backoff Implementation
 */
export class ExponentialBackoff {
  private config: ExponentialBackoffConfig;
  private state: BackoffState;

  constructor(config: Partial<ExponentialBackoffConfig> = {}) {
    this.config = { ...DEFAULT_BACKOFF_CONFIG, ...config };
    this.state = {
      attempt: 0,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.reset();

    while (this.state.attempt < this.config.maxRetries) {
      try {
        const result = await operation();
        this.reset();
        return result;
      } catch (error) {
        this.state.attempt++;
        this.state.lastAttemptTime = Date.now();

        if (this.state.attempt >= this.config.maxRetries) {
          throw error;
        }

        const delay = this.calculateDelay();
        this.state.nextAttemptTime = Date.now() + delay;

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw createRateLimitError('Max retries exceeded', 'api');
  }

  private calculateDelay(): number {
    const baseDelay =
      this.config.initialDelay *
      Math.pow(this.config.multiplier, this.state.attempt - 1);
    const delay = Math.min(baseDelay, this.config.maxDelay);

    if (this.config.jitter) {
      // Add random jitter to prevent thundering herd
      return delay * (0.5 + Math.random() * 0.5);
    }

    return delay;
  }

  reset(): void {
    this.state = { attempt: 0 };
  }

  getState(): BackoffState {
    return { ...this.state };
  }
}

/**
 * Request Deduplication Implementation
 */
export class RequestDeduplicator {
  private cache: DeduplicationCache = {};
  private config: RequestDeduplicationConfig;

  constructor(config: Partial<RequestDeduplicationConfig> = {}) {
    this.config = { ...DEFAULT_DEDUPLICATION_CONFIG, ...config };
  }

  async deduplicate<T>(key: string, operation: () => Promise<T>): Promise<T> {
    if (!this.config.enabled) {
      return operation();
    }

    const now = Date.now();

    // Clean expired entries
    this.cleanExpiredEntries(now);

    // Check if request is already in progress
    if (
      this.cache[key] &&
      this.cache[key].timestamp + this.config.cacheTime > now
    ) {
      return this.cache[key].promise as Promise<T>;
    }

    // Create new request
    const promise = operation();
    this.cache[key] = {
      promise,
      timestamp: now,
    };

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up after completion
      delete this.cache[key];
    }
  }

  private cleanExpiredEntries(now: number): void {
    Object.keys(this.cache).forEach((key) => {
      if (this.cache[key].timestamp + this.config.cacheTime <= now) {
        delete this.cache[key];
      }
    });
  }

  clear(): void {
    this.cache = {};
  }

  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }
}

/**
 * Enhanced Rate Limiter with Circuit Breaker and Backoff
 */
export class EnhancedRateLimiter {
  private rateLimitState: RateLimitState;
  private circuitBreaker: CircuitBreaker;
  private backoff: ExponentialBackoff;
  private deduplicator: RequestDeduplicator;
  private config: RateLimitConfig;
  private metrics: RateLimitMetrics;

  constructor(
    config: Partial<RateLimitConfig> = {},
    circuitBreakerConfig?: Partial<CircuitBreakerConfig>,
    backoffConfig?: Partial<ExponentialBackoffConfig>,
    deduplicationConfig?: Partial<RequestDeduplicationConfig>
  ) {
    this.config = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config };
    this.rateLimitState = {
      requests: [],
      lastReset: Date.now(),
      isBlocked: false,
    };
    this.circuitBreaker = new CircuitBreaker(circuitBreakerConfig);
    this.backoff = new ExponentialBackoff(backoffConfig);
    this.deduplicator = new RequestDeduplicator(deduplicationConfig);
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      successfulRequests: 0,
      averageResponseTime: 0,
      category: this.config.category,
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    deduplicationKey?: string
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // Check rate limit
      if (!this.checkRateLimit()) {
        this.metrics.blockedRequests++;
        throw createRateLimitError(
          `Rate limit exceeded for ${this.config.category}`,
          this.config.category,
          this.getResetTime()
        );
      }

      // Execute with circuit breaker and backoff
      const result = await this.circuitBreaker.execute(() =>
        this.backoff.execute(() =>
          deduplicationKey
            ? this.deduplicator.deduplicate(deduplicationKey, operation)
            : operation()
        )
      );

      // Record success
      this.recordRequest();
      this.metrics.successfulRequests++;
      this.updateResponseTime(Date.now() - startTime);

      return result;
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      // Record failure but don't throw rate limit error
      throw error;
    }
  }

  private checkRateLimit(): boolean {
    if (!this.config.enabled) return true;

    const now = Date.now();

    // Reset window if needed
    if (now - this.rateLimitState.lastReset >= this.config.timeWindow) {
      this.rateLimitState.requests = [];
      this.rateLimitState.lastReset = now;
      this.rateLimitState.isBlocked = false;
    }

    // Check if still blocked
    if (
      this.rateLimitState.isBlocked &&
      this.rateLimitState.blockUntil &&
      now < this.rateLimitState.blockUntil
    ) {
      return false;
    }

    // Check request count
    if (this.rateLimitState.requests.length >= this.config.maxRequests) {
      this.rateLimitState.isBlocked = true;
      this.rateLimitState.blockUntil = now + this.config.retryAfter;
      return false;
    }

    return true;
  }

  private recordRequest(): void {
    const now = Date.now();
    this.rateLimitState.requests.push(now);
    this.metrics.lastRequestTime = now;
  }

  private getResetTime(): number {
    return this.rateLimitState.lastReset + this.config.timeWindow;
  }

  private updateResponseTime(responseTime: number): void {
    // Simple moving average
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime + responseTime) / 2;
  }

  getMetrics(): RateLimitMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.rateLimitState = {
      requests: [],
      lastReset: Date.now(),
      isBlocked: false,
    };
    this.circuitBreaker.reset();
    this.backoff.reset();
    this.deduplicator.clear();
  }

  isBlocked(): boolean {
    return this.rateLimitState.isBlocked;
  }

  getRemainingRequests(): number {
    return Math.max(
      0,
      this.config.maxRequests - this.rateLimitState.requests.length
    );
  }
}

/**
 * Rate Limit Manager - Central coordinator
 */
export class RateLimitManager {
  private limiters: Map<RateLimitCategory, EnhancedRateLimiter> = new Map();
  private config: RateLimitManagerConfig;

  constructor(config: Partial<RateLimitManagerConfig> = {}) {
    this.config = {
      defaultConfig: DEFAULT_RATE_LIMIT_CONFIG,
      circuitBreaker: DEFAULT_CIRCUIT_BREAKER_CONFIG,
      backoff: DEFAULT_BACKOFF_CONFIG,
      deduplication: DEFAULT_DEDUPLICATION_CONFIG,
      environmentLimits: ENVIRONMENT_LIMITS,
      monitoring: {
        enabled: true,
        logLevel: 'warn',
        metricsInterval: 30000,
      },
      ...config,
    };

    this.initializeLimiters();
  }

  private initializeLimiters(): void {
    const env = this.getCurrentEnvironment();
    const envLimits = this.config.environmentLimits[env] || {};

    // Initialize limiters for all categories
    Object.values(RateLimitCategory).forEach((category) => {
      const envConfig = envLimits[category as RateLimitCategory];
      const limiterConfig = envConfig || this.config.defaultConfig;

      this.limiters.set(
        category,
        new EnhancedRateLimiter(
          { ...limiterConfig, category },
          this.config.circuitBreaker,
          this.config.backoff,
          this.config.deduplication
        )
      );
    });
  }

  private getCurrentEnvironment(): keyof EnvironmentRateLimits {
    if (typeof window === 'undefined') return 'development';

    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    }
    if (hostname.includes('staging') || hostname.includes('dev')) {
      return 'staging';
    }
    return 'production';
  }

  async execute<T>(
    category: RateLimitCategory,
    operation: () => Promise<T>,
    deduplicationKey?: string
  ): Promise<T> {
    const limiter = this.limiters.get(category);
    if (!limiter) {
      throw new Error(`No rate limiter configured for category: ${category}`);
    }

    return limiter.execute(operation, deduplicationKey);
  }

  getLimiter(category: RateLimitCategory): EnhancedRateLimiter | undefined {
    return this.limiters.get(category);
  }

  getMetrics(category?: RateLimitCategory): RateLimitMetrics[] {
    if (category) {
      const limiter = this.limiters.get(category);
      return limiter ? [limiter.getMetrics()] : [];
    }

    return Array.from(this.limiters.values()).map((limiter) =>
      limiter.getMetrics()
    );
  }

  reset(category?: RateLimitCategory): void {
    if (category) {
      const limiter = this.limiters.get(category);
      limiter?.reset();
    } else {
      this.limiters.forEach((limiter) => limiter.reset());
    }
  }
}

// Global instance
export const rateLimitManager = new RateLimitManager();

// Utility functions
export const createRateLimitError = (
  message: string,
  category: RateLimitCategory,
  retryAfter?: number,
  isCircuitBreaker = false,
  isRateLimited = true
): RateLimitError => {
  const error = new Error(message) as RateLimitError;
  error.category = category;
  error.retryAfter = retryAfter;
  error.isCircuitBreaker = isCircuitBreaker;
  error.isRateLimited = isRateLimited;
  return error;
};

export const getEnvironmentLimits = (): EnvironmentRateLimits => {
  return ENVIRONMENT_LIMITS;
};

export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return Boolean(error && typeof error === 'object' && 'category' in error);
};
