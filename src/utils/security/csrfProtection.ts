/**
 * CSRF Protection Implementation
 * Comprehensive Cross-Site Request Forgery protection for Pureza Naturalis
 */

import crypto from 'crypto';

export interface CSRFConfig {
  secret: string;
  cookieName: string;
  headerName: string;
  tokenExpiry: number; // in milliseconds
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

export interface CSRFTokens {
  csrfToken: string;
  sessionId: string;
  timestamp: number;
}

export interface CSRFValidationResult {
  isValid: boolean;
  error?: string;
  regenerated?: boolean;
}

/**
 * Default CSRF configuration
 */
export const defaultCSRFConfig: CSRFConfig = {
  secret: process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex'),
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  tokenExpiry: 60 * 60 * 1000, // 1 hour
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

/**
 * CSRF Token Generator
 * Generates cryptographically secure CSRF tokens
 */
export class CSRFTokenGenerator {
  private config: CSRFConfig;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...defaultCSRFConfig, ...config };
  }

  /**
   * Generate a new CSRF token for a session
   */
  generateToken(sessionId: string): CSRFTokens {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');

    // Create token data
    const tokenData = `${sessionId}.${timestamp}.${randomBytes}`;

    // Create HMAC signature
    const signature = crypto
      .createHmac('sha256', this.config.secret)
      .update(tokenData)
      .digest('hex');

    // Combine data and signature
    const csrfToken = `${tokenData}.${signature}`;

    return {
      csrfToken,
      sessionId,
      timestamp,
    };
  }

