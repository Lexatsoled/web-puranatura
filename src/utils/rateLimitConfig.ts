/**
 * Rate Limiting Configuration Utilities
 * Environment-specific configurations and utilities for managing rate limits.
 */

import {
  RateLimitManagerConfig,
  EnvironmentRateLimits,
  RateLimitConfig,
} from '@/types/rateLimit';

// Environment detection
export const getCurrentEnvironment = (): keyof EnvironmentRateLimits => {
  if (typeof window === 'undefined') return 'development';

  const hostname = window.location.hostname;
  const href = window.location.href;

  // Check for development
  if (
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('0.0.0.0') ||
    href.includes(':3000') ||
    href.includes(':5173')
  ) {
    return 'development';
  }

  // Check for staging
  if (
    hostname.includes('staging') ||
    hostname.includes('dev.') ||
    hostname.includes('test.') ||
    href.includes('staging.') ||
    process.env.NODE_ENV === 'staging'
  ) {
    return 'staging';
  }

  // Default to production
  return 'production';
};

// Environment-specific rate limit configurations
export const ENVIRONMENT_CONFIGS: EnvironmentRateLimits = {
  development: {
    api: {
      maxRequests: 100,
      timeWindow: 60000, // 1 minute
      retryAfter: 500,
      category: 'api',
      enabled: false, // Disabled in development for easier testing
    },
    auth: {
      maxRequests: 20,
      timeWindow: 60000,
      retryAfter: 1000,
      category: 'auth',
      enabled: false,
    },
    user_interaction: {
      maxRequests: 100,
      timeWindow: 10000, // 10 seconds
      retryAfter: 200,
      category: 'user_interaction',
      enabled: false,
    },
    search: {
      maxRequests: 50,
      timeWindow: 30000, // 30 seconds
      retryAfter: 1000,
      category: 'search',
      enabled: false,
    },
    cart: {
      maxRequests: 50,
      timeWindow: 60000,
      retryAfter: 500,
      category: 'cart',
      enabled: false,
    },
    wishlist: {
      maxRequests: 30,
      timeWindow: 60000,
      retryAfter: 1000,
      category: 'wishlist',
      enabled: false,
    },
    form_submission: {
      maxRequests: 10,
      timeWindow: 60000,
      retryAfter: 5000,
      category: 'form_submission',
      enabled: false,
    },
    file_upload: {
      maxRequests: 5,
      timeWindow: 300000, // 5 minutes
      retryAfter: 10000,
      category: 'file_upload',
      enabled: false,
    },
  },
  staging: {
    api: {
      maxRequests: 50,
      timeWindow: 60000,
      retryAfter: 2000,
      category: 'api',
      enabled: true,
    },
    auth: {
      maxRequests: 10,
      timeWindow: 300000, // 5 minutes
      retryAfter: 30000,
      category: 'auth',
      enabled: true,
    },
    user_interaction: {
      maxRequests: 30,
      timeWindow: 10000,
      retryAfter: 500,
      category: 'user_interaction',
      enabled: true,
    },
    search: {
      maxRequests: 20,
      timeWindow: 30000,
      retryAfter: 2000,
      category: 'search',
      enabled: true,
    },
    cart: {
      maxRequests: 30,
      timeWindow: 60000,
      retryAfter: 1000,
      category: 'cart',
      enabled: true,
    },
    wishlist: {
      maxRequests: 20,
      timeWindow: 60000,
      retryAfter: 2000,
      category: 'wishlist',
      enabled: true,
    },
    form_submission: {
      maxRequests: 5,
      timeWindow: 60000,
      retryAfter: 10000,
      category: 'form_submission',
      enabled: true,
    },
    file_upload: {
      maxRequests: 3,
      timeWindow: 300000,
      retryAfter: 30000,
      category: 'file_upload',
      enabled: true,
    },
  },
  production: {
    api: {
      maxRequests: 30,
      timeWindow: 60000,
      retryAfter: 5000,
      category: 'api',
      enabled: true,
    },
    auth: {
      maxRequests: 5,
      timeWindow: 900000, // 15 minutes
      retryAfter: 60000,
      category: 'auth',
      enabled: true,
    },
    user_interaction: {
      maxRequests: 15,
      timeWindow: 10000,
      retryAfter: 1000,
      category: 'user_interaction',
      enabled: true,
    },
    search: {
      maxRequests: 10,
      timeWindow: 30000,
      retryAfter: 5000,
      category: 'search',
      enabled: true,
    },
    cart: {
      maxRequests: 20,
      timeWindow: 60000,
      retryAfter: 2000,
      category: 'cart',
      enabled: true,
    },
    wishlist: {
      maxRequests: 15,
      timeWindow: 60000,
      retryAfter: 3000,
      category: 'wishlist',
      enabled: true,
    },
    form_submission: {
      maxRequests: 3,
      timeWindow: 300000, // 5 minutes
      retryAfter: 30000,
      category: 'form_submission',
      enabled: true,
    },
    file_upload: {
      maxRequests: 2,
      timeWindow: 600000, // 10 minutes
      retryAfter: 60000,
      category: 'file_upload',
      enabled: true,
    },
  },
};

