import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../intl';

describe('intl utils', () => {
  describe('formatCurrency', () => {
    it('should format DOP by default', () => {
      // Note: exact output depends on node locale but usually 'DOP 1,000.00' or similar
      const result = formatCurrency(1000);
      expect(result).toContain('1,000.00'); // Check for formatting
      // es-DO uses RD$ usually
      expect(result).toMatch(/DOP|RD\$/);
    });

    it('should format USD', () => {
      const result = formatCurrency(1000, 'USD', 'en-US');
      expect(result).toBe('$1,000.00');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0.00');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const dateStr = '2023-01-01T12:00:00.000Z'; // Use noon to avoid timezone shift
      // Default es-DO
      const result = formatDate(dateStr);
      // Validar formato básico dd/mm/aaaa o similar
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25T12:00:00'); // Local noon
      const result = formatDate(date);
      expect(result).toMatch(/25\/12\/2023/);
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('');
    });

    it('should support custom options', () => {
      const date = new Date('2023-01-01T12:00:00'); // Local noon
      const result = formatDate(date, 'es-DO', {
        month: 'long',
        year: 'numeric',
      });
      expect(result.toLowerCase()).toContain('enero');
      expect(result).toContain('2023');
    });
  });
});
