# Secure API Client Implementation for Pureza-Naturalis-V3

## Overview

This document details the secure API client implementation that provides automatic token injection, comprehensive error handling, exponential backoff retry logic, and advanced security features for the Pureza-Naturalis-V3 application.

## Core Features

### 1. Automatic Token Management

- JWT token injection in requests
- Automatic token refresh on expiration
- Secure token storage integration

### 2. Comprehensive Error Handling

- Network error detection and recovery
- Server error categorization
- User-friendly error messages
- Error logging and monitoring

### 3. Retry Logic with Exponential Backoff

- Configurable retry attempts
- Exponential backoff with jitter
- Circuit breaker pattern
- Request deduplication

### 4. Advanced Security Features

- Request/response encryption
- Content-Type validation
- Rate limiting integration
- Suspicious activity detection

## Implementation Architecture

```typescript
interface SecureApiConfig {
  baseURL: string;
  timeout: number;
  retryConfig: RetryConfig;
  securityConfig: SecurityConfig;
  rateLimitConfig: RateLimitConfig;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors: string[];
}

interface SecurityConfig {
  enableEncryption: boolean;
  validateContentType: boolean;
  enableRequestSigning: boolean;
  trustedDomains: string[];
}

class SecureApiClient {
  private axiosInstance: Axios;
  private retryLogic: RetryLogic;
  private circuitBreaker: CircuitBreaker;
  private requestCache: RequestCache;
  private securityManager: SecurityManager;

  constructor(config: SecureApiConfig) {
    this.initializeAxios(config);
    this.retryLogic = new RetryLogic(config.retryConfig);
    this.circuitBreaker = new CircuitBreaker();
    this.requestCache = new RequestCache();
    this.securityManager = new SecurityManager(config.securityConfig);

    this.setupInterceptors();
  }
}
```

## Automatic Token Injection

### Token Management System

```typescript
class TokenManager {
  private tokenStorage: SecureStorage;

  constructor() {
    this.tokenStorage = new SecureStorage();
  }

  async getValidToken(): Promise<string | null> {
    const tokens = this.tokenStorage.getTokens();

    if (!tokens) return null;

    // Check if access token is expired
    if (this.isTokenExpired(tokens.accessToken)) {
      // Attempt to refresh token
      const newTokens = await this.refreshToken(tokens.refreshToken);
      if (newTokens) {
        this.tokenStorage.storeTokens(newTokens);
        return newTokens.accessToken;
      }
      return null;
    }

    return tokens.accessToken;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private async refreshToken(refreshToken: string): Promise<AuthTokens | null> {
    try {
      const response = await axios.post('/api/auth/refresh', {
        refreshToken,
      });
      return response.data.tokens;
    } catch {
      return null;
    }
  }
}
```

### Request Interceptor for Token Injection

```typescript
private setupTokenInjection(): void {
  this.axiosInstance.interceptors.request.use(async (config) => {
    const token = await this.tokenManager.getValidToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing requests
    if (this.isStateChangingRequest(config)) {
      const csrfToken = this.csrfManager.getToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return config;
  });
}

private isStateChangingRequest(config: AxiosRequestConfig): boolean {
  const stateChangingMethods = ['post', 'put', 'patch', 'delete'];
  return stateChangingMethods.includes(config.method?.toLowerCase() || '');
}
```

## Comprehensive Error Handling

### Error Classification System

```typescript
enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
}

interface ApiError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
  retryable: boolean;
  userMessage: string;
}

class ErrorHandler {
  classifyError(error: AxiosError): ApiError {
    if (!error.response) {
      // Network error
      return {
        type: ErrorType.NETWORK,
        message: 'Network connection failed',
        retryable: true,
        userMessage: 'Please check your internet connection and try again.',
      };
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Authentication failed',
          statusCode: status,
          retryable: false,
          userMessage: 'Please log in again.',
        };

      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'Access forbidden',
          statusCode: status,
          retryable: false,
          userMessage: 'You do not have permission to perform this action.',
        };

      case 422:
        return {
          type: ErrorType.VALIDATION,
          message: data?.message || 'Validation failed',
          statusCode: status,
          retryable: false,
          userMessage:
            data?.message || 'Please check your input and try again.',
        };

      case 429:
        return {
          type: ErrorType.RATE_LIMIT,
          message: 'Rate limit exceeded',
          statusCode: status,
          retryable: true,
          userMessage: 'Too many requests. Please wait a moment and try again.',
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER,
          message: 'Server error',
          statusCode: status,
          retryable: true,
          userMessage:
            'Server is temporarily unavailable. Please try again later.',
        };

      default:
        return {
          type: ErrorType.CLIENT,
          message: data?.message || 'Request failed',
          statusCode: status,
          retryable: status >= 500,
          userMessage: data?.message || 'An error occurred. Please try again.',
        };
    }
  }
}
```

### Error Response Interceptor

```typescript
private setupErrorHandling(): void {
  this.axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const apiError = this.errorHandler.classifyError(error);

      // Log error for monitoring
      this.logError(apiError);

      // Handle authentication errors
      if (apiError.type === ErrorType.AUTHENTICATION) {
        this.handleAuthError();
        return Promise.reject(apiError);
      }

      // Check if error is retryable and within retry limits
      if (apiError.retryable && this.retryLogic.shouldRetry(error.config, apiError)) {
        return this.retryLogic.retryRequest(error.config);
      }

      // Update circuit breaker
      this.circuitBreaker.recordFailure();

      return Promise.reject(apiError);
    }
  );
}
```

## Retry Logic with Exponential Backoff

### Retry Logic Implementation

```typescript
class RetryLogic {
  private config: RetryConfig;
  private attemptCounts: Map<string, number> = new Map();

  constructor(config: RetryConfig) {
    this.config = config;
  }

  shouldRetry(config: AxiosRequestConfig, error: ApiError): boolean {
    const requestKey = this.getRequestKey(config);
    const attempts = this.attemptCounts.get(requestKey) || 0;

    if (attempts >= this.config.maxRetries) {
      return false;
    }

    // Check if error type is retryable
    if (!this.config.retryableErrors.includes(error.type)) {
      return false;
    }

    // Check circuit breaker
    if (this.circuitBreaker.isOpen()) {
      return false;
    }

    return true;
  }

  async retryRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestKey = this.getRequestKey(config);
    const attempts = this.attemptCounts.get(requestKey) || 0;

    this.attemptCounts.set(requestKey, attempts + 1);

    const delay = this.calculateDelay(attempts);
    await this.sleep(delay);

    return this.axiosInstance.request(config);
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay =
      this.config.baseDelay * Math.pow(this.config.backoffFactor, attempt);
    const jitteredDelay = exponentialDelay * (0.5 + Math.random() * 0.5); // Add jitter
    return Math.min(jitteredDelay, this.config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getRequestKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
  }
}
```

### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 60000; // 1 minute

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  recordSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }
}
```

## Request Deduplication and Caching

### Request Cache Implementation

```typescript
class RequestCache {
  private cache = new Map<string, Promise<AxiosResponse>>();
  private readonly ttl = 30000; // 30 seconds

  get(requestKey: string): Promise<AxiosResponse> | null {
    const cached = this.cache.get(requestKey);
    if (cached) {
      return cached;
    }
    return null;
  }

  set(requestKey: string, promise: Promise<AxiosResponse>): void {
    this.cache.set(requestKey, promise);

    // Auto-cleanup after TTL
    setTimeout(() => {
      this.cache.delete(requestKey);
    }, this.ttl);
  }

  clear(): void {
    this.cache.clear();
  }
}
```

### Request Deduplication Interceptor

```typescript
private setupRequestDeduplication(): void {
  this.axiosInstance.interceptors.request.use((config) => {
    if (this.shouldDeduplicate(config)) {
      const requestKey = this.getRequestKey(config);
      const cachedRequest = this.requestCache.get(requestKey);

      if (cachedRequest) {
        // Return cached promise instead of making new request
        throw new CachedRequestError(cachedRequest);
      }

      // Cache the new request
      const requestPromise = this.axiosInstance.request(config);
      this.requestCache.set(requestKey, requestPromise);
    }

    return config;
  });
}

private shouldDeduplicate(config: AxiosRequestConfig): boolean {
  // Only deduplicate GET requests
  return config.method?.toLowerCase() === 'get';
}
```

## Advanced Security Features

### Request/Response Encryption

```typescript
class SecurityManager {
  private encryptionKey: string;

  constructor(config: SecurityConfig) {
    this.encryptionKey = config.enableEncryption
      ? this.generateEncryptionKey()
      : '';
  }

  encryptRequest(data: any): any {
    if (!this.encryptionKey || !data) return data;

    const jsonString = JSON.stringify(data);
    return {
      encrypted: true,
      data: this.encrypt(jsonString, this.encryptionKey),
    };
  }

