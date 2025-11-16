/**
 * Security Headers Configuration for Pureza-Naturalis-V3
 *
 * This module provides comprehensive security headers configuration using helmet.js
 * with environment-specific settings and Content Security Policy (CSP) implementation.
 */

export interface SecurityHeadersConfig {
  environment: 'development' | 'staging' | 'production';
  enableCSP: boolean;
  enableHSTS: boolean;
  enableFrameOptions: boolean;
  enableContentTypeOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
  enableCrossOrigin: boolean;
  cspDirectives?: Record<string, string[]>;
  customHeaders?: Record<string, string>;
}

/**
 * Default CSP directives for different environments
 */
const getCSPDirectives = (environment: string): Record<string, string[]> => {
  const baseDirectives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'"],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
  // Allow framing from self by default. Specific environments (dev/prod)
  // will add trusted map providers and localhost as needed.
  'frame-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  if (environment === 'development') {
    // More permissive for development
    baseDirectives['script-src'].push('http://localhost:*', 'ws://localhost:*');
    baseDirectives['connect-src'].push(
      'http://localhost:*',
      'ws://localhost:*'
    );
    baseDirectives['style-src'].push('http://localhost:*');
    // Allow embedded frames for Google Maps and localhost during development
    baseDirectives['frame-src'].push(
      'https://www.google.com',
      'https://maps.google.com',
      'https://www.google.com/maps',
      'https://www.google.com/maps/embed',
      'http://localhost:*'
    );
  }

  if (environment === 'production') {
    // Stricter for production
    baseDirectives['script-src'] = ["'self'"]; // Remove unsafe-inline in production
    baseDirectives['style-src'] = ["'self'", 'https://fonts.googleapis.com'];
    baseDirectives['upgrade-insecure-requests'] = [];
    // Allow Google Maps embeds in production contact pages
    baseDirectives['frame-src'].push(
      'https://www.google.com',
      'https://maps.google.com',
      'https://www.google.com/maps',
      'https://www.google.com/maps/embed'
    );
  }

  return baseDirectives;
};

/**
 * Create security headers middleware based on environment
 */
export const createSecurityHeaders = (
  config: Partial<SecurityHeadersConfig> = {}
) => {
  const defaultConfig: SecurityHeadersConfig = {
    environment: (process.env.NODE_ENV as 'development' | 'production' | 'staging' | undefined) || 'development',
    enableCSP: true,
    enableHSTS: config.environment === 'production',
    enableFrameOptions: true,
    enableContentTypeOptions: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true,
    enableCrossOrigin: true,
    ...config,
  };

  const middlewares: Array<
    (req: unknown, res: { setHeader: (name: string, value: string) => void }, next: () => void) => void
  > = [];

  // Content Security Policy
  if (defaultConfig.enableCSP) {
    // TODO: Implement CSP middleware using directives from environment and config
    const directives = {
      ...getCSPDirectives(defaultConfig.environment),
      ...defaultConfig.cspDirectives,
    };
    void directives;
  }

  // HTTP Strict Transport Security (HSTS)
  if (defaultConfig.enableHSTS) {
    // TODO: Implement HSTS middleware
  }

  // X-Frame-Options
  if (defaultConfig.enableFrameOptions) {
    // TODO: Implement X-Frame-Options middleware
  }

  // X-Content-Type-Options
  if (defaultConfig.enableContentTypeOptions) {
    // TODO: Implement X-Content-Type-Options middleware
  }

  // Referrer Policy
  if (defaultConfig.enableReferrerPolicy) {
    // TODO: Implement Referrer Policy middleware
  }

  // Permissions Policy (Feature-Policy) - Custom implementation
  middlewares.push((_req, res, next) => {
    const policy = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
      'speaker=()',
      'fullscreen=(self)',
      'autoplay=(self)',
    ].join(', ');
    res.setHeader('Permissions-Policy', policy);
    next();
  });

  // Cross-Origin policies
  if (defaultConfig.enableCrossOrigin) {
    // TODO: Implement Cross-Origin policies middleware
  }

  // Additional security headers

  // Custom headers middleware
  if (defaultConfig.customHeaders) {
    middlewares.push((_req, res, next) => {
      Object.entries(defaultConfig.customHeaders!).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      next();
    });
  }

  return middlewares;
};

/**
 * Environment-specific security configurations
 */
export const securityConfigs = {
  development: {
    environment: 'development' as const,
    enableCSP: true,
    enableHSTS: false,
    enableFrameOptions: true,
    enableContentTypeOptions: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: false, // Disable for easier development
    enableCrossOrigin: false, // Disable for localhost development
  },

  staging: {
    environment: 'staging' as const,
    enableCSP: true,
    enableHSTS: true,
    enableFrameOptions: true,
    enableContentTypeOptions: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true,
    enableCrossOrigin: true,
  },

  production: {
    environment: 'production' as const,
    enableCSP: true,
    enableHSTS: true,
    enableFrameOptions: true,
    enableContentTypeOptions: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true,
    enableCrossOrigin: true,
    cspDirectives: {
      'script-src': ["'self'"], // Stricter CSP for production
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
    },
  },
};

/**
 * Get security headers for current environment
 */
export const getSecurityHeadersForEnvironment = (environment?: string) => {
  const env = environment || process.env.NODE_ENV || 'development';
  const config =
    securityConfigs[env as keyof typeof securityConfigs] ||
    securityConfigs.development;
  return createSecurityHeaders(config);
};

/**
 * Security headers validation utility
 */
export const validateSecurityHeaders = (
  headers: Record<string, string>
): {
  isValid: boolean;
  missing: string[];
  recommendations: string[];
} => {
  const requiredHeaders = [
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
  ];

  const recommendedHeaders = [
    'strict-transport-security',
    'permissions-policy',
    'cross-origin-embedder-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
  ];

  const presentHeaders = Object.keys(headers).map((h) => h.toLowerCase());
  const missing = requiredHeaders.filter((h) => !presentHeaders.includes(h));
  const recommendations = recommendedHeaders.filter(
    (h) => !presentHeaders.includes(h)
  );

  return {
    isValid: missing.length === 0,
    missing,
    recommendations,
  };
};

export default {
  createSecurityHeaders,
  securityConfigs,
  getSecurityHeadersForEnvironment,
  validateSecurityHeaders,
};
