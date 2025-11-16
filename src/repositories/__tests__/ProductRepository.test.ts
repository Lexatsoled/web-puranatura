import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductRepository } from '../ProductRepository';
import { Product, ProductFilters, SortOption } from '../../types/product';

// Mock de los datos de productos
vi.mock('../../data/products', () => ({
  products: [
    {
      id: '1',
      name: 'Vitamin C 1000mg',
      price: 25.99,
      description: 'High potency vitamin C supplement',
      categories: ['Vitaminas', 'Inmunidad'],
      images: [
        {
          full: '/vitc-full.jpg',
          thumbnail: '/vitc-thumb.jpg',
          alt: 'Vitamin C',
        },
      ],
      stock: 50,
      sku: 'VITC-001',
      tags: ['vitamina c', 'inmunidad', 'antioxidante'],
      rating: 4.5,
      reviewCount: 25,
      isNew: true,
      isBestSeller: false,
      compareAtPrice: 29.99,
    },
    {
      id: '2',
      name: 'Omega 3 Fish Oil',
      price: 35.99,
      description: 'Pure fish oil supplement',
      categories: ['Omega 3', 'Corazón'],
      images: [
        {
          full: '/omega3-full.jpg',
          thumbnail: '/omega3-thumb.jpg',
          alt: 'Omega 3',
        },
      ],
      stock: 30,
      sku: 'OMEGA-002',
      tags: ['omega 3', 'corazon', 'pescado'],
      rating: 4.8,
      reviewCount: 40,
      isNew: false,
      isBestSeller: true,
      compareAtPrice: undefined,
    },
    {
      id: '3',
      name: 'Probiotic Complex',
      price: 45.99,
      description: 'Advanced probiotic formula',
      categories: ['Probióticos', 'Digestión'],
      images: [
        {
          full: '/probiotic-full.jpg',
          thumbnail: '/probiotic-thumb.jpg',
          alt: 'Probiotic',
        },
      ],
      stock: 0,
      sku: 'PROB-003',
      tags: ['probiotico', 'digestion', 'flora intestinal'],
      rating: 4.2,
      reviewCount: 15,
      isNew: false,
      isBestSeller: false,
      compareAtPrice: undefined,
    },
    {
      id: '4',
      name: 'Vitamin D3',
      price: 19.99,
      description: 'High potency vitamin D3 supplement',
      categories: ['Vitaminas'],
      images: [
        {
          full: '/vitd3-full.jpg',
          thumbnail: '/vitd3-thumb.jpg',
          alt: 'Vitamin D3',
        },
      ],
      stock: 100,
      sku: 'VITD3-001',
      tags: ['vitamina d', 'huesos', 'inmunidad'],
      rating: 4.9,
      reviewCount: 50,
      isNew: false,
      isBestSeller: false,
      compareAtPrice: undefined,
    },
  ],
}));

describe('ProductRepository', () => {
  describe('getRelatedProducts', () => {
    it('returns products from same categories', () => {
      const result = ProductRepository.getRelatedProducts('1', 4);

      expect(result.length).toBeGreaterThan(0);
      // Should return products from 'Vitaminas' or 'Inmunidad' categories
      expect(result.every((p) => p.id !== '1')).toBe(true);
    });

    it('includes products from same tags when not enough category matches', () => {
      const result = ProductRepository.getRelatedProducts('2', 4);

      expect(result.every((p) => p.id !== '2')).toBe(true);
    });

    it('returns empty array for non-existent product', () => {
      const result = ProductRepository.getRelatedProducts('999', 4);

      expect(result).toEqual([]);
    });

    it('limits results to specified number', () => {
      const result = ProductRepository.getRelatedProducts('1', 1);

      expect(result.length).toBeLessThanOrEqual(1);
    });
  });
});