  /**
   * Validate a CSRF token
   */
  validateToken(token: string, sessionId: string): CSRFValidationResult {
    try {
      const parts = token.split('.');
      if (parts.length !== 4) {
        return { isValid: false, error: 'Invalid token format' };
      }

      const [tokenSessionId, timestampStr, randomBytes, signature] = parts;
      const timestamp = parseInt(timestampStr, 10);

      // Verify session ID matches
      if (tokenSessionId !== sessionId) {
        return { isValid: false, error: 'Session ID mismatch' };
      }

      // Check token expiry
      const now = Date.now();
      if (now - timestamp > this.config.tokenExpiry) {
        return { isValid: false, error: 'Token expired', regenerated: true };
      }

      // Verify signature
      const tokenData = `${tokenSessionId}.${timestamp}.${randomBytes}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.config.secret)
        .update(tokenData)
        .digest('hex');

      const isValidSignature = crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );

      if (!isValidSignature) {
        return { isValid: false, error: 'Invalid signature' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Rotate a CSRF token (generate new one)
   */
  rotateToken(sessionId: string): CSRFTokens {
    return this.generateToken(sessionId);
  }

  /**
   * Extract token from request
   */
  extractTokenFromRequest(req: Record<string, any>): string | null {
    // Check header first
    const headerToken = req.headers[this.config.headerName.toLowerCase()];
    if (headerToken) {
      return Array.isArray(headerToken) ? headerToken[0] : headerToken;
    }

    // Check body
    if (req.body && req.body._csrf) {
      return req.body._csrf;
    }

    // Check query parameters
    if (req.query && typeof req.query._csrf === 'string') {
      return req.query._csrf;
    }
    if (req.query && Array.isArray(req.query._csrf) && typeof req.query._csrf[0] === 'string') {
      return req.query._csrf[0];
    }
    return null;
  }

  /**
   * Get session ID from request
   */
  getSessionIdFromRequest(req: Record<string, any>): string | null {
    if (req.session && req.session.id) {
      return req.session.id;
    }
    if (req.user && req.user.id) {
      return req.user.id;
    }
    if (req.sessionID) {
      return req.sessionID;
    }
    return null;
  }
}

/**
 * CSRF Protection Middleware for Express.js
 */
export class CSRFProtectionMiddleware {
  private tokenGenerator: CSRFTokenGenerator;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.tokenGenerator = new CSRFTokenGenerator(config);
  }

  /**
   * Middleware to provide CSRF token to views/forms
   */
  csrfToken(req: Record<string, any>, res: Record<string, any>, next: () => void) {
    const sessionId = this.tokenGenerator.getSessionIdFromRequest(req);

    if (sessionId) {
      const tokens = this.tokenGenerator.generateToken(sessionId);
      if (res.locals) res.locals.csrfToken = tokens.csrfToken;
      if (typeof res.cookie === 'function') {
        res.cookie(this.tokenGenerator['config'].cookieName, tokens.csrfToken, {
          httpOnly: true,
          secure: this.tokenGenerator['config'].secure,
          sameSite: this.tokenGenerator['config'].sameSite,
          maxAge: this.tokenGenerator['config'].tokenExpiry,
        });
      }
    }

  if (typeof next === 'function') next();
  }

  /**
   * Middleware to validate CSRF token on state-changing requests
   */
  csrfProtection(req: Record<string, any>, res: Record<string, any>, next: () => void) {
    // Skip CSRF check for safe HTTP methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      if (typeof next === 'function') return next();
    }

    const sessionId = this.tokenGenerator.getSessionIdFromRequest(req);
    const token = this.tokenGenerator.extractTokenFromRequest(req);

    if (!sessionId) {
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(403).json({
          error: 'CSRF protection: No valid session found',
        });
      }
      return;
    }
    if (!token) {
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(403).json({
          error: 'CSRF protection: Missing CSRF token',
        });
      }
      return;
    }

    const validation = this.tokenGenerator.validateToken(token, sessionId);

    if (!validation.isValid) {
      // Log CSRF attempt
      console.warn('CSRF attack attempt detected:', {
        sessionId,
        token: token.substring(0, 20) + '...',
        error: validation.error,
        ip: req.ip,
        userAgent: typeof req.get === 'function' ? req.get('User-Agent') : undefined,
        timestamp: new Date().toISOString(),
      });
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(403).json({
          error: 'CSRF protection: Invalid token',
          details: validation.error,
        });
      }
      return;
    }

    // Token is valid, proceed
  if (typeof next === 'function') next();
  }

  /**
   * Combined middleware for both providing and validating tokens
   */
  csrf(req: Record<string, any>, res: Record<string, any>, next: (err?: unknown) => void) {
    // First provide token
    this.csrfToken(req, res, (err?: unknown) => {
      if (err && typeof next === 'function') return next(err);
      // Then validate if needed
      this.csrfProtection(req, res, next);
    });
  }
}

/**
 * CSRF Protection for API Routes
 */
export class CSRFApiProtection {
  private tokenGenerator: CSRFTokenGenerator;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.tokenGenerator = new CSRFTokenGenerator(config);
  }

  /**
   * Get CSRF token for API clients
   */
  getToken(req: Record<string, any>, res: Record<string, any>) {
    const sessionId = this.tokenGenerator.getSessionIdFromRequest(req);

    if (!sessionId) {
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(401).json({ error: 'No valid session' });
      }
      return;
    }

    const tokens = this.tokenGenerator.generateToken(sessionId);

    if (typeof res.json === 'function') {
      res.json({
        csrfToken: tokens.csrfToken,
        expiresAt: new Date(
          tokens.timestamp + this.tokenGenerator['config'].tokenExpiry
        ).toISOString(),
      });
    }
  }

  /**
   * Validate CSRF token for API requests
   */
  validateApiRequest(req: Record<string, any>, res: Record<string, any>, next: () => void) {
    const sessionId = this.tokenGenerator.getSessionIdFromRequest(req);
    const token = this.tokenGenerator.extractTokenFromRequest(req);

    if (!sessionId || !token) {
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(403).json({
          error: 'CSRF validation failed',
          message: 'Missing session or CSRF token',
        });
      }
      return;
    }

    const validation = this.tokenGenerator.validateToken(token, sessionId);

    if (!validation.isValid) {
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(403).json({
          error: 'CSRF validation failed',
          message: validation.error,
          regenerated: validation.regenerated,
        });
      }
      return;
    }

  if (typeof next === 'function') next();
  }
}

/**
 * React Hook for CSRF Protection
 */
export function useCSRFProtection() {
  // In a real implementation, this would fetch the CSRF token from the server
  // For now, return a placeholder
  const getCSRFToken = async (): Promise<string> => {
    // This would make an API call to get a fresh CSRF token
    return 'placeholder-csrf-token';
  };

  const validateCSRFToken = (token: string): boolean => {
    // This would validate the token format and expiry
    return Boolean(token && token.length > 32);
  };

  return {
    getCSRFToken,
    validateCSRFToken,
  };
}

/**
 * CSRF Monitoring and Alerting
 */
export class CSRFMonitor {
  private static violations: Array<{
    timestamp: Date;
    sessionId: string;
    ip: string;
    userAgent: string;
    error: string;
  }> = [];

  static recordViolation(
    sessionId: string,
    ip: string,
    userAgent: string,
    error: string
  ) {
    const violation = {
      timestamp: new Date(),
      sessionId,
      ip,
      userAgent,
      error,
    };

    this.violations.push(violation);

    // Keep only last 1000 violations
    if (this.violations.length > 1000) {
      this.violations = this.violations.slice(-1000);
    }

    // Log violation
    console.warn('CSRF Violation:', violation);

    // In production, this would send alerts
    this.checkForAttackPatterns();
  }

  static getViolationStats(): {
    totalViolations: number;
    violationsLastHour: number;
    violationsLast24Hours: number;
    topErrors: Array<{ error: string; count: number }>;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const violationsLastHour = this.violations.filter(
      (v) => v.timestamp >= oneHourAgo
    ).length;
    const violationsLast24Hours = this.violations.filter(
      (v) => v.timestamp >= oneDayAgo
    ).length;

    // Count error types
    const errorCounts: { [key: string]: number } = {};
    this.violations.forEach((v) => {
      errorCounts[v.error] = (errorCounts[v.error] || 0) + 1;
    });

    const topErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));

    return {
      totalViolations: this.violations.length,
      violationsLastHour,
      violationsLast24Hours,
      topErrors,
    };
  }

  private static checkForAttackPatterns() {
    const stats = this.getViolationStats();

    // Alert if too many violations in short time
    if (stats.violationsLastHour > 10) {
      console.error('🚨 Potential CSRF attack detected:', stats);
      // In production: sendSecurityAlert(stats);
    }
  }
}

/**
 * CSRF Protection Utilities
 */
export class CSRFUtils {
  /**
   * Generate a cryptographically secure random string
   */
  static generateSecureRandom(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash a value using SHA-256
   */
  static hashValue(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  /**
   * Create HMAC signature
   */
  static createHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Constant-time comparison to prevent timing attacks
   */
  static secureCompare(a: string, b: string): boolean {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(a, 'hex'),
        Buffer.from(b, 'hex')
      );
    } catch {
      return false;
    }
  }

  /**
   * Validate CSRF configuration
   */
  static validateConfig(config: Partial<CSRFConfig>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.secret || config.secret.length < 32) {
      errors.push('CSRF secret must be at least 32 characters long');
    }

    if (config.tokenExpiry && config.tokenExpiry < 60000) {
      // 1 minute minimum
      errors.push('Token expiry must be at least 1 minute');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * CSRF Protection for Form Submissions
 */
export class CSRFFormProtection {
  private tokenGenerator: CSRFTokenGenerator;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.tokenGenerator = new CSRFTokenGenerator(config);
  }

  /**
   * Generate hidden input for forms
   */
  generateFormInput(sessionId: string): string {
    const tokens = this.tokenGenerator.generateToken(sessionId);
    return `<input type="hidden" name="_csrf" value="${tokens.csrfToken}" />`;
  }

  /**
   * Generate meta tag for AJAX requests
   */
  generateMetaTag(sessionId: string): string {
    const tokens = this.tokenGenerator.generateToken(sessionId);
    return `<meta name="csrf-token" content="${tokens.csrfToken}" />`;
  }

  /**
   * Get token for AJAX requests
   */
  getTokenForAjax(sessionId: string): string {
    const tokens = this.tokenGenerator.generateToken(sessionId);
    return tokens.csrfToken;
  }
}

// Export default instances
export const csrfTokenGenerator = new CSRFTokenGenerator();
export const csrfMiddleware = new CSRFProtectionMiddleware();
export const csrfApiProtection = new CSRFApiProtection();
export const csrfFormProtection = new CSRFFormProtection();

export default {
  CSRFTokenGenerator,
  CSRFProtectionMiddleware,
  CSRFApiProtection,
  CSRFMonitor,
  CSRFUtils,
  CSRFFormProtection,
  csrfTokenGenerator,
  csrfMiddleware,
  csrfApiProtection,
  csrfFormProtection,
};
