# Security Configuration and Setup Utilities for Pureza-Naturalis-V3

## Overview

This document details the configuration and setup utilities for the comprehensive API security middleware implementation in Pureza-Naturalis-V3. These utilities provide centralized configuration management, environment-specific settings, and easy setup for all security components.

## Configuration Architecture

### Environment-Based Configuration System

```typescript
interface SecurityEnvironmentConfig {
  environment: 'development' | 'staging' | 'production';
  enableAuthentication: boolean;
  enableCSRF: boolean;
  enableValidation: boolean;
  enableSanitization: boolean;
  enableRateLimiting: boolean;
  enableAuditLogging: boolean;
  enableEncryption: boolean;
  enableRequestSigning: boolean;

  // Component-specific configs
  auth: AuthConfig;
  csrf: CSRFConfig;
  validation: ValidationConfig;
  sanitization: SanitizationConfig;
  rateLimit: RateLimitConfig;
  apiClient: ApiClientConfig;
}

interface AuthConfig {
  tokenExpiration: number;
  refreshTokenExpiration: number;
  jwtSecret: string;
  allowedOrigins: string[];
}

interface CSRFConfig {
  tokenExpiration: number;
  cookieName: string;
  headerName: string;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
}

interface ValidationConfig {
  strictMode: boolean;
  customValidators: string[];
  maxRequestSize: number;
  timeout: number;
}

interface SanitizationConfig {
  level: 'strict' | 'moderate' | 'lenient';
  allowedTags: string[];
  allowedAttributes: string[];
  maxLength: number;
  customRules: SanitizationRule[];
}

interface RateLimitConfig {
  enabled: boolean;
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableCircuitBreaker: boolean;
  circuitBreakerThreshold: number;
}
```

## Configuration Factory

### Environment-Specific Configuration Factory

```typescript
class SecurityConfigFactory {
  static createConfig(
    environment: string = process.env.NODE_ENV || 'development'
  ): SecurityEnvironmentConfig {
    const baseConfig = this.getBaseConfig(environment);
    const environmentOverrides = this.getEnvironmentOverrides(environment);

    return this.mergeConfigs(baseConfig, environmentOverrides);
  }

  private static getBaseConfig(
    environment: string
  ): Partial<SecurityEnvironmentConfig> {
    return {
      environment: environment as any,
      enableAuthentication: true,
      enableCSRF: true,
      enableValidation: true,
      enableSanitization: true,
      enableRateLimiting: environment === 'production',
      enableAuditLogging: environment !== 'development',
      enableEncryption: environment === 'production',
      enableRequestSigning: false,

      auth: {
        tokenExpiration: 15 * 60 * 1000, // 15 minutes
        refreshTokenExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days
        jwtSecret:
          process.env.JWT_SECRET || 'default-secret-change-in-production',
        allowedOrigins: [
          'http://localhost:3000',
          'https://pureza-naturalis.com',
        ],
      },

      csrf: {
        tokenExpiration: 60 * 60 * 1000, // 1 hour
        cookieName: 'csrf_token',
        headerName: 'X-CSRF-Token',
        secure: environment === 'production',
        sameSite: 'Lax',
      },

      validation: {
        strictMode: environment === 'production',
        customValidators: [],
        maxRequestSize: 10 * 1024 * 1024, // 10MB
        timeout: 5000,
      },

      sanitization: {
        level: environment === 'production' ? 'strict' : 'moderate',
        allowedTags: [
          'b',
          'i',
          'em',
          'strong',
          'a',
          'p',
          'br',
          'ul',
          'ol',
          'li',
        ],
        allowedAttributes: ['href', 'target', 'src', 'alt', 'title'],
        maxLength: 10000,
        customRules: [],
      },

      rateLimit: {
        enabled: environment === 'production',
        maxRequests: 100,
        windowMs: 15 * 60 * 1000, // 15 minutes
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
      },

      apiClient: {
        baseURL: process.env.REACT_APP_API_URL || '/api',
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000,
        enableCircuitBreaker: true,
        circuitBreakerThreshold: 5,
      },
    };
  }

  private static getEnvironmentOverrides(
    environment: string
  ): Partial<SecurityEnvironmentConfig> {
    const overrides: Record<string, Partial<SecurityEnvironmentConfig>> = {
      development: {
        enableRateLimiting: false,
        enableAuditLogging: false,
        enableEncryption: false,
        validation: {
          strictMode: false,
          timeout: 10000,
        },
        sanitization: {
          level: 'lenient',
        },
      },

      staging: {
        enableRateLimiting: true,
        enableAuditLogging: true,
        rateLimit: {
          maxRequests: 50,
          windowMs: 5 * 60 * 1000, // 5 minutes
        },
      },

      production: {
        enableRateLimiting: true,
        enableAuditLogging: true,
        enableEncryption: true,
        csrf: {
          secure: true,
          sameSite: 'Strict',
        },
        rateLimit: {
          maxRequests: 1000,
          windowMs: 60 * 1000, // 1 minute
        },
        apiClient: {
          timeout: 5000,
          retryAttempts: 2,
        },
      },
    };

    return overrides[environment] || {};
  }

  private static mergeConfigs(
    base: Partial<SecurityEnvironmentConfig>,
    overrides: Partial<SecurityEnvironmentConfig>
  ): SecurityEnvironmentConfig {
    return this.deepMerge(base, overrides) as SecurityEnvironmentConfig;
  }

  private static deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}
```

