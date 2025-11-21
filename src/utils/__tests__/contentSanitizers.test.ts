import { describe, expect, it } from 'vitest';
import {
  sanitizeBlogPostContent,
  sanitizeProductContent,
} from '../contentSanitizers';
import { BlogPost } from '../../../types';
import { Product } from '../../types/product';

describe('content sanitizers', () => {
  it('limpia campos críticos de un blog post', () => {
    const blogPost: BlogPost = {
      title: '<script>alert(1)</script>Título',
      summary: 'Resumen <img src=x onerror=alert(1)> seguro',
      imageUrl: 'javascript:alert(1)',
      content:
        '<p>bloque</p><img src="x" onerror="alert(1)" /><script>alert("hack")</script>',
    };

    const sanitized = sanitizeBlogPostContent(blogPost);

    expect(sanitized.title).not.toContain('<script>');
    expect(sanitized.summary).not.toContain('onerror');
    expect(sanitized.imageUrl).toMatch(/^https?:\/\//);
    expect(sanitized.content).not.toContain('script');
    expect(sanitized.content).toContain('<p>bloque</p>');
  });

  it('neutraliza scripts incrustados en un producto', () => {
    const product: Product = {
      id: '1',
      name: '<img src=x onerror=alert(1)>',
      description: 'Descripción <script>alert(1)</script>',
      price: 10,
      category: 'suplementos<script>',
      images: [
        { full: 'javascript:alert(1)', thumbnail: 'javascript:alert(2)' },
      ],
      stock: 5,
      sku: '<b>SKU</b>',
      tags: ['<i>tag</i>'],
      benefitsDescription: ['<img src=x onerror=alert(1)>'],
      healthIssues: ['<svg onload=alert(1)>'],
      components: [
        {
          name: '<svg onload=alert(1)>',
          description: '<script>alert(2)</script>',
          amount: '<b>10mg</b>',
        },
      ],
      faqs: [
        {
          question: '¿Seguro?<script>alert(1)</script>',
          answer: '<p>Respuesta</p><script>alert(3)</script>',
        },
      ],
    };

    const sanitized = sanitizeProductContent(product);

    expect(sanitized.name).not.toContain('<');
    expect(sanitized.description).not.toContain('script');
    expect(sanitized.category).not.toContain('<');
    expect(sanitized.images[0].full).toMatch(/^https?:\/\//);
    expect(sanitized.tags?.[0]).not.toContain('<');
    expect(sanitized.components?.[0].description).not.toContain('script');
    expect(sanitized.faqs?.[0].answer).not.toContain('script');
  });
});
