/**
 * XSS Protection & Input Sanitization
 * Comprehensive input validation and sanitization for preventing XSS attacks
 */

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize DOMPurify with jsdom for server-side usage
const window = new JSDOM('').window;
const DOMPurifyServer = DOMPurify(window as any);

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowDataAttributes?: boolean;
  allowComments?: boolean;
  allowConditionalComments?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  errors: string[];
  warnings: string[];
}

/**
 * Input Sanitizer Class
 * Handles various types of input sanitization and validation
 */
export class InputSanitizer {
  private static readonly DEFAULT_ALLOWED_TAGS = [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'hr',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'a',
    'img',
    'span',
    'div',
  ];

  private static readonly DEFAULT_ALLOWED_ATTRIBUTES = [
    'href',
    'src',
    'alt',
    'title',
    'class',
    'id',
    'style',
    'target',
    'rel',
    'width',
    'height',
    'loading',
    'decoding',
  ];

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(
    input: string,
    options: SanitizationOptions = {}
  ): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const config = {
      ALLOWED_TAGS: options.allowedTags || this.DEFAULT_ALLOWED_TAGS,
      ALLOWED_ATTR:
        options.allowedAttributes || this.DEFAULT_ALLOWED_ATTRIBUTES,
      ALLOW_DATA_ATTR: options.allowDataAttributes || false,
      ALLOW_COMMENTS: options.allowComments || false,
      ALLOW_CONDITIONAL_COMMENTS: options.allowConditionalComments || false,
      // Additional security measures
      FORBID_TAGS: [
        'script',
        'style',
        'iframe',
        'object',
        'embed',
        'form',
        'input',
        'button',
      ],
      FORBID_ATTR: [
        'onload',
        'onerror',
        'onclick',
        'onmouseover',
        'onmouseout',
        'onkeydown',
        'onkeyup',
        'onkeypress',
      ],
    };

