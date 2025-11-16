/**
 * Content Security Policy (CSP) Configuration
 * Comprehensive CSP implementation for XSS prevention and security hardening
 */

export interface CSPDirective {
  [key: string]: string[] | string;
}

export interface CSPConfig {
  directives: CSPDirective;
  reportUri?: string;
  reportOnly?: boolean;
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
}

export interface CSPViolation {
  'csp-report': {
    'document-uri': string;
    referrer: string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'blocked-uri': string;
    'status-code': number;
    'script-sample'?: string;
    'line-number'?: number;
    'column-number'?: number;
    'source-file'?: string;
  };
}

/**
 * Strict CSP configuration for production
 */
export const strictCSPConfig: CSPConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for React development, remove in production
      'https://cdn.jsdelivr.net',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components, consider removing
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://images.unsplash.com',
      'https://*.purezanaturalis.com',
    ],
    'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    'connect-src': [
      "'self'",
      'https://api.stripe.com',
      'https://*.purezanaturalis.com',
      'https://www.google-analytics.com',
      'wss://ws.purezanaturalis.com',
    ],
    'media-src': ["'self'", 'https://*.purezanaturalis.com', 'blob:'],
    'object-src': ["'none'"],
  // Allow embedding trusted map providers (Google Maps) for contact pages
  'frame-src': ["'self'", 'https://www.google.com', 'https://maps.google.com', 'https://www.google.com/maps', 'https://www.google.com/maps/embed'],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'", 'https://*.purezanaturalis.com'],
    'base-uri': ["'self'"],
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': [],
  },
  reportUri: '/api/security/csp-report',
  reportOnly: false,
  upgradeInsecureRequests: true,
  blockAllMixedContent: true,
};

/**
 * Development CSP configuration (more permissive)
 */
export const developmentCSPConfig: CSPConfig = {
  directives: {
    'default-src': ["'self'", "'unsafe-eval'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://cdn.jsdelivr.net',
      'http://localhost:*',
      'ws://localhost:*',
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http://localhost:*'],
    'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    'connect-src': [
      "'self'",
      'https://api.stripe.com',
      'http://localhost:*',
      'ws://localhost:*',
      'https://www.google-analytics.com',
    ],
    'media-src': ["'self'", 'blob:', 'http://localhost:*'],
    'object-src': ["'none'"],
  // Development: allow framing Google Maps and localhost frames for testing
  'frame-src': ["'self'", 'https://www.google.com', 'https://maps.google.com', 'https://www.google.com/maps', 'https://www.google.com/maps/embed', 'http://localhost:*'],
  'frame-ancestors': ["'none'"],
    'form-action': ["'self'", 'http://localhost:*'],
    'base-uri': ["'self'"],
  },
  reportUri: '/api/security/csp-report',
  reportOnly: true, // Report-only in development
  upgradeInsecureRequests: false,
  blockAllMixedContent: false,
};

/**
 * Get CSP configuration based on environment
 */
export function getCSPConfig(): CSPConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? strictCSPConfig : developmentCSPConfig;
}

/**
 * Generate CSP header string from configuration
 */
export function generateCSPHeader(config: CSPConfig = getCSPConfig()): string {
  const directives = config.directives;
  const parts: string[] = [];

  // Process each directive
  Object.entries(directives).forEach(([directive, values]) => {
    if (Array.isArray(values)) {
      if (values.length > 0) {
        parts.push(`${directive} ${values.join(' ')}`);
      }
    } else if (typeof values === 'string') {
      parts.push(`${directive} ${values}`);
    }
  });

  // Add special directives
  if (config.upgradeInsecureRequests) {
    parts.push('upgrade-insecure-requests');
  }

  if (config.blockAllMixedContent) {
    parts.push('block-all-mixed-content');
  }

  if (config.reportUri) {
    parts.push(`report-uri ${config.reportUri}`);
  }

  return parts.join('; ');
}

/**
 * CSP Middleware for Express.js
 */
export class CSPMiddleware {
  private config: CSPConfig;

  constructor(config?: CSPConfig) {
    this.config = config || getCSPConfig();
  }

  applyCSP(_req: Record<string, any>, res: Record<string, any>, next: () => void) {
    const cspHeader = generateCSPHeader(this.config);
    if (this.config.reportOnly) {
      if (typeof res.setHeader === 'function') {
        res.setHeader('Content-Security-Policy-Report-Only', cspHeader);
      }
    } else {
      if (typeof res.setHeader === 'function') {
        res.setHeader('Content-Security-Policy', cspHeader);
      }
    }
    if (typeof next === 'function') next();
  }

  handleCSPViolation(req: { body: any }, res: { status: (code: number) => { end: () => void } }) {
    const violation: CSPViolation = req.body;
    console.warn('CSP Violation:', {
      documentUri: violation['csp-report']['document-uri'],
      violatedDirective: violation['csp-report']['violated-directive'],
      blockedUri: violation['csp-report']['blocked-uri'],
      sourceFile: violation['csp-report']['source-file'],
      lineNumber: violation['csp-report']['line-number'],
      timestamp: new Date().toISOString(),
    });
    // Log to monitoring service
    type GtagFn = (event: string, action: string, params: Record<string, unknown>) => void;
    const win = window as unknown as { gtag?: GtagFn };
    if (typeof window !== 'undefined' && typeof win.gtag === 'function') {
      win.gtag('event', 'csp_violation', {
        event_category: 'Security',
        event_label: violation['csp-report']['violated-directive'],
        value: 1,
      });
    }
    if (typeof res.status === 'function' && typeof res.status(204).end === 'function') {
      res.status(204).end(); // No content response
    }
  }
}