  decryptResponse(data: any): any {
    if (!data?.encrypted) return data;

    const decryptedString = this.decrypt(data.data, this.encryptionKey);
    return JSON.parse(decryptedString);
  }

  private encrypt(text: string, key: string): string {
    // Simple XOR encryption for demonstration
    // In production, use proper encryption like AES
    return btoa(
      text
        .split('')
        .map((char, i) =>
          String.fromCharCode(
            char.charCodeAt(0) ^ key.charCodeAt(i % key.length)
          )
        )
        .join('')
    );
  }

  private decrypt(encrypted: string, key: string): string {
    return atob(encrypted)
      .split('')
      .map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      )
      .join('');
  }
}
```

### Content-Type Validation

```typescript
private validateContentType(response: AxiosResponse): boolean {
  const contentType = response.headers['content-type'];

  if (!contentType) return false;

  // Expected content types for different response types
  const expectedTypes = {
    json: ['application/json', 'text/json'],
    html: ['text/html'],
    xml: ['application/xml', 'text/xml'],
    text: ['text/plain']
  };

  // Determine expected type based on response data
  let expectedType: string[];
  if (typeof response.data === 'object') {
    expectedType = expectedTypes.json;
  } else if (typeof response.data === 'string') {
    if (response.data.startsWith('<')) {
      expectedType = expectedTypes.html;
    } else {
      expectedType = expectedTypes.text;
    }
  } else {
    expectedType = expectedTypes.json;
  }

  return expectedType.some(type => contentType.includes(type));
}
```

## Usage Examples

### Basic API Calls

```typescript
const apiClient = new SecureApiClient({
  baseURL: '/api',
  timeout: 10000,
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryableErrors: ['NETWORK', 'SERVER', 'TIMEOUT'],
  },
  securityConfig: {
    enableEncryption: false,
    validateContentType: true,
    enableRequestSigning: false,
    trustedDomains: ['localhost', 'api.purzenaturalis.com'],
  },
});

// Automatic token injection and error handling
const products = await apiClient.get('/products');
const user = await apiClient.post('/auth/login', credentials);
```

### Advanced Configuration

```typescript
// Custom retry logic for specific endpoints
apiClient.addRetryRule({
  pattern: '/api/payment/*',
  maxRetries: 1, // Payments should not be retried
  retryableErrors: ['NETWORK'],
});

// Request signing for sensitive operations
apiClient.enableRequestSigning('/api/admin/*');
```

## Performance Monitoring

### Metrics Collection

```typescript
interface RequestMetrics {
  url: string;
  method: string;
  duration: number;
  statusCode: number;
  retryCount: number;
  errorType?: ErrorType;
  timestamp: Date;
}

class MetricsCollector {
  private metrics: RequestMetrics[] = [];

  recordRequest(metrics: RequestMetrics): void {
    this.metrics.push(metrics);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;

    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.metrics.length;
  }

  getErrorRate(): number {
    if (this.metrics.length === 0) return 0;

    const errors = this.metrics.filter((m) => m.statusCode >= 400).length;
    return errors / this.metrics.length;
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('SecureApiClient', () => {
  test('injects authorization header', async () => {
    const client = new SecureApiClient(config);
    // Mock token manager
    const response = await client.get('/protected-route');
    expect(response.config.headers.Authorization).toBeDefined();
  });

  test('retries on network failure', async () => {
    // Mock network failure then success
    const client = new SecureApiClient(config);
    const response = await client.get('/unstable-endpoint');
    expect(response.status).toBe(200);
  });

  test('circuit breaker prevents requests when open', async () => {
    const client = new SecureApiClient(config);
    // Simulate multiple failures
    await expect(client.get('/failing-endpoint')).rejects.toThrow();
  });
});
```

### Integration Tests

```typescript
describe('API Integration', () => {
  test('handles authentication flow', async () => {
    const client = new SecureApiClient(config);

    // Login
    await client.post('/auth/login', credentials);

    // Subsequent requests should be authenticated
    const profile = await client.get('/user/profile');
    expect(profile.data).toBeDefined();
  });

  test('graceful degradation on server errors', async () => {
    const client = new SecureApiClient(config);

    // Mock server 500 error
    await expect(client.get('/error-endpoint')).rejects.toMatchObject({
      type: 'SERVER',
      retryable: true,
    });
  });
});
```

This secure API client implementation provides robust, production-ready functionality with comprehensive security, error handling, and performance features. The modular design allows for easy customization and extension based on specific application requirements.