## Route Configuration System

### Route Registry with Security Rules

```typescript
interface RouteSecurityRule {
  path: string;
  methods: HttpMethod[];
  securityLevel: 'public' | 'authenticated' | 'admin';
  requiresCSRF: boolean;
  validationSchema?: z.ZodSchema;
  rateLimitOverride?: Partial<RateLimitConfig>;
  customMiddleware?: string[];
  metadata?: Record<string, any>;
}

class RouteSecurityRegistry {
  private routes: Map<string, RouteSecurityRule> = new Map();

  registerRoute(rule: RouteSecurityRule): void {
    const key = this.createRouteKey(rule.path, rule.methods);
    this.routes.set(key, rule);
  }

  registerRoutes(rules: RouteSecurityRule[]): void {
    rules.forEach((rule) => this.registerRoute(rule));
  }

  getRouteRule(path: string, method: HttpMethod): RouteSecurityRule | null {
    // Exact match first
    const exactKey = this.createRouteKey(path, [method]);
    if (this.routes.has(exactKey)) {
      return this.routes.get(exactKey)!;
    }

    // Pattern matching for parameterized routes
    for (const [key, rule] of this.routes.entries()) {
      if (this.matchesRoute(key, path, method)) {
        return rule;
      }
    }

    return null;
  }

  private createRouteKey(path: string, methods: HttpMethod[]): string {
    return `${methods.sort().join(',')}:${path}`;
  }

  private matchesRoute(
    key: string,
    requestPath: string,
    method: HttpMethod
  ): boolean {
    const [methods, pattern] = key.split(':');
    if (!methods.includes(method)) return false;

    // Convert route pattern to regex
    const regexPattern = pattern
      .replace(/:\w+/g, '([^/]+)') // Replace :param with capture group
      .replace(/\*/g, '.*'); // Replace * with wildcard

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(requestPath);
  }

  getAllRoutes(): RouteSecurityRule[] {
    return Array.from(this.routes.values());
  }

  clearRoutes(): void {
    this.routes.clear();
  }
}
```

### Predefined Route Configurations

```typescript
const defaultRouteRules: RouteSecurityRule[] = [
  // Public routes
  {
    path: '/api/products',
    methods: ['GET'],
    securityLevel: 'public',
    requiresCSRF: false,
  },
  {
    path: '/api/products/:id',
    methods: ['GET'],
    securityLevel: 'public',
    requiresCSRF: false,
  },
  {
    path: '/api/blog',
    methods: ['GET'],
    securityLevel: 'public',
    requiresCSRF: false,
  },
  {
    path: '/api/services',
    methods: ['GET'],
    securityLevel: 'public',
    requiresCSRF: false,
  },

  // Authentication routes
  {
    path: '/api/auth/login',
    methods: ['POST'],
    securityLevel: 'public',
    requiresCSRF: true,
    validationSchema: loginSchema,
  },
  {
    path: '/api/auth/register',
    methods: ['POST'],
    securityLevel: 'public',
    requiresCSRF: true,
    validationSchema: registerSchema,
  },
  {
    path: '/api/auth/refresh',
    methods: ['POST'],
    securityLevel: 'public',
    requiresCSRF: false,
  },

  // User routes
  {
    path: '/api/user/profile',
    methods: ['GET', 'PUT'],
    securityLevel: 'authenticated',
    requiresCSRF: true,
    validationSchema: userProfileSchema,
  },
  {
    path: '/api/user/addresses',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    securityLevel: 'authenticated',
    requiresCSRF: true,
    validationSchema: addressSchema,
  },

  // Cart routes
  {
    path: '/api/cart',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    securityLevel: 'authenticated',
    requiresCSRF: true,
    validationSchema: cartSchema,
    rateLimitOverride: {
      maxRequests: 50,
      windowMs: 5 * 60 * 1000, // 5 minutes
    },
  },

  // Checkout routes
  {
    path: '/api/checkout',
    methods: ['POST'],
    securityLevel: 'authenticated',
    requiresCSRF: true,
    validationSchema: checkoutSchema,
    rateLimitOverride: {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
  },

  // Admin routes
  {
    path: '/api/admin/*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    securityLevel: 'admin',
    requiresCSRF: true,
    rateLimitOverride: {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
    },
  },

  // File upload routes
  {
    path: '/api/upload',
    methods: ['POST'],
    securityLevel: 'authenticated',
    requiresCSRF: true,
    customMiddleware: ['FileValidationMiddleware'],
    rateLimitOverride: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
  },
];
```

## Setup Utilities

### Security Bootstrapper

```typescript
class SecurityBootstrapper {
  private config: SecurityEnvironmentConfig;
  private routeRegistry: RouteSecurityRegistry;

  constructor() {
    this.config = SecurityConfigFactory.createConfig();
    this.routeRegistry = new RouteSecurityRegistry();
  }

  async initialize(): Promise<SecurityOrchestrator> {
    // Register default routes
    this.routeRegistry.registerRoutes(defaultRouteRules);

    // Allow custom route registration
    await this.loadCustomRoutes();

    // Create security orchestrator
    const orchestrator = new SecurityOrchestrator({
      enableAuthentication: this.config.enableAuthentication,
      enableCSRF: this.config.enableCSRF,
      enableValidation: this.config.enableValidation,
      enableSanitization: this.config.enableSanitization,
      enableRateLimiting: this.config.enableRateLimiting,
      enableAuditLogging: this.config.enableAuditLogging,
    });

    // Register routes with orchestrator
    this.registerRoutesWithOrchestrator(orchestrator);

    // Setup API client
    this.setupSecureApiClient();

    // Setup React integration
    this.setupReactIntegration(orchestrator);

    return orchestrator;
  }

  private async loadCustomRoutes(): Promise<void> {
    try {
      // Load custom routes from config file
      const customRoutes = await import('./customRoutes');
      if (customRoutes.default) {
        this.routeRegistry.registerRoutes(customRoutes.default);
      }
    } catch (error) {
      console.warn('No custom routes found, using defaults only');
    }
  }

  private registerRoutesWithOrchestrator(
    orchestrator: SecurityOrchestrator
  ): void {
    const routes = this.routeRegistry.getAllRoutes();
    routes.forEach((route) => {
      orchestrator.registerRoute({
        path: route.path,
        methods: route.methods,
        config: {
          securityLevel: route.securityLevel,
          requiresCSRF: route.requiresCSRF,
          validationSchema: route.validationSchema,
          rateLimit: route.rateLimitOverride,
          customMiddleware: route.customMiddleware,
        },
      });
    });
  }

  private setupSecureApiClient(): void {
    const apiClient = new SecureApiClient({
      baseURL: this.config.apiClient.baseURL,
      timeout: this.config.apiClient.timeout,
      retryConfig: {
        maxRetries: this.config.apiClient.retryAttempts,
        baseDelay: this.config.apiClient.retryDelay,
        maxDelay: this.config.apiClient.retryDelay * 4,
        backoffFactor: 2,
        retryableErrors: ['NETWORK', 'SERVER', 'TIMEOUT'],
      },
      securityConfig: {
        enableEncryption: this.config.enableEncryption,
        validateContentType: true,
        enableRequestSigning: this.config.enableRequestSigning,
        trustedDomains: this.config.auth.allowedOrigins,
      },
      rateLimitConfig: this.config.rateLimit,
    });

    // Make API client globally available
    (window as any).secureApiClient = apiClient;
  }

  private setupReactIntegration(orchestrator: SecurityOrchestrator): void {
    // This would be called in the React app's entry point
    // Setup would include providing security context, etc.
  }
}
```

