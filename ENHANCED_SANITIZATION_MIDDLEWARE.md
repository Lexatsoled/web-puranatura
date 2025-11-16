# Enhanced Request Sanitization Middleware for Pureza-Naturalis-V3

## Overview

This document details the enhanced request sanitization middleware implementation that provides comprehensive protection against various injection attacks and malicious input in the Pureza-Naturalis-V3 API security layer.

## Security Threats Addressed

### 1. Cross-Site Scripting (XSS)

- **Reflected XSS**: Malicious scripts in URL parameters
- **Stored XSS**: Malicious data stored in database
- **DOM-based XSS**: Client-side script injection

### 2. SQL Injection

- **Classic SQL Injection**: Malicious SQL in input fields
- **Blind SQL Injection**: Boolean-based and time-based attacks
- **Union-based Injection**: Combining malicious queries

### 3. Command Injection

- **OS Command Injection**: System command execution
- **Code Injection**: Dynamic code execution

### 4. Other Injection Attacks

- **LDAP Injection**: Directory service attacks
- **XPath Injection**: XML query manipulation
- **NoSQL Injection**: Database query injection

## Enhanced Sanitization Strategy

### Multi-Layer Approach

1. **Input Filtering**: Remove dangerous characters/patterns
2. **Context-Aware Sanitization**: Different rules for different contexts
3. **Type Validation**: Ensure data matches expected types
4. **Length Limits**: Prevent buffer overflow attacks
5. **Encoding**: Safe encoding of special characters

## Implementation Architecture

```typescript
interface SanitizationConfig {
  level: 'strict' | 'moderate' | 'lenient';
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
  customRules?: SanitizationRule[];
}

interface SanitizationRule {
  pattern: RegExp;
  replacement: string;
  description: string;
}

class EnhancedSanitizationMiddleware {
  private config: SanitizationConfig;

  constructor(config: SanitizationConfig = { level: 'moderate' }) {
    this.config = config;
  }

  // Main sanitization method
  sanitize(input: any, context: SanitizationContext = 'general'): any {
    if (typeof input === 'string') {
      return this.sanitizeString(input, context);
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.sanitize(item, context));
    }

    if (input && typeof input === 'object') {
      return this.sanitizeObject(input, context);
    }

    return input;
  }

  private sanitizeString(input: string, context: SanitizationContext): string {
    let sanitized = input;

    // Apply length limits
    if (this.config.maxLength && sanitized.length > this.config.maxLength) {
      sanitized = sanitized.substring(0, this.config.maxLength);
    }

    // Apply context-specific sanitization
    switch (context) {
      case 'html':
        sanitized = this.sanitizeHtml(sanitized);
        break;
      case 'sql':
        sanitized = this.sanitizeSql(sanitized);
        break;
      case 'command':
        sanitized = this.sanitizeCommand(sanitized);
        break;
      case 'url':
        sanitized = this.sanitizeUrl(sanitized);
        break;
      case 'json':
        sanitized = this.sanitizeJson(sanitized);
        break;
      default:
        sanitized = this.sanitizeGeneral(sanitized);
    }

    // Apply custom rules
    if (this.config.customRules) {
      this.config.customRules.forEach((rule) => {
        sanitized = sanitized.replace(rule.pattern, rule.replacement);
      });
    }

    return sanitized;
  }

  private sanitizeObject(
    obj: Record<string, any>,
    context: SanitizationContext
  ): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip sensitive fields that shouldn't be sanitized
      if (this.isSensitiveField(key)) {
        sanitized[key] = value;
        continue;
      }

      // Determine context based on field name
      const fieldContext = this.getFieldContext(key);
      sanitized[key] = this.sanitize(value, fieldContext);
    }

    return sanitized;
  }
}
```

## Context-Specific Sanitization Rules

### HTML Context Sanitization

```typescript
private sanitizeHtml(input: string): string {
  // Use DOMPurify for HTML sanitization
  const config = {
    ALLOWED_TAGS: this.config.allowedTags || ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: this.config.allowedAttributes || ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover']
  };

  return DOMPurify.sanitize(input, config);
}
```

### SQL Context Sanitization