    return DOMPurifyServer.sanitize(input, config);
  }

  /**
   * Sanitize SQL input (basic protection)
   */
  static sanitizeSql(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove dangerous SQL characters and patterns
    return input
      .replace(/['";\\]/g, '') // Remove quotes and backslashes
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(
        /\b(union|select|insert|update|delete|drop|create|alter)\b/gi,
        ''
      ) // Remove SQL keywords
      .trim();
  }

  /**
   * Validate and sanitize email addresses
   */
  static sanitizeEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!email || typeof email !== 'string') {
      return { isValid: false, errors: ['Email is required'], warnings: [] };
    }

    const trimmed = email.trim().toLowerCase();

    // Basic email regex (RFC 5322 compliant)
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmed)) {
      errors.push('Invalid email format');
    }

    if (trimmed.length > 254) {
      errors.push('Email address is too long');
    }

    // Check for suspicious patterns
    if (trimmed.includes('<script') || trimmed.includes('javascript:')) {
      errors.push('Email contains suspicious content');
    }

    // Check for consecutive dots
    if (trimmed.includes('..')) {
      errors.push('Email contains consecutive dots');
    }

    return {
      isValid: errors.length === 0,
      sanitized: trimmed,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize and validate URLs
   */
  static sanitizeUrl(
    url: string,
    allowedDomains: string[] = []
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!url || typeof url !== 'string') {
      return { isValid: false, errors: ['URL is required'], warnings: [] };
    }

    try {
      const urlObj = new URL(url);

      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('Only HTTP and HTTPS URLs are allowed');
      }

      // Check against allowed domains if specified
      if (allowedDomains.length > 0) {
        const isAllowed = allowedDomains.some(
          (domain) =>
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
        if (!isAllowed) {
          errors.push(`Domain ${urlObj.hostname} is not in the allowed list`);
        }
      }

      // Check for suspicious patterns
      if (
        url.includes('<script') ||
        url.includes('javascript:') ||
        url.includes('data:')
      ) {
        errors.push('URL contains suspicious content');
      }

      return {
        isValid: errors.length === 0,
        sanitized: urlObj.toString(),
        errors,
        warnings,
      };
    } catch {
      errors.push('Invalid URL format');
      return { isValid: false, errors, warnings: [] };
    }
  }

  /**
   * Sanitize text input (remove HTML and dangerous characters)
   */
  static sanitizeText(
    input: string,
    maxLength: number = 10000
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        errors: ['Text input is required'],
        warnings: [],
      };
    }

    if (input.length > maxLength) {
      errors.push(`Text exceeds maximum length of ${maxLength} characters`);
    }

    // Remove HTML tags and decode entities
    const sanitized = input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/&/g, '&')
      .replace(/"/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .trim();

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /style\s*=/i,
    ];

    suspiciousPatterns.forEach((pattern) => {
      if (pattern.test(input)) {
        warnings.push('Input contains potentially dangerous content');
      }
    });

    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    };
  }

  /**
   * Validate and sanitize numeric input
   */
  static sanitizeNumber(
    input: unknown,
    options: {
      min?: number;
      max?: number;
      integer?: boolean;
    } = {}
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (input === null || input === undefined || input === '') {
      return { isValid: false, errors: ['Number is required'], warnings: [] };
    }

    const num = Number(input);

    if (isNaN(num)) {
      errors.push('Invalid number format');
      return { isValid: false, errors, warnings: [] };
    }

    if (options.integer && !Number.isInteger(num)) {
      errors.push('Integer value required');
    }

    if (options.min !== undefined && num < options.min) {
      errors.push(`Value must be at least ${options.min}`);
    }

    if (options.max !== undefined && num > options.max) {
      errors.push(`Value must be at most ${options.max}`);
    }

    return {
      isValid: errors.length === 0,
      sanitized: num.toString(),
      errors,
      warnings,
    };
  }

  /**
   * Sanitize filename for safe storage
   */
  static sanitizeFilename(filename: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!filename || typeof filename !== 'string') {
      return { isValid: false, errors: ['Filename is required'], warnings: [] };
    }

    // Remove path traversal attempts
    const sanitized = filename
      .replace(/\.\./g, '') // Remove directory traversal
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
      .replace(/^\.+/, '') // Remove leading dots
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 255); // Limit length

    if (sanitized !== filename) {
      warnings.push('Filename was sanitized for security');
    }

    // Check for dangerous extensions
    const dangerousExtensions = [
      '.exe',
      '.bat',
      '.cmd',
      '.scr',
      '.pif',
      '.com',
    ];
    const ext = sanitized.toLowerCase().substring(sanitized.lastIndexOf('.'));
    if (dangerousExtensions.includes(ext)) {
      errors.push('Dangerous file extension not allowed');
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    };
  }
}

/**
 * XSS Detection and Prevention
 */
export class XSSProtector {
  private static readonly XSS_PATTERNS = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
    /<object[^>]*>[\s\S]*?<\/object>/gi,
    /<embed[^>]*>[\s\S]*?<\/embed>/gi,
    /expression\s*\(/gi,
    /vbscript\s*:/gi,
    /data\s*:\s*text\/html/gi,
  ];

  static detectXSS(input: string): {
    hasXSS: boolean;
    patterns: string[];
    severity: 'low' | 'medium' | 'high';
  } {
    const patterns: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';

    this.XSS_PATTERNS.forEach((pattern) => {
      if (pattern.test(input)) {
        patterns.push(pattern.source);
        // Determine severity based on pattern
        if (
          pattern.source.includes('script') ||
          pattern.source.includes('javascript')
        ) {
          severity = 'high';
        } else if (
          pattern.source.includes('on') ||
          pattern.source.includes('iframe')
        ) {
          severity = severity === 'high' ? 'high' : 'medium';
        }
      }
    });

    return {
      hasXSS: patterns.length > 0,
      patterns,
      severity,
    };
  }