### Configuration Validation

```typescript
class ConfigValidator {
  static validateConfig(config: SecurityEnvironmentConfig): ValidationResult {
    const errors: string[] = [];

    // Validate authentication config
    if (config.enableAuthentication) {
      if (!config.auth.jwtSecret || config.auth.jwtSecret.length < 32) {
        errors.push('JWT secret must be at least 32 characters long');
      }
      if (config.auth.allowedOrigins.length === 0) {
        errors.push('At least one allowed origin must be specified');
      }
    }

    // Validate CSRF config
    if (config.enableCSRF) {
      if (!config.csrf.cookieName || config.csrf.cookieName.length === 0) {
        errors.push('CSRF cookie name must be specified');
      }
      if (!config.csrf.headerName || config.csrf.headerName.length === 0) {
        errors.push('CSRF header name must be specified');
      }
    }

    // Validate rate limiting config
    if (config.enableRateLimiting) {
      if (config.rateLimit.maxRequests <= 0) {
        errors.push('Rate limit max requests must be greater than 0');
      }
      if (config.rateLimit.windowMs <= 0) {
        errors.push('Rate limit window must be greater than 0');
      }
    }

    // Validate API client config
    if (config.apiClient.timeout <= 0) {
      errors.push('API client timeout must be greater than 0');
    }
    if (config.apiClient.retryAttempts < 0) {
      errors.push('API client retry attempts cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

## Environment Variable Integration

### Environment Variable Loader

```typescript
class EnvironmentLoader {
  static loadSecurityConfig(): Partial<SecurityEnvironmentConfig> {
    return {
      enableAuthentication: this.parseBoolean(process.env.SECURITY_AUTH),
      enableCSRF: this.parseBoolean(process.env.SECURITY_CSRF),
      enableValidation: this.parseBoolean(process.env.SECURITY_VALIDATION),
      enableSanitization: this.parseBoolean(process.env.SECURITY_SANITIZATION),
      enableRateLimiting: this.parseBoolean(process.env.SECURITY_RATE_LIMIT),
      enableAuditLogging: this.parseBoolean(process.env.SECURITY_AUDIT_LOG),
      enableEncryption: this.parseBoolean(process.env.SECURITY_ENCRYPTION),
      enableRequestSigning: this.parseBoolean(
        process.env.SECURITY_REQUEST_SIGNING
      ),

      auth: {
        jwtSecret: process.env.JWT_SECRET,
        allowedOrigins: this.parseArray(process.env.SECURITY_ALLOWED_ORIGINS),
      },

      csrf: {
        secure: this.parseBoolean(process.env.CSRF_SECURE),
        sameSite:
          (process.env.CSRF_SAME_SITE as 'Strict' | 'Lax' | 'None') || 'Lax',
      },

      rateLimit: {
        maxRequests: this.parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS),
        windowMs: this.parseNumber(process.env.RATE_LIMIT_WINDOW_MS),
      },

      apiClient: {
        baseURL: process.env.REACT_APP_API_URL,
        timeout: this.parseNumber(process.env.API_CLIENT_TIMEOUT),
        retryAttempts: this.parseNumber(process.env.API_CLIENT_RETRY_ATTEMPTS),
      },
    };
  }

  private static parseBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true';
  }

  private static parseNumber(value: string | undefined): number | undefined {
    if (value === undefined) return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  private static parseArray(value: string | undefined): string[] | undefined {
    if (value === undefined) return undefined;
    return value.split(',').map((item) => item.trim());
  }
}
```

## CLI Setup Utility

### Security Setup Command

```typescript
class SecuritySetupCLI {
  static async setup(): Promise<void> {
    console.log('🔒 Setting up Pureza-Naturalis-V3 Security...\n');

    // Detect environment
    const environment = await this.detectEnvironment();
    console.log(`Environment detected: ${environment}`);

    // Validate configuration
    const config = SecurityConfigFactory.createConfig(environment);
    const validation = ConfigValidator.validateConfig(config);

    if (!validation.isValid) {
      console.error('❌ Configuration validation failed:');
      validation.errors.forEach((error) => console.error(`  - ${error}`));
      process.exit(1);
    }

    console.log('✅ Configuration validation passed');

    // Initialize security bootstrapper
    const bootstrapper = new SecurityBootstrapper();
    await bootstrapper.initialize();

    console.log('✅ Security system initialized successfully');

    // Generate security report
    await this.generateSecurityReport(config);

    console.log('\n🎉 Security setup complete!');
    console.log(
      'Your API is now protected with comprehensive security middleware.'
    );
  }

