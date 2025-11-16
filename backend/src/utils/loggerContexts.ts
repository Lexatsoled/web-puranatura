import { redactPII } from './piiRedactor.js';

export interface UserContextInput {
  userId?: string;
  email?: string;
  role?: string;
}

export interface UserContext {
  userId?: string;
  email?: string;
  role?: string;
}

export interface DbContext {
  query: string;
  durationMs: number;
  slow: boolean;
  thresholdMs: number;
}

export interface ApiContext {
  endpoint: string;
  method: string;
  statusCode: number;
  durationMs?: number;
}

const SLOW_QUERY_THRESHOLD_MS = 1000;

export function userContext(user: UserContextInput): UserContext {
  const sanitized = user.email
    ? (redactPII({ email: user.email }) as { email?: string }).email
    : undefined;

  return {
    userId: user.userId,
    email: sanitized,
    role: user.role,
  };
}

export function dbContext(query: string, durationMs: number, thresholdMs = SLOW_QUERY_THRESHOLD_MS): DbContext {
  return {
    query: query.trim().slice(0, 2048),
    durationMs,
    slow: durationMs > thresholdMs,
    thresholdMs,
  };
}

export function apiContext(
  endpoint: string,
  method: string,
  statusCode: number,
  durationMs?: number,
): ApiContext {
  return {
    endpoint,
    method,
    statusCode,
    durationMs,
  };
}