  static sanitizeXSS(input: string): string {
    let sanitized = input;

    // Remove script tags and their content
    sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: and vbscript: URLs
    sanitized = sanitized.replace(/javascript\s*:/gi, '');
    sanitized = sanitized.replace(/vbscript\s*:/gi, '');

    // Remove iframe, object, embed tags
    sanitized = sanitized.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
    sanitized = sanitized.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '');

    // Remove data: URLs that could contain HTML
    sanitized = sanitized.replace(/data\s*:\s*text\/html[^"'\s]*/gi, '');

    return sanitized;
  }
}

/**
 * Input Validation Middleware for Express.js
 */
import type { Request, Response, NextFunction } from 'express';

export class SanitizationMiddleware {
  static sanitizeRequestBody(req: Request, _res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
      // Sanitize all string fields in the request body
      this.sanitizeObject(req.body);
    }
    next();
  }

  static sanitizeRequestQuery(req: Request, _res: Response, next: NextFunction) {
    if (req.query && typeof req.query === 'object') {
      // Sanitize all string fields in query parameters
      this.sanitizeObject(req.query);
    }
    next();
  }

  static sanitizeRequestParams(req: Request, _res: Response, next: NextFunction) {
    if (req.params && typeof req.params === 'object') {
      // Sanitize all string fields in route parameters
      this.sanitizeObject(req.params);
    }
    next();
  }

  private static sanitizeObject(obj: Record<string, unknown>): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Basic XSS protection for all string inputs
        obj[key] = XSSProtector.sanitizeXSS(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively sanitize nested objects
        this.sanitizeObject(obj[key] as Record<string, unknown>);
      }
    }
  }

  static validateAndSanitizeEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (email) {
      const result = InputSanitizer.sanitizeEmail(email);
      if (!result.isValid) {
        return res.status(400).json({
          error: 'Invalid email address',
          details: result.errors,
        });
      }
      req.body.email = result.sanitized;
    }
    next();
  }

  static validateAndSanitizeUrl(req: Request, res: Response, next: NextFunction) {
    const { url } = req.body;
    if (url) {
      const result = InputSanitizer.sanitizeUrl(url);
      if (!result.isValid) {
        return res.status(400).json({
          error: 'Invalid URL',
          details: result.errors,
        });
      }
      req.body.url = result.sanitized;
    }
    next();
  }
}

/**
 * React Hook for Input Sanitization
 */
export function useInputSanitization() {
  const sanitizeHtml = (input: string, options?: SanitizationOptions) =>
    InputSanitizer.sanitizeHtml(input, options);

  const sanitizeText = (input: string, maxLength?: number) =>
    InputSanitizer.sanitizeText(input, maxLength);

  const validateEmail = (email: string) => InputSanitizer.sanitizeEmail(email);

  const validateUrl = (url: string, allowedDomains?: string[]) =>
    InputSanitizer.sanitizeUrl(url, allowedDomains);

  const detectXSS = (input: string) => XSSProtector.detectXSS(input);

  return {
    sanitizeHtml,
    sanitizeText,
    validateEmail,
    validateUrl,
    detectXSS,
  };
}

/**
 * Security Audit Logger
 */
export class SecurityAuditLogger {
  static logSanitizationEvent(
    _type: 'html' | 'text' | 'email' | 'url' | 'xss',
    _original: string,
    _sanitized: string,
    _userId?: string,
    _ipAddress?: string
  ) {
    // Security audit event tracked internally
    // In production, this would send to a logging service
    // Example: sendToLoggingService(event);
  }

  static logXSSAttempt(
    _input: string,
    _patterns: string[],
    _severity: string,
    _userId?: string
  ) {
    // XSS Attempt Detected - logged internally
    // In production, this would trigger alerts
    // Example: sendSecurityAlert(event);
  }
}

// Export default sanitizer instance
export default InputSanitizer;
