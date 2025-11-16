# Input Validation Middleware Implementation for Pureza-Naturalis-V3

## Overview

This document details the input validation middleware implementation using Zod schemas for comprehensive request data validation in the Pureza-Naturalis-V3 API security layer.

## Validation Strategy

We'll implement a multi-layered validation approach:

1. **Schema-based validation** using Zod for type safety and runtime validation
2. **Route-specific validation rules** for different endpoints
3. **Automatic error response generation** with detailed validation messages
4. **Type-safe request data** extraction and transformation

## Zod Schema Integration

### Existing Schemas Analysis

Based on `validationSchemas.ts`, we have:

```typescript
// User validation
export const userSchema = z.object({
  email: z.string().email().max(100),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  firstName: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/),
  lastName: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/)
    .optional(),
});

// Product validation
export const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive().max(999999.99),
  stock: z.number().int().min(0).max(99999),
  category: z.string().min(2).max(50),
  brand: z.string().max(50).optional(),
  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/)
    .max(20)
    .optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s]+$/),
  email: z.string().email().max(100),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/)
    .optional(),
});
```

## Middleware Implementation

### Validation Middleware Core

```typescript
import { z } from 'zod';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ValidationRule {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schema: z.ZodSchema;
  validateQuery?: boolean;
  validateBody?: boolean;
  validateParams?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

class ValidationMiddleware {
  private rules: ValidationRule[] = [];

  // Add validation rule for specific route
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  // Validate request against rules
  async validateRequest(
    config: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const matchingRule = this.findMatchingRule(config);

    if (!matchingRule) {
      return config; // No validation required
    }

    const errors: ValidationError[] = [];

    // Validate query parameters
    if (matchingRule.validateQuery && config.params) {
      try {
        matchingRule.schema.parse(config.params);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...this.formatZodErrors(error, 'query'));
        }
      }
    }

    // Validate request body
    if (matchingRule.validateBody && config.data) {
      try {
        matchingRule.schema.parse(config.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...this.formatZodErrors(error, 'body'));
        }
      }
    }

    // Validate URL parameters (if applicable)
    if (matchingRule.validateParams && config.url) {
      const urlParams = this.extractUrlParams(config.url);
      if (urlParams) {
        try {
          matchingRule.schema.parse(urlParams);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push(...this.formatZodErrors(error, 'params'));
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationException('Request validation failed', errors);
    }

    return config;
  }

  private findMatchingRule(
    config: AxiosRequestConfig
  ): ValidationRule | undefined {
    return this.rules.find(
      (rule) =>
        rule.method.toUpperCase() === (config.method || 'GET').toUpperCase() &&
        this.matchPath(rule.path, config.url || '')
    );
  }

  private matchPath(rulePath: string, requestUrl: string): boolean {
    // Simple path matching - can be enhanced with regex or path-to-regexp
    const normalizedRulePath = rulePath.replace(/:([^/]+)/g, '([^/]+)');
    const regex = new RegExp(`^${normalizedRulePath}$`);
    return regex.test(requestUrl);
  }

  private extractUrlParams(url: string): Record<string, string> | null {
    // Extract parameters from URL path like /users/:id
    const matches = url.match(/\/([^/]+)\/([^/]+)/);
    if (matches) {
      return { id: matches[2] };
    }
    return null;
  }

  private formatZodErrors(
    error: z.ZodError,
    location: string
  ): ValidationError[] {
    return error.errors.map((err) => ({
      field: `${location}.${err.path.join('.')}`,
      message: err.message,
      code: err.code,
    }));
  }
}
```

### Validation Exception Class

```typescript
export class ValidationException extends Error {
  public readonly errors: ValidationError[];
  public readonly statusCode = 400;

  constructor(message: string, errors: ValidationError[]) {
    super(message);
    this.name = 'ValidationException';
    this.errors = errors;
  }
}
```

## Route-Specific Validation Rules

### API Endpoints Configuration

