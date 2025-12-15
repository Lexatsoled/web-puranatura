import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText, sanitizeUrl } from '../sanitizer';

describe('sanitizer - XSS Protection', () => {
  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('Hello');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('Hello');
    });

    it('should remove onclick handlers', () => {
      const input = '<a href="#" onclick="alert(\'XSS\')">Click</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });

    it('should remove onerror handlers', () => {
      const input = '<img src="x" onerror="alert(\'XSS\')" />';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should remove javascript: protocol in links', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="https://evil.com"></iframe>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<iframe');
      expect(result).not.toContain('evil.com');
    });

    it('should remove object and embed tags', () => {
      const input = '<object data="malicious.swf"></object><embed src="bad.swf">';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<object');
      expect(result).not.toContain('<embed');
    });

    it('should remove style tags', () => {
      const input = '<style>body { background: red; }</style><p>Text</p>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<style>');
      expect(result).toContain('Text');
    });

    it('should handle nested script attempts', () => {
      const input = '<p><scr<script>ipt>alert("XSS")</scr</script>ipt></p>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should handle encoded scripts', () => {
      const input = '<p>&#60;script&#62;alert("XSS")&#60;/script&#62;</p>';
      const result = sanitizeHTML(input);
      // DOMPurify should decode and then remove
      expect(result).not.toContain('alert');
    });

    it('should allow safe links with href', () => {
      const input = '<a href="https://example.com">Safe Link</a>';
      const result = sanitizeHTML(input);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('Safe Link');
    });

    it('should allow safe list structures', () => {
      const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitizeHTML(input);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
      expect(result).toContain('Item 1');
    });

    it('should handle empty input', () => {
      expect(sanitizeHTML('')).toBe('');
    });

    it('should handle null/undefined gracefully', () => {
      // TypeScript should prevent this, but test runtime behavior
      expect(sanitizeHTML(null as any)).toBeDefined();
      expect(sanitizeHTML(undefined as any)).toBeDefined();
    });
  });

  describe('sanitizeText', () => {
    it('should strip all HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const result = sanitizeText(input);
      expect(result).toBe('Hello world');
    });

    it('should strip script tags and content', () => {
      const input = 'Hello<script>alert("XSS")</script>World';
      const result = sanitizeText(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should handle special HTML entities', () => {
      const input = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      const result = sanitizeText(input);
      expect(result).toBe('<script>alert("XSS")</script>');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow http URLs', () => {
      const url = 'http://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should allow https URLs', () => {
      const url = 'https://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should block javascript: protocol', () => {
      const url = 'javascript:alert("XSS")';
      const result = sanitizeUrl(url);
      expect(result).toBe(''); // Returns empty string for blocked protocols
    });

    it('should block data: protocol', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizeUrl(url);
      expect(result).toBe(''); // Returns empty string for blocked protocols
    });

    it('should allow relative URLs', () => {
      const url = '/path/to/page';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should allow mailto links', () => {
      const url = 'mailto:test@example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should handle empty URL', () => {
      expect(sanitizeUrl('')).toBe(''); // Returns empty string for empty input
    });
  });

  describe('XSS Attack Vectors (OWASP Top 10)', () => {
    const xssVectors = [
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      '<select onfocus=alert(1) autofocus>',
      '<textarea onfocus=alert(1) autofocus>',
      '<iframe src="javascript:alert(1)">',
      '<form action="javascript:alert(1)"><input type="submit">',
      '<a href="javascript:alert(1)">Click</a>',
      '<math><mtext></mtext><mi>alert(1)</mi></math>',
    ];

    xssVectors.forEach((vector, index) => {
      it(`should block XSS vector #${index + 1}: ${vector.substring(0, 30)}...`, () => {
        const result = sanitizeHTML(vector);
        expect(result).not.toContain('alert(');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
        expect(result).not.toContain('onfocus');
      });
    });
  });
});