/**
 * CSP Nonce Generator for inline scripts/styles
 */
export class CSPNonceGenerator {
  private static nonces = new Map<string, string>();

  static generateNonce(): string {
    const nonce = this.generateRandomString(32);
    const id = Math.random().toString(36).substr(2, 9);
    this.nonces.set(id, nonce);
    return nonce;
  }

  static getNonce(id: string): string | undefined {
    return this.nonces.get(id);
  }

  static clearNonce(id: string): void {
    this.nonces.delete(id);
  }

  private static generateRandomString(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * CSP Policy Builder for dynamic policies
 */
export class CSPPolicyBuilder {
  private directives: CSPDirective = {};

  addDirective(directive: string, values: string[] | string): this {
    if (Array.isArray(values)) {
      this.directives[directive] = values;
    } else {
      this.directives[directive] = values;
    }
    return this;
  }

  allowSelf(directive: string): this {
    return this.addDirective(directive, ["'self'"]);
  }

  allowInline(directive: string): this {
    const current = (this.directives[directive] as string[]) || [];
    return this.addDirective(directive, [...current, "'unsafe-inline'"]);
  }

  allowEval(directive: string): this {
    const current = (this.directives[directive] as string[]) || [];
    return this.addDirective(directive, [...current, "'unsafe-eval'"]);
  }

  allowDomains(directive: string, domains: string[]): this {
    const current = (this.directives[directive] as string[]) || [];
    return this.addDirective(directive, [...current, ...domains]);
  }

  setReportUri(uri: string): this {
    this.directives['report-uri'] = uri;
    return this;
  }

  build(): CSPConfig {
    return {
      directives: this.directives,
      reportUri: this.directives['report-uri'] as string,
      reportOnly: false,
      upgradeInsecureRequests: false,
      blockAllMixedContent: false,
    };
  }
}

/**
 * CSP Violation Analyzer
 */
export class CSPViolationAnalyzer {
  static analyzeViolation(violation: CSPViolation): {
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
    blockedResource: string;
  } {
    const report = violation['csp-report'];
    const directive = report['violated-directive'];
    const blockedUri = report['blocked-uri'];

    // Analyze based on directive and blocked resource
    if (directive.includes('script-src') && blockedUri.includes('eval')) {
      return {
        severity: 'critical',
        recommendation:
          "Remove eval() usage or add 'unsafe-eval' to script-src (not recommended)",
        blockedResource: blockedUri,
      };
    }

    if (directive.includes('script-src') && blockedUri.includes('inline')) {
      return {
        severity: 'high',
        recommendation:
          'Move inline scripts to external files or use nonces/hashes',
        blockedResource: blockedUri,
      };
    }

    if (directive.includes('style-src') && blockedUri.includes('inline')) {
      return {
        severity: 'medium',
        recommendation:
          'Move inline styles to external files or use nonces/hashes',
        blockedResource: blockedUri,
      };
    }

    if (directive.includes('img-src') || directive.includes('connect-src')) {
      return {
        severity: 'low',
        recommendation: 'Add the domain to the appropriate CSP directive',
        blockedResource: blockedUri,
      };
    }

    return {
      severity: 'medium',
      recommendation: 'Review and update CSP policy',
      blockedResource: blockedUri,
    };
  }
}

/**
 * React Hook for CSP Nonce Management
 */
export function useCSPNonce(): string {
  // In a real implementation, this would integrate with the server-side nonce generation
  // For now, return a placeholder
  return 'placeholder-nonce-for-development';
}

/**
 * CSP Testing Utilities
 */
export class CSPTester {
  static testCSPHeader(header: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for dangerous directives
    if (header.includes("'unsafe-inline'")) {
      issues.push(
        "CSP allows 'unsafe-inline' - consider using nonces or hashes"
      );
    }

    if (header.includes("'unsafe-eval'")) {
      issues.push("CSP allows 'unsafe-eval' - remove eval() usage");
    }

    if (!header.includes('report-uri')) {
      issues.push('CSP missing report-uri directive');
    }

    if (!header.includes('default-src')) {
      issues.push('CSP missing default-src directive');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  static generateSecureCSP(): string {
    const builder = new CSPPolicyBuilder();

    return generateCSPHeader(
      builder
        .allowSelf('default-src')
        .allowSelf('script-src')
        .allowSelf('style-src')
        .allowSelf('img-src')
        .allowSelf('font-src')
        .allowSelf('connect-src')
        .addDirective('object-src', ["'none'"])
        .addDirective('frame-src', ["'none'"])
        .addDirective('base-uri', ["'self'"])
        .setReportUri('/api/security/csp-report')
        .build()
    );
  }
}

// Export default configuration
export default getCSPConfig();