```typescript
const validationRules: ValidationRule[] = [
  // User registration
  {
    path: '/api/auth/register',
    method: 'POST',
    schema: userSchema,
    validateBody: true,
  },

  // User login
  {
    path: '/api/auth/login',
    method: 'POST',
    schema: z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
    validateBody: true,
  },

  // Product creation (admin only)
  {
    path: '/api/products',
    method: 'POST',
    schema: productSchema,
    validateBody: true,
  },

  // Product update
  {
    path: '/api/products/:id',
    method: 'PUT',
    schema: productSchema.partial(),
    validateBody: true,
    validateParams: true,
  },

  // Contact form submission
  {
    path: '/api/contact',
    method: 'POST',
    schema: contactFormSchema,
    validateBody: true,
  },

  // Review submission
  {
    path: '/api/products/:id/reviews',
    method: 'POST',
    schema: reviewSchema,
    validateBody: true,
    validateParams: true,
  },

  // Cart operations
  {
    path: '/api/cart',
    method: 'POST',
    schema: z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive().max(99),
    }),
    validateBody: true,
  },

  // Checkout
  {
    path: '/api/checkout',
    method: 'POST',
    schema: checkoutSchema,
    validateBody: true,
  },
];
```

## Error Handling and Response

### Validation Error Response Format

```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    type: 'VALIDATION_ERROR';
    message: string;
    details: ValidationError[];
  };
}

// Example error response
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "body.email",
        "message": "Invalid email format",
        "code": "invalid_string"
      },
      {
        "field": "body.password",
        "message": "Password must be at least 8 characters",
        "code": "too_small"
      }
    ]
  }
}
```

## Integration with Axios

### Request Interceptor

```typescript
import axios from 'axios';
import { validationMiddleware } from './validationMiddleware';

axios.interceptors.request.use(
  async (config) => {
    try {
      return await validationMiddleware.validateRequest(config);
    } catch (error) {
      if (error instanceof ValidationException) {
        // Create a rejected promise with validation error
        return Promise.reject(error);
      }
      throw error;
    }
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor for Error Handling

```typescript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof ValidationException) {
      // Transform to axios error format
      const axiosError = new axios.AxiosError(
        error.message,
        'VALIDATION_ERROR',
        error.config,
        error.request,
        {
          ...error.response,
          data: {
            success: false,
            error: {
              type: 'VALIDATION_ERROR',
              message: error.message,
              details: error.errors,
            },
          },
        } as any
      );
      return Promise.reject(axiosError);
    }
    return Promise.reject(error);
  }
);
```

## Advanced Features

### Custom Validation Rules

```typescript
// Custom password strength validator
const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

// Custom email domain validator
const businessEmailSchema = z
  .string()
  .email()
  .refine(
    (email) => !email.endsWith('@gmail.com') && !email.endsWith('@yahoo.com'),
    'Please use a business email address'
  );
```

### Conditional Validation

```typescript
const userUpdateSchema = z
  .object({
    email: z.string().email().optional(),
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/)
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  );
```

### File Upload Validation

```typescript
const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
});
```

## Performance Optimizations

### Schema Caching

```typescript
class SchemaCache {
  private cache = new Map<string, z.ZodSchema>();

  get(key: string): z.ZodSchema | undefined {
    return this.cache.get(key);
  }

  set(key: string, schema: z.ZodSchema): void {
    this.cache.set(key, schema);
  }
}
```

### Lazy Schema Loading

```typescript
const schemaLoader = {
  user: () => import('./schemas/userSchema'),
  product: () => import('./schemas/productSchema'),
  // ... other schemas
};
```

## Testing Strategy

### Unit Tests

```typescript
describe('ValidationMiddleware', () => {
  test('validates correct user data', async () => {
    const config = {
      method: 'POST',
      url: '/api/auth/register',
      data: {
        email: 'user@example.com',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    const result = await validationMiddleware.validateRequest(config);
    expect(result).toBe(config);
  });

  test('rejects invalid email', async () => {
    const config = {
      method: 'POST',
      url: '/api/auth/register',
      data: {
        email: 'invalid-email',
        password: 'StrongPass123!',
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    await expect(validationMiddleware.validateRequest(config)).rejects.toThrow(
      ValidationException
    );
  });
});
```

### Integration Tests

```typescript
describe('API Validation', () => {
  test('POST /api/auth/register validates input', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'invalid-email',
      password: 'weak',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.type).toBe('VALIDATION_ERROR');
  });
});
```

## Security Considerations

### Data Sanitization Before Validation

- Input sanitization should occur before validation
- Prevent injection attacks through validation
- Safe error messages (no data leakage)

### Rate Limiting Integration

- Combine with rate limiting for brute force protection
- Track validation failures per IP/client

### Audit Logging

- Log validation failures for security monitoring
- Track suspicious validation patterns

This input validation middleware provides robust, type-safe request validation while maintaining performance and security best practices.