// Default manager configuration
export const DEFAULT_MANAGER_CONFIG: RateLimitManagerConfig = {
  defaultConfig: {
    maxRequests: 60,
    timeWindow: 60000,
    retryAfter: 1000,
    category: 'api',
    enabled: true,
  },
  circuitBreaker: {
    failureThreshold: 5,
    recoveryTimeout: 30000,
    monitoringPeriod: 60000,
    successThreshold: 3,
  },
  backoff: {
    initialDelay: 1000,
    maxDelay: 30000,
    multiplier: 2,
    maxRetries: 5,
    jitter: true,
  },
  deduplication: {
    enabled: true,
    cacheTime: 30000,
    keyGenerator: (request: unknown) => {
      if (typeof request === 'string') return request;
      if (request && typeof request === 'object') {
        return JSON.stringify(request);
      }
      return String(request);
    },
  },
  environmentLimits: ENVIRONMENT_CONFIGS,
  monitoring: {
    enabled: true,
    logLevel: 'warn',
    metricsInterval: 30000,
  },
};

// Configuration utilities
export const getEnvironmentConfig = (): EnvironmentRateLimits => {
  return ENVIRONMENT_CONFIGS;
};

export const getCurrentEnvironmentConfig = () => {
  const env = getCurrentEnvironment();
  return ENVIRONMENT_CONFIGS[env] || {};
};

export const createCustomConfig = (
  overrides: Partial<RateLimitManagerConfig>
): RateLimitManagerConfig => {
  return {
    ...DEFAULT_MANAGER_CONFIG,
    ...overrides,
    circuitBreaker: {
      ...DEFAULT_MANAGER_CONFIG.circuitBreaker,
      ...overrides.circuitBreaker,
    },
    backoff: {
      ...DEFAULT_MANAGER_CONFIG.backoff,
      ...overrides.backoff,
    },
    deduplication: {
      ...DEFAULT_MANAGER_CONFIG.deduplication,
      ...overrides.deduplication,
    },
    monitoring: {
      ...DEFAULT_MANAGER_CONFIG.monitoring,
      ...overrides.monitoring,
    },
  };
};

export const validateRateLimitConfig = (config: RateLimitConfig): boolean => {
  return (
    config.maxRequests > 0 &&
    config.timeWindow > 0 &&
    config.retryAfter > 0 &&
    config.category.length > 0
  );
};

export const mergeConfigs = (
  base: RateLimitConfig,
  override: Partial<RateLimitConfig>
): RateLimitConfig => {
  return {
    ...base,
    ...override,
  };
};

// Environment variable overrides
export const loadConfigFromEnv = (): Partial<RateLimitManagerConfig> => {
  return {
    monitoring: {
      enabled: process.env.VITE_RATE_LIMIT_MONITORING !== 'false',
      logLevel:
        (process.env.VITE_RATE_LIMIT_LOG_LEVEL as
          | 'debug'
          | 'info'
          | 'warn'
          | 'error') || 'warn',
      metricsInterval: parseInt(
        process.env.VITE_RATE_LIMIT_METRICS_INTERVAL || '30000'
      ),
    },
    circuitBreaker: {
      failureThreshold: parseInt(
        process.env.VITE_CIRCUIT_BREAKER_FAILURE_THRESHOLD || '5'
      ),
      recoveryTimeout: parseInt(
        process.env.VITE_CIRCUIT_BREAKER_RECOVERY_TIMEOUT || '30000'
      ),
      monitoringPeriod: parseInt(
        process.env.VITE_CIRCUIT_BREAKER_MONITORING_PERIOD || '60000'
      ),
      successThreshold: parseInt(
        process.env.VITE_CIRCUIT_BREAKER_SUCCESS_THRESHOLD || '3'
      ),
    },
    backoff: {
      maxRetries: parseInt(process.env.VITE_BACKOFF_MAX_RETRIES || '5'),
      initialDelay: parseInt(process.env.VITE_BACKOFF_INITIAL_DELAY || '1000'),
      maxDelay: parseInt(process.env.VITE_BACKOFF_MAX_DELAY || '30000'),
      multiplier: parseFloat(process.env.VITE_BACKOFF_MULTIPLIER || '2'),
      jitter: process.env.VITE_BACKOFF_JITTER !== 'false',
    },
  };
};

// Dynamic configuration updates
export const updateEnvironmentConfig = (
  environment: keyof EnvironmentRateLimits,
  category: string,
  config: Partial<RateLimitConfig>
): void => {
  if (ENVIRONMENT_CONFIGS[environment]) {
    ENVIRONMENT_CONFIGS[environment] = {
      ...ENVIRONMENT_CONFIGS[environment],
      [category]: {
        ...ENVIRONMENT_CONFIGS[environment][
          category as keyof (typeof ENVIRONMENT_CONFIGS)[typeof environment]
        ],
        ...config,
      },
    };
  }
};

export const disableRateLimiting = (category?: string): void => {
  const env = getCurrentEnvironment();

  if (category) {
    const envConfig = ENVIRONMENT_CONFIGS[env];
    if (envConfig && envConfig[category as keyof typeof envConfig]) {
      (
        envConfig[category as keyof typeof envConfig] as RateLimitConfig
      ).enabled = false;
    }
  } else {
    // Disable all rate limiting for current environment
    Object.values(ENVIRONMENT_CONFIGS[env] || {}).forEach((config) => {
      if (config) {
        config.enabled = false;
      }
    });
  }
};

export const enableRateLimiting = (category?: string): void => {
  const env = getCurrentEnvironment();

  if (category) {
    const envConfig = ENVIRONMENT_CONFIGS[env];
    if (envConfig && envConfig[category as keyof typeof envConfig]) {
      (
        envConfig[category as keyof typeof envConfig] as RateLimitConfig
      ).enabled = true;
    }
  } else {
    // Enable all rate limiting for current environment
    Object.values(ENVIRONMENT_CONFIGS[env] || {}).forEach((config) => {
      if (config) {
        config.enabled = true;
      }
    });
  }
};
