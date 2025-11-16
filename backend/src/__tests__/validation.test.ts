import { describe, it, expect } from 'vitest';
import { CreateProductSchema, ProductFiltersSchema } from '../schemas/index.js';

describe('Schema validation', () => {
  it('should validate valid product', () => {
    const data = {
      name: 'Vitamina C',
      description: 'Alta calidad',
      price: 19.99,
      stock: 100,
      category: 'vitaminas' as const,
      images: ['https://example.com/image.jpg'],
    };

    const result = CreateProductSchema.parse(data);
    expect(result).toEqual(data);
  });

  it('should reject invalid product', () => {
    const data = {
      name: '',
      price: -10,
      stock: -5,
      category: 'invalid',
    };

    expect(() => CreateProductSchema.parse(data)).toThrow();
  });

  it('should apply defaults', () => {
    const result = ProductFiltersSchema.parse({});
    expect(result.limit).toBe(20);
    expect(result.sortBy).toBe('createdAt');
    expect(result.sortDir).toBe('desc');
  });
});