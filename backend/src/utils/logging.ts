import * as Sentry from '@sentry/node';
import { logger } from '../config/logger.js';
import { config } from '../config/index.js';
import { maskEmail, maskIp, redactPII } from './piiRedactor.js';

let sentryInitialized = false;

const ensureSentry = () => {
  if (!config.SENTRY_DSN) {
    return null;
  }

  if (!sentryInitialized) {
    Sentry.init({
      dsn: config.SENTRY_DSN,
      environment: config.NODE_ENV,
      tracesSampleRate: 0,
    });
    sentryInitialized = true;
  }

  return Sentry;
};

export function logAuthAttempt(email: string, success: boolean, ip: string) {
  const redactedEmail = maskEmail(email);
  const maskedIp = maskIp(ip);

  logger.info(
    {
      event: 'auth_attempt',
      email: redactedEmail,
      success,
      ip: maskedIp,
    },
    success ? 'Login successful' : 'Login failed',
  );
}

export function logOrderCreated(orderId: string, userId: string, total: number) {
  logger.info(
    {
      event: 'order_created',
      orderId,
      userId,
      total,
    },
    'Order created successfully',
  );
}

export function logDatabaseQuery(query: string, duration: number) {
  if ((config.LOG_LEVEL ?? 'info') !== 'debug') {
    return;
  }

  logger.debug(
    {
      query: query.slice(0, 120),
      duration: `${duration}ms`,
    },
    'Database query',
  );
}

export function logSecurityEvent(event: string, details: Record<string, unknown>) {
  logger.warn(
    {
      event: `security_${event}`,
      ...redactPII(details),
    },
    `Security event: ${event}`,
  );
}

export function logCriticalError(error: Error, context?: Record<string, unknown>) {
  logger.error(
    {
      err: error,
      context: context ? redactPII(context) : undefined,
    },
    'Critical error occurred',
  );

  const sentry = ensureSentry();
  if (sentry) {
    sentry.captureException(error, {
      extra: context,
    });
  }
}