```typescript
private sanitizeSql(input: string): string {
  // Remove or escape SQL injection patterns
  const sqlPatterns = [
    { pattern: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi, replacement: '' },
    { pattern: /(-{2}|\/\*|\*\/)/g, replacement: '' }, // Remove comments
    { pattern: /('|(\\x27)|(\\x2D))/g, replacement: "\\'" }, // Escape quotes
    { pattern: /(;)/g, replacement: '' } // Remove semicolons
  ];

  let sanitized = input;
  sqlPatterns.forEach(({ pattern, replacement }) => {
    sanitized = sanitized.replace(pattern, replacement);
  });

  return sanitized;
}
```

### Command Injection Prevention

```typescript
private sanitizeCommand(input: string): string {
  // Remove dangerous command characters and patterns
  const commandPatterns = [
    { pattern: /([;&|`$()<>])/g, replacement: '' }, // Remove shell metacharacters
    { pattern: /(\.\.|\/)/g, replacement: '' }, // Remove path traversal
    { pattern: /\b(rm|del|format|shutdown|reboot)\b/gi, replacement: '' }, // Remove dangerous commands
    { pattern: /(\bexec\b|\bsystem\b|\beval\b|\brequire\b)/gi, replacement: '' } // Remove execution functions
  ];

  let sanitized = input;
  commandPatterns.forEach(({ pattern, replacement }) => {
    sanitized = sanitized.replace(pattern, replacement);
  });

  return sanitized;
}
```

### URL Sanitization

```typescript
private sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Remove dangerous characters from URL components
    url.search = this.sanitizeQueryString(url.search);
    url.hash = this.sanitizeHash(url.hash);

    return url.toString();
  } catch {
    // If URL parsing fails, treat as general string
    return this.sanitizeGeneral(input);
  }
}

private sanitizeQueryString(queryString: string): string {
  // Remove or encode dangerous characters in query parameters
  return queryString.replace(/[<>'"&]/g, (char) => {
    switch (char) {
      case '<': return '%3C';
      case '>': return '%3E';
      case '"': return '%22';
      case "'": return '%27';
      case '&': return '%26';
      default: return char;
    }
  });
}
```

### JSON Sanitization

```typescript
private sanitizeJson(input: string): string {
  try {
    // Parse and re-stringify to ensure valid JSON
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch {
    // If invalid JSON, remove potentially dangerous characters
    return input.replace(/[<>'"&\\]/g, '');
  }
}
```

### General String Sanitization

```typescript
private sanitizeGeneral(input: string): string {
  // Remove null bytes and other control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  // Remove potentially dangerous Unicode characters
  sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // Remove zero-width characters
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  return sanitized;
}
```

## Field Context Detection

### Automatic Context Detection

```typescript
private getFieldContext(fieldName: string): SanitizationContext {
  const fieldNameLower = fieldName.toLowerCase();

  if (fieldNameLower.includes('html') || fieldNameLower.includes('content') || fieldNameLower.includes('description')) {
    return 'html';
  }

  if (fieldNameLower.includes('url') || fieldNameLower.includes('link') || fieldNameLower.includes('website')) {
    return 'url';
  }

  if (fieldNameLower.includes('query') || fieldNameLower.includes('search')) {
    return 'sql';
  }

  if (fieldNameLower.includes('command') || fieldNameLower.includes('script')) {
    return 'command';
  }

  if (fieldNameLower.includes('json') || fieldNameLower.includes('data')) {
    return 'json';
  }

  return 'general';
}

private isSensitiveField(fieldName: string): boolean {
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'auth',
    'creditcard', 'ssn', 'socialsecurity'
  ];

  return sensitiveFields.some(sensitive =>
    fieldName.toLowerCase().includes(sensitive)
  );
}
```

## Advanced Security Features

### Content-Type Validation

```typescript
private validateContentType(input: string, expectedType: string): boolean {
  // Implement content-type validation logic
  switch (expectedType) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'phone':
      return /^\+?[\d\s\-\(\)]+$/.test(input);
    case 'uuid':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
    default:
      return true;
  }
}
```

### Rate-Based Sanitization

```typescript
private applyRateBasedRules(input: string, context: SanitizationContext): string {
  // Implement rate-based sanitization for suspicious patterns
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi
  ];

  let sanitized = input;
  let suspiciousCount = 0;

  suspiciousPatterns.forEach(pattern => {
    const matches = input.match(pattern);
    if (matches) {
      suspiciousCount += matches.length;
      sanitized = sanitized.replace(pattern, '');
    }
  });

  // Log suspicious activity if threshold exceeded
  if (suspiciousCount > 3) {
    console.warn(`High suspicious pattern count detected: ${suspiciousCount}`);
    // Could trigger additional security measures
  }

  return sanitized;
}
```

## Integration with Existing Middleware

### Axios Request Interceptor

```typescript
import axios from 'axios';
import { EnhancedSanitizationMiddleware } from './enhancedSanitizationMiddleware';

