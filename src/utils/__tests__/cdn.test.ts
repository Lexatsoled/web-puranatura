import { describe, it, expect } from 'vitest';
import { getCDNUrl } from '../cdn';

describe('getCDNUrl', () => {
  it('encodes spaces in relative paths when no CDN base is configured', () => {
    const input = '/Jpeg/Glucosamine Chondroitin Anverso.jpg';
    const out = getCDNUrl(input);
    // should encode space as %20
    expect(out).toContain('%20');
    // should keep leading slash
    expect(out.startsWith('/')).toBe(true);
  });

  it('preserves absolute URLs', () => {
    const abs = 'https://example.com/image name.jpg';
    const out = getCDNUrl(abs);
    expect(out).toBe(abs);
  });
});
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCDNUrl } from '../cdn';
import { generateSrcSet } from '../image';

describe('cdn utils', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns local path when CDN no configurado', () => {
    vi.stubEnv('VITE_CDN_BASE_URL', '');
    expect(getCDNUrl('/images/product.png')).toBe('/images/product.png');
  });

  it('aplica base CDN para rutas relativas', () => {
    vi.stubEnv('VITE_CDN_BASE_URL', 'https://cdn.example.com/');
    expect(getCDNUrl('/images/product.png')).toBe(
      'https://cdn.example.com/images/product.png',
    );
  });

  it('usa CDN en generateSrcSet', () => {
    vi.stubEnv('VITE_CDN_BASE_URL', 'https://cdn.example.com');
    const srcset = generateSrcSet('/images/product.jpg', {
      widths: [320, 640],
      includeWidthQueryFallback: false,
    });
    expect(srcset).toContain('https://cdn.example.com/images/product_320.webp 320w');
    expect(srcset).toContain('https://cdn.example.com/images/product_640.webp 640w');
  });
});
