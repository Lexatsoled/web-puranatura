import { describe, expect, it } from 'vitest';
import {
  sanitizeEmail,
  sanitizeFormValues,
  sanitizeHtml,
  sanitizeObject,
  sanitizeText,
  sanitizeUrl,
} from '../sanitizer';

describe('sanitizer utilities', () => {
  it('removes script tags from HTML', () => {
    const dirty = '<p>Safe</p><script>alert("xss")</script>';
    expect(sanitizeHtml(dirty)).toBe('<p>Safe</p>');
  });

  it('strips HTML from text', () => {
    expect(sanitizeText('<b>Hello</b>')).toBe('Hello');
  });

  it('blocks dangerous protocols in URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('about:blank');
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
  });

  it('normalizes email addresses', () => {
    expect(sanitizeEmail(' USER@Example.COM ')).toBe('user@example.com');
  });

  it('sanitizes nested objects', () => {
    const payload = {
      name: '<b>John</b>',
      links: ['http://safe.com', 'javascript:alert(1)'],
    };

    const sanitized = sanitizeObject(payload);
    expect(sanitized.name).toBe('John');
    expect(sanitized.links[1]).toBe('about:blank');
  });

  it('sanitizes form values based on key names', () => {
    const sanitized = sanitizeFormValues({
      email: 'TEST@MAIL.COM ',
      website: 'javascript:alert(1)',
      message: '<img src=x onerror=alert(1)>Hello',
    });

    expect(sanitized.email).toBe('test@mail.com');
    expect(sanitized.website).toBe('about:blank');
    expect(sanitized.message).toBe('Hello');
  });
});
