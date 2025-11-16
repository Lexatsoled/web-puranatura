import { describe, expect, it } from 'vitest';
import { redactPII } from '../piiRedactor.js';

describe('pii redactor', () => {
  it('redacts emails keeping the domain', () => {
    const payload = { email: 'user@example.com' };
    const result = redactPII(payload);
    expect(result.email).toBe('us***@example.com');
  });

  it('redacts phone numbers leaving the last digits', () => {
    const payload = { phone: '+1 (555) 123-4567' };
    const result = redactPII(payload);
    expect(result.phone).toBe('***4567');
  });

  it('redacts credit card numbers keeping the last four digits', () => {
    const payload = { card: '4111 1111 1111 1111' };
    const result = redactPII(payload);
    expect(result.card).toBe('**** **** **** 1111');
  });

  it('recurses into nested objects to redact sensitive entries', () => {
    const payload = {
      profile: {
        email: 'nested@example.com',
        credentials: {
          password: 'super-secret',
        },
      },
    };

    const result = redactPII(payload);
    expect(result.profile.email).toBe('ne***@example.com');
    expect(result.profile.credentials.password).toBe('[REDACTED]');
  });
});
