import { describe, it, expect } from 'vitest';
import { normalizeSrcSet, generateSrcSet } from '../image';

describe('normalizeSrcSet and generateSrcSet edge cases', () => {
  it('encodes spaces in srcset entries and avoids double-encoding', () => {
    const raw = '/Jpeg/Glucosamine Chondroitin Anverso_320.webp 320w, /Jpeg/Glucosamine Chondroitin Anverso_640.webp 640w';
    const normalized = normalizeSrcSet(raw);
    // Expect percent-encoded spaces
    expect(normalized).toContain('Glucosamine%20Chondroitin%20Anverso_320.webp');
    expect(normalized).not.toContain('%2520'); // not double encoded

    // If input already encoded, remain encoded (no double-encoding)
    const already = '/Jpeg/Glucosamine%20Chondroitin%20Anverso_320.webp 320w';
    const normalized2 = normalizeSrcSet(already);
    expect(normalized2).toContain('Glucosamine%20Chondroitin%20Anverso_320.webp');
    expect(normalized2).not.toContain('%2520');
  });

  it('handles filenames that include commas without splitting incorrectly', () => {
    const raw = '/Jpeg/Name,With,Commas_120.webp 120w, /Jpeg/Name,With,Commas_240.webp 240w';
    const normalized = normalizeSrcSet(raw);
  // Each entry should remain intact and be percent-encoded (commas -> %2C, spaces -> %20)
  expect(normalized).toContain('Name%2C%20With%2C%20Commas_120.webp');
  expect(normalized).toContain('Name%2C%20With%2C%20Commas_240.webp');
  });

  it('generateSrcSet produces encoded variants (smoke)', () => {
    // generateSrcSet may rely on implementation details; this is a smoke check
    const variants = generateSrcSet('/Jpeg/Example Product.jpg');
    // Should include percent-encoded base name in at least one variant
    expect(variants).toMatch(/Example%20Product/);
    expect(variants).not.toMatch(/%2520/);
  });
});