  private static async detectEnvironment(): Promise<string> {
    // Check for environment indicators
    if (process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }

    // Check for production indicators
    if (process.env.PORT || process.env.NODE_ENV === 'production') {
      return 'production';
    }

    // Check for staging indicators
    if (process.env.CI || process.env.STAGING) {
      return 'staging';
    }

    return 'development';
  }

  private static async generateSecurityReport(
    config: SecurityEnvironmentConfig
  ): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      environment: config.environment,
      enabledFeatures: {
        authentication: config.enableAuthentication,
        csrf: config.enableCSRF,
        validation: config.enableValidation,
        sanitization: config.enableSanitization,
        rateLimiting: config.enableRateLimiting,
        auditLogging: config.enableAuditLogging,
        encryption: config.enableEncryption,
        requestSigning: config.enableRequestSigning,
      },
      keyConfigurations: {
        jwtExpiration: `${config.auth.tokenExpiration / 1000 / 60} minutes`,
        csrfExpiration: `${config.csrf.tokenExpiration / 1000 / 60} minutes`,
        rateLimit: config.enableRateLimiting
          ? `${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs / 1000 / 60} minutes`
          : 'Disabled',
        apiTimeout: `${config.apiClient.timeout}ms`,
        retryAttempts: config.apiClient.retryAttempts,
      },
    };

    // Write report to file
    const fs = require('fs');
    const path = require('path');

    const reportPath = path.join(process.cwd(), 'security-setup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Security report generated: ${reportPath}`);
  }
}

// CLI entry point
if (require.main === module) {
  SecuritySetupCLI.setup().catch((error) => {
    console.error('❌ Security setup failed:', error);
    process.exit(1);
  });
}
```

## Usage Examples

### Basic Setup

```typescript
import { SecurityBootstrapper } from './utils/security/SecurityBootstrapper';

// Initialize security system
const bootstrapper = new SecurityBootstrapper();
const orchestrator = await bootstrapper.initialize();

// Use in React app
function App() {
  return (
    <SecurityProvider orchestrator={orchestrator}>
      <YourApp />
    </SecurityProvider>
  );
}
```

### Custom Configuration

```typescript
import { SecurityConfigFactory } from './utils/security/SecurityConfigFactory';

// Create custom config
const customConfig = SecurityConfigFactory.createConfig('production');

// Override specific settings
customConfig.rateLimit.maxRequests = 500;
customConfig.apiClient.timeout = 15000;

// Use custom config
const orchestrator = new SecurityOrchestrator(customConfig);
```

### CLI Usage

```bash
# Setup security for current environment
npm run security:setup

# Setup for specific environment
NODE_ENV=production npm run security:setup

# Generate security report only
npm run security:report
```

This comprehensive configuration and setup utility system provides everything needed to easily configure, initialize, and manage the security middleware for Pureza-Naturalis-V3 across different environments and use cases.
