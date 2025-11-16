/**
 * Custom Hook for Rate Limiting
 * Provides React hooks for managing rate limiting with circuit breaker,
 * exponential backoff, and request deduplication.
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import {
  RateLimitCategory,
  RateLimitConfig,
  RateLimitMetrics,
  RateLimitHookOptions,
  RateLimitHookReturn,
} from '@/types/rateLimit';
import { rateLimitManager, isRateLimitError } from '@/utils/rateLimitUtils';

export const useRateLimit = (
  options: RateLimitHookOptions
): RateLimitHookReturn => {
  const {
    category,

    onBlocked,

    onSuccess,
    onFailure,
  } = options;

  const limiterRef = useRef(rateLimitManager.getLimiter(category));
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(0);
  const [resetTime, setResetTime] = useState(0);

  // Update state when limiter changes
  useEffect(() => {
    const limiter = rateLimitManager.getLimiter(category);
    if (limiter) {
      limiterRef.current = limiter;
      setIsBlocked(limiter.isBlocked());
      setRemainingRequests(limiter.getRemainingRequests());
      // Calculate reset time based on current window
      const metrics = limiter.getMetrics();
      setResetTime(
        metrics.lastRequestTime
          ? metrics.lastRequestTime + 60000
          : Date.now() + 60000
      );
    }
  }, [category]);

  // Periodic updates for blocked state and remaining requests
  useEffect(() => {
    const interval = setInterval(() => {
      const limiter = limiterRef.current;
      if (limiter) {
        const wasBlocked = isBlocked;
        const currentlyBlocked = limiter.isBlocked();

        setIsBlocked(currentlyBlocked);
        setRemainingRequests(limiter.getRemainingRequests());

        // If unblocked, update reset time
        if (wasBlocked && !currentlyBlocked) {
          const metrics = limiter.getMetrics();
          setResetTime(
            metrics.lastRequestTime
              ? metrics.lastRequestTime + 60000
              : Date.now() + 60000
          );
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isBlocked]);

  const execute = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      const limiter = limiterRef.current;
      if (!limiter) {
        throw new Error(`No rate limiter configured for category: ${category}`);
      }

      try {
        const result = await limiter.execute(fn);

        // Update state after successful execution
        setIsBlocked(limiter.isBlocked());
        setRemainingRequests(limiter.getRemainingRequests());
        onSuccess?.();

        return result;
      } catch (error) {
        if (isRateLimitError(error)) {
          setIsBlocked(true);
          setResetTime(error.retryAfter || Date.now() + 60000);
          onBlocked?.(error);
        } else {
          onFailure?.(error);
        }
        throw error;
      }
    },
    [category, onBlocked, onSuccess, onFailure]
  );

  const reset = useCallback(() => {
    const limiter = limiterRef.current;
    if (limiter) {
      limiter.reset();
      setIsBlocked(false);
      setRemainingRequests(limiter.getRemainingRequests());
      setResetTime(Date.now() + 60000);
    }
  }, []);

  const getMetrics = useCallback((): RateLimitMetrics => {
    const limiter = limiterRef.current;
    return limiter
      ? limiter.getMetrics()
      : {
          totalRequests: 0,
          blockedRequests: 0,
          successfulRequests: 0,
          averageResponseTime: 0,
          category,
        };
  }, [category]);

  return {
    isBlocked,
    remainingRequests,
    resetTime,
    execute,
    reset,
    getMetrics,
  };
};

/**
 * Hook for Authentication Rate Limiting
 */
export const useAuthRateLimit = (customConfig?: Partial<RateLimitConfig>) => {
  return useRateLimit({
    category: RateLimitCategory.AUTH,
    customConfig,
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
    onSuccess: () => {
      // Optional: Track successful auth attempts
    },
    onFailure: () => {
      // Auth error handled by caller
    },
  });
};

/**
 * Hook for API Rate Limiting
 */
export const useApiRateLimit = (customConfig?: Partial<RateLimitConfig>) => {
  return useRateLimit({
    category: RateLimitCategory.API,
    customConfig,
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
    onRetry: () => {
      // Retry handled internally
    },
  });
};

/**
 * Hook for User Interaction Rate Limiting
 */
export const useInteractionRateLimit = (
  customConfig?: Partial<RateLimitConfig>
) => {
  return useRateLimit({
    category: RateLimitCategory.USER_INTERACTION,
    customConfig: {
      maxRequests: 20,
      timeWindow: 10000, // 10 seconds
      retryAfter: 500,
      ...customConfig,
    },
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};

/**
 * Hook for Form Submission Rate Limiting
 */
export const useFormRateLimit = (customConfig?: Partial<RateLimitConfig>) => {
  return useRateLimit({
    category: RateLimitCategory.FORM_SUBMISSION,
    customConfig: {
      maxRequests: 5,
      timeWindow: 60000, // 1 minute
      retryAfter: 10000,
      ...customConfig,
    },
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};

/**
 * Hook for Search Rate Limiting
 */
export const useSearchRateLimit = (customConfig?: Partial<RateLimitConfig>) => {
  return useRateLimit({
    category: RateLimitCategory.SEARCH,
    customConfig: {
      maxRequests: 10,
      timeWindow: 30000, // 30 seconds
      retryAfter: 2000,
      ...customConfig,
    },
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};

/**
 * Hook for Cart Operation Rate Limiting
 */
export const useCartRateLimit = (customConfig?: Partial<RateLimitConfig>) => {
  return useRateLimit({
    category: RateLimitCategory.CART,
    customConfig: {
      maxRequests: 30,
      timeWindow: 60000, // 1 minute
      retryAfter: 1000,
      ...customConfig,
    },
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};

/**
 * Hook for Wishlist Rate Limiting
 */
export const useWishlistRateLimit = (
  customConfig?: Partial<RateLimitConfig>
) => {
  return useRateLimit({
    category: RateLimitCategory.WISHLIST,
    customConfig: {
      maxRequests: 20,
      timeWindow: 60000, // 1 minute
      retryAfter: 2000,
      ...customConfig,
    },
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};

/**
 * Hook for File Upload Rate Limiting
 */
export const useFileUploadRateLimit = (
  customConfig?: Partial<RateLimitConfig>
) => {
  return useRateLimit({
    category: RateLimitCategory.FILE_UPLOAD,
    customConfig: {
      maxRequests: 3,
      timeWindow: 300000, // 5 minutes
      retryAfter: 30000,
      ...customConfig,
    },
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};

/**
 * Custom Rate Limit Hook for specific categories
 */
export const useCustomRateLimit = (
  category: RateLimitCategory,
  customConfig?: Partial<RateLimitConfig>
) => {
  return useRateLimit({
    category,
    customConfig,
    onBlocked: () => {
      // Rate limit exceeded - handled by RateLimitError
    },
  });
};
