/**
 * Authentication Error Handler
 * Centralized error handling for authentication operations
 */

import { APIError } from '@/types/auth';

export class AuthError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Error codes for different authentication scenarios
 */
export const AUTH_ERROR_CODES = {
  // Login errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',

  // Registration errors
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_EMAIL: 'INVALID_EMAIL',

  // Token errors
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_MISSING: 'TOKEN_MISSING',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Session errors
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_INVALID: 'SESSION_INVALID',

  // Permission errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ROLE_REQUIRED: 'ROLE_REQUIRED',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

/**
 * Maps HTTP status codes to error codes
 */
const STATUS_CODE_MAP: Record<number, string> = {
  400: AUTH_ERROR_CODES.VALIDATION_ERROR,
  401: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
  403: AUTH_ERROR_CODES.INSUFFICIENT_PERMISSIONS,
  404: AUTH_ERROR_CODES.UNKNOWN_ERROR,
  409: AUTH_ERROR_CODES.EMAIL_EXISTS,
  423: AUTH_ERROR_CODES.ACCOUNT_LOCKED,
  500: AUTH_ERROR_CODES.SERVER_ERROR,
  502: AUTH_ERROR_CODES.SERVER_ERROR,
  503: AUTH_ERROR_CODES.SERVER_ERROR,
  504: AUTH_ERROR_CODES.TIMEOUT,
};

/**
 * Creates an AuthError from various error sources
 */
export function createAuthError(
  error: unknown,
  defaultMessage = 'An authentication error occurred'
): AuthError {
  // If it's already an AuthError, return it
  if (error instanceof AuthError) {
    return error;
  }

  // Handle APIError objects
  if (error && typeof error === 'object' && 'code' in error) {
    const apiError = error as APIError;
    return new AuthError(
      apiError.message || defaultMessage,
      apiError.code || AUTH_ERROR_CODES.UNKNOWN_ERROR,
      apiError.status
    );
  }

  // Handle HTTP response errors
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const resp = (error as { response?: { status?: number; data?: unknown } }).response;
    const status = typeof resp?.status === 'number' ? resp.status : undefined;
    const data = resp?.data as Record<string, unknown> | undefined;

    const errorCode = typeof status === 'number'
      ? STATUS_CODE_MAP[status] || AUTH_ERROR_CODES.UNKNOWN_ERROR
      : AUTH_ERROR_CODES.UNKNOWN_ERROR;
    const message = (data && typeof (data as Record<string, unknown>)?.message === 'string'
      ? (data as Record<string, unknown>).message as string
      : undefined) ||
      (data && typeof (data as Record<string, unknown>)?.error === 'string'
        ? (data as Record<string, unknown>).error as string
        : undefined) ||
      (typeof status === 'number' ? `HTTP ${status} error` : defaultMessage);

    return new AuthError(message, errorCode, status, data);
  }

  // Handle network errors
  {
    const obj = (typeof error === 'object' && error !== null)
      ? (error as Record<string, unknown>)
      : undefined;
    const code = obj?.code;
    const msg = obj?.message;
    if (code === 'NETWORK_ERROR' || (typeof msg === 'string' && msg.includes('network'))) {
    return new AuthError(
      'Network connection failed. Please check your internet connection.',
      AUTH_ERROR_CODES.NETWORK_ERROR
    );
    }
  }

  // Handle timeout errors
  {
    const obj = (typeof error === 'object' && error !== null)
      ? (error as Record<string, unknown>)
      : undefined;
    const code = obj?.code;
    const msg = obj?.message;
    if (code === 'TIMEOUT' || (typeof msg === 'string' && msg.includes('timeout'))) {
    return new AuthError(
      'Request timed out. Please try again.',
      AUTH_ERROR_CODES.TIMEOUT
    );
    }
  }

  // Handle JWT specific errors
  {
    const obj = (typeof error === 'object' && error !== null)
      ? (error as Record<string, unknown>)
      : undefined;
    const msg = obj?.message;
    if (typeof msg === 'string' && (msg.includes('jwt') || msg.includes('token'))) {
      if (msg.includes('expired')) {
      return new AuthError(
        'Your session has expired. Please log in again.',
        AUTH_ERROR_CODES.TOKEN_EXPIRED
      );
      }
      return new AuthError(
        'Authentication token is invalid.',
        AUTH_ERROR_CODES.TOKEN_INVALID
      );
    }
  }

  // Handle generic errors
  const message = (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string')
    ? ((error as { message: unknown }).message as string)
    : defaultMessage;
  return new AuthError(message, AUTH_ERROR_CODES.UNKNOWN_ERROR);
}

/**
 * Gets user-friendly error messages for error codes
 */
export function getErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    [AUTH_ERROR_CODES.INVALID_CREDENTIALS]:
      'Invalid email or password. Please check your credentials and try again.',
    [AUTH_ERROR_CODES.ACCOUNT_LOCKED]:
      'Your account has been locked. Please contact support.',
    [AUTH_ERROR_CODES.ACCOUNT_DISABLED]:
      'Your account has been disabled. Please contact support.',
    [AUTH_ERROR_CODES.EMAIL_EXISTS]:
      'An account with this email already exists.',
    [AUTH_ERROR_CODES.WEAK_PASSWORD]:
      'Password is too weak. Please choose a stronger password.',
    [AUTH_ERROR_CODES.INVALID_EMAIL]: 'Please enter a valid email address.',
    [AUTH_ERROR_CODES.TOKEN_EXPIRED]:
      'Your session has expired. Please log in again.',
    [AUTH_ERROR_CODES.TOKEN_INVALID]:
      'Authentication token is invalid. Please log in again.',
    [AUTH_ERROR_CODES.TOKEN_MISSING]: 'Authentication required. Please log in.',
    [AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED]:
      'Session expired. Please log in again.',
    [AUTH_ERROR_CODES.NETWORK_ERROR]:
      'Network connection failed. Please check your internet connection.',
    [AUTH_ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
    [AUTH_ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
    [AUTH_ERROR_CODES.SESSION_EXPIRED]:
      'Your session has expired. Please log in again.',
    [AUTH_ERROR_CODES.SESSION_INVALID]:
      'Session is invalid. Please log in again.',
    [AUTH_ERROR_CODES.INSUFFICIENT_PERMISSIONS]:
      'You do not have permission to perform this action.',
    [AUTH_ERROR_CODES.ROLE_REQUIRED]:
      'This action requires additional permissions.',
    [AUTH_ERROR_CODES.VALIDATION_ERROR]:
      'Please check your input and try again.',
    [AUTH_ERROR_CODES.UNKNOWN_ERROR]:
      'An unexpected error occurred. Please try again.',
  };

  return (
    messages[errorCode] || 'An unexpected error occurred. Please try again.'
  );
}

/**
 * Determines if an error requires user re-authentication
 */
export function requiresReAuthentication(error: AuthError): boolean {
  const reAuthCodes = [
    AUTH_ERROR_CODES.TOKEN_EXPIRED,
    AUTH_ERROR_CODES.TOKEN_INVALID,
    AUTH_ERROR_CODES.TOKEN_MISSING,
    AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED,
    AUTH_ERROR_CODES.SESSION_EXPIRED,
    AUTH_ERROR_CODES.SESSION_INVALID,
    AUTH_ERROR_CODES.INVALID_CREDENTIALS,
  ] as const;

  return reAuthCodes.includes(error.code as typeof reAuthCodes[number]);
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: AuthError): boolean {
  const retryableCodes = [
    AUTH_ERROR_CODES.NETWORK_ERROR,
    AUTH_ERROR_CODES.TIMEOUT,
    AUTH_ERROR_CODES.SERVER_ERROR,
  ] as const;

  return retryableCodes.includes(error.code as typeof retryableCodes[number]);
}

/**
 * Logs authentication errors for debugging
 */
export function logAuthError(_error: AuthError, _context?: string): void {
  // errorLogger.log(_error, 'error', 'auth') // (opcional: log centralizado)

  // In production, you might want to send this to a logging service
  // logToService(logData);
}

/**
 * Handles authentication errors with appropriate user feedback
 */
export function handleAuthError(
  error: unknown,
  context?: string,
  onError?: (error: AuthError) => void
): AuthError {
  const authError = createAuthError(error);
  logAuthError(authError, context);
  onError?.(authError);
  return authError;
}