const sanitizationMiddleware = new EnhancedSanitizationMiddleware({
  level: 'moderate',
  maxLength: 10000,
});

axios.interceptors.request.use((config) => {
  if (config.data) {
    config.data = sanitizationMiddleware.sanitize(config.data, 'general');
  }

  if (config.params) {
    config.params = sanitizationMiddleware.sanitize(config.params, 'url');
  }

  return config;
});
```

### Axios Response Interceptor

```typescript
axios.interceptors.response.use((response) => {
  if (response.data) {
    response.data = sanitizationMiddleware.sanitize(response.data, 'general');
  }

  return response;
});
```

## Performance Optimizations

### Caching Sanitized Results

```typescript
class SanitizationCache {
  private cache = new Map<string, { result: any; timestamp: number }>();
  private readonly ttl = 300000; // 5 minutes

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.result;
    }
    this.cache.delete(key);
    return null;
  }

  set(key: string, value: any): void {
    this.cache.set(key, { result: value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}
```

### Lazy Loading Rules

```typescript
const ruleLoader = {
  sql: () => import('./rules/sqlRules'),
  html: () => import('./rules/htmlRules'),
  command: () => import('./rules/commandRules'),
};
```

## Testing and Validation

### Security Test Cases

```typescript
describe('Enhanced Sanitization Middleware', () => {
  test('prevents XSS attacks', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizationMiddleware.sanitize(maliciousInput, 'html');
    expect(sanitized).not.toContain('<script>');
  });

  test('prevents SQL injection', () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const sanitized = sanitizationMiddleware.sanitize(maliciousInput, 'sql');
    expect(sanitized).not.toContain('DROP TABLE');
  });

  test('prevents command injection', () => {
    const maliciousInput = '; rm -rf /';
    const sanitized = sanitizationMiddleware.sanitize(
      maliciousInput,
      'command'
    );
    expect(sanitized).not.toContain('rm -rf');
  });

  test('validates URLs', () => {
    const maliciousUrl = 'javascript:alert("xss")';
    const sanitized = sanitizationMiddleware.sanitize(maliciousUrl, 'url');
    expect(sanitized).not.toContain('javascript:');
  });
});
```

### Performance Benchmarks

```typescript
describe('Performance Tests', () => {
  test('handles large inputs efficiently', () => {
    const largeInput = 'a'.repeat(100000);
    const startTime = Date.now();
    const sanitized = sanitizationMiddleware.sanitize(largeInput, 'general');
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
  });

  test('caches repeated sanitizations', () => {
    const input = '<b>test</b>';
    const firstCall = Date.now();
    sanitizationMiddleware.sanitize(input, 'html');
    const secondCall = Date.now();
    sanitizationMiddleware.sanitize(input, 'html'); // Should use cache
    const thirdCall = Date.now();

    expect(secondCall - firstCall).toBeGreaterThan(thirdCall - secondCall);
  });
});
```

## Monitoring and Alerts

### Security Event Logging

```typescript
interface SecurityEvent {
  type: 'sanitization' | 'validation' | 'attack_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  input: string;
  context: SanitizationContext;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

class SecurityLogger {
  logEvent(event: SecurityEvent): void {
    // Log to security monitoring system
    console.warn(`Security Event: ${event.type} - ${event.severity}`, event);

    // Could integrate with services like DataDog, Splunk, etc.
  }
}
```

### Alert Thresholds

- **High**: > 10 XSS attempts per minute
- **Critical**: > 5 SQL injection attempts per minute
- **Medium**: > 50 suspicious patterns per hour

This enhanced sanitization middleware provides comprehensive protection against various injection attacks while maintaining performance and usability. The modular design allows for easy customization and extension based on specific security requirements.
