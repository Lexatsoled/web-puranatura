# CSRF Protection Implementation for Pureza-Naturalis-V3

## Overview

This document details the CSRF (Cross-Site Request Forgery) protection implementation for the Pureza-Naturalis-V3 API security middleware.

## CSRF Attack Vector

CSRF attacks occur when an attacker tricks a user into performing unwanted actions on a web application where they're authenticated. The attack exploits the fact that web browsers automatically include cookies with requests.

## Protection Strategy

We'll implement a **Double-Submit Cookie Pattern** combined with **SameSite Cookies** for comprehensive CSRF protection.

### Double-Submit Cookie Pattern

1. Server generates a random CSRF token
2. Token is sent to client in two places:
   - HTTP-only cookie (not accessible via JavaScript)
   - Hidden form field or custom header
3. Client includes token in subsequent requests
4. Server validates that both tokens match

### SameSite Cookie Attribute

- `SameSite=Lax` for most requests
- `SameSite=Strict` for sensitive operations
- Prevents cross-site requests from including cookies

## Implementation Details

### CSRF Token Generation

```typescript
// Generate cryptographically secure random token
function generateCSRFToken(): string {
  return crypto
    .getRandomValues(new Uint8Array(32))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
}
```

### Token Storage Strategy

1. **HTTP-only Cookie**: Stores the server-generated token
2. **Custom Header**: `X-CSRF-Token` for AJAX requests
3. **Hidden Form Fields**: For traditional form submissions

### Middleware Implementation

```typescript
interface CSRFConfig {
  cookieName: string;
  headerName: string;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  maxAge: number;
}

class CSRFProtection {
  private config: CSRFConfig;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = {
      cookieName: 'csrf_token',
      headerName: 'X-CSRF-Token',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600, // 1 hour
      ...config,
    };
  }

  // Generate and set CSRF token
  generateToken(res: Response): string {
    const token = generateCSRFToken();

    res.cookie(this.config.cookieName, token, {
      httpOnly: true,
      secure: this.config.secure,
      sameSite: this.config.sameSite,
      maxAge: this.config.maxAge * 1000,
    });

    return token;
  }

  // Validate CSRF token from request
  validateToken(req: Request): boolean {
    const cookieToken = req.cookies[this.config.cookieName];
    const headerToken = req.headers[this.config.headerName];

    return cookieToken && headerToken && cookieToken === headerToken;
  }

  // Middleware for Express.js
  middleware(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    if (!this.validateToken(req)) {
      return res.status(403).json({
        error: 'CSRF token validation failed',
      });
    }

    next();
  }
}
```

## Integration with Frontend

### React Hook for CSRF Token Management

```typescript
import { useState, useEffect } from 'react';

export const useCSRFToken = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    // Fetch CSRF token from server
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/csrf-token');
        const data = await response.json();
        setCsrfToken(data.token);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchToken();
  }, []);

  return csrfToken;
};
```

### Axios Interceptor for Automatic Token Injection

```typescript
import axios from 'axios';

export const setupCSRFProtection = (csrfToken: string) => {
  axios.interceptors.request.use((config) => {
    if (
      config.method &&
      !['get', 'head', 'options'].includes(config.method.toLowerCase())
    ) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  });
};
```

## Route-Specific Configuration

### Public Routes (No CSRF Required)

```typescript
const publicRoutes = ['/api/products', '/api/blog', '/api/contact'];
```

### Authenticated Routes (CSRF Required)

```typescript
const authenticatedRoutes = ['/api/cart', '/api/profile', '/api/orders'];
```

### Admin Routes (Strict CSRF)

```typescript
const adminRoutes = [
  '/api/admin/users',
  '/api/admin/products',
  '/api/admin/orders',
];
```

## Security Considerations

### Token Expiration

- CSRF tokens expire after 1 hour
- New token generated on each login
- Automatic refresh for long sessions

### Token Entropy

- 256-bit cryptographically secure random tokens
- Base64 encoded for transmission
- Unique per session

### Error Handling

- Graceful degradation if CSRF validation fails
- Clear error messages for debugging
- Logging of suspicious activities

### Performance Impact

- Minimal overhead (cookie parsing + string comparison)
- Cached token validation
- No database lookups required

## Testing Strategy

### Unit Tests

```typescript
describe('CSRF Protection', () => {
  test('generates valid tokens', () => {
    const token = generateCSRFToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  test('validates matching tokens', () => {
    const token = 'test-token';
    expect(validateTokens(token, token)).toBe(true);
  });

  test('rejects mismatched tokens', () => {
    expect(validateTokens('token1', 'token2')).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('CSRF Middleware', () => {
  test('allows GET requests without token', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
  });

  test('blocks POST requests without token', async () => {
    const response = await request(app).post('/api/cart');
    expect(response.status).toBe(403);
  });

  test('allows POST requests with valid token', async () => {
    const agent = request.agent(app);
    await agent.get('/api/csrf-token'); // Sets cookie

    const response = await agent
      .post('/api/cart')
      .set('X-CSRF-Token', 'valid-token');

    expect(response.status).toBe(200);
  });
});
```

## Deployment Checklist

- [ ] CSRF middleware implemented
- [ ] Token generation endpoint created
- [ ] Frontend token management added
- [ ] Axios interceptors configured
- [ ] Route-specific protection applied
- [ ] Security tests passing
- [ ] Performance benchmarks met
- [ ] Documentation updated

## Monitoring and Alerts

### Security Events to Monitor

- CSRF validation failures
- Token generation rate
- Suspicious request patterns
- Token expiration events

### Alert Thresholds

- > 10 CSRF failures per minute from single IP
- > 100 token generations per minute
- Token reuse attempts

This CSRF protection implementation provides robust defense against cross-site request forgery attacks while maintaining usability and performance.
