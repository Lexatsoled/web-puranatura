import { describe, it, expect } from 'vitest';
import { generateImageUrl } from '../imageUrl';

describe('generateImageUrl', () => {
  it('should return the original url if no options are provided', () => {
    const url = 'https://example.com/image.jpg';
    expect(generateImageUrl(url, {})).toBe(url);
  });

  it('should append width parameter', () => {
    const url = 'https://example.com/image.jpg';
    expect(generateImageUrl(url, { width: 800 })).toBe(
      'https://example.com/image.jpg?w=800'
    );
  });

  it('should append quality parameter', () => {
    const url = 'https://example.com/image.jpg';
    expect(generateImageUrl(url, { quality: 90 })).toBe(
      'https://example.com/image.jpg?q=90'
    );
  });

  it('should append format parameter', () => {
    const url = 'https://example.com/image.jpg';
    expect(generateImageUrl(url, { format: 'webp' })).toBe(
      'https://example.com/image.jpg?f=webp'
    );
  });

  it('should append all parameters sorted/combined correctly', () => {
    const url = 'https://example.com/image.jpg';
    const result = generateImageUrl(url, {
      width: 800,
      quality: 80,
      format: 'webp',
    });
    // URLSearchParams order is largely browser/implementation dependent but usually insertion order
    expect(result).toContain('w=800');
    expect(result).toContain('q=80');
    expect(result).toContain('f=webp');
  });
});
