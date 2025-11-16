/**
 * Configuración centralizada de rate limits por endpoint
 */
export const rateLimitRules = {
  login: {
    max: 5,
    timeWindow: '15 minutes',
    errorMessage: 'Too many login attempts. Try again in 15 minutes.',
  },
  register: {
    max: 3,
    timeWindow: '1 hour',
    errorMessage: 'Too many registration attempts.',
  },
  forgotPassword: {
    max: 3,
    timeWindow: '1 hour',
    errorMessage: 'Too many password reset requests.',
  },
  checkout: {
    max: 10,
    timeWindow: '10 minutes',
    errorMessage: 'Too many checkout attempts.',
  },
  search: {
    max: 60,
    timeWindow: '1 minute',
    errorMessage: 'Too many search requests.',
  },
  publicApi: {
    max: 100,
    timeWindow: '1 minute',
    errorMessage: 'Rate limit exceeded.',
  },
  upload: {
    max: 10,
    timeWindow: '1 hour',
    errorMessage: 'Too many upload requests.',
  },
  admin: {
    max: 300,
    timeWindow: '1 minute',
    errorMessage: 'Admin rate limit exceeded.',
  },
} as const;

type RateLimitRuleKey = keyof typeof rateLimitRules;

export function createRateLimitConfig(ruleName: RateLimitRuleKey) {
  const rule = rateLimitRules[ruleName];

  return {
    max: rule.max,
    timeWindow: rule.timeWindow,
    errorResponseBuilder: (_req: unknown, context: { ttl: number }) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: rule.errorMessage,
      retryAfter: Math.ceil(context.ttl / 1000),
    }),
  };
}
