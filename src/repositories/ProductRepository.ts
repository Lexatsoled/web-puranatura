import { Product } from '../types/product';
import { products } from '../data/products';

export class ProductRepository {
  static getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const product = products.find(p => p.id === productId);
    if (!product) return [];

    const relatedByCategory = products.filter(p =>
      p.id !== productId &&
      p.categories.some(cat => product.categories.includes(cat))
    );

    const relatedByTags = products.filter(p =>
      p.id !== productId &&
      !relatedByCategory.some(rp => rp.id === p.id) &&
      p.tags.some(tag => product.tags.includes(tag))
    );

    const allRelated = [...relatedByCategory, ...relatedByTags];
    return allRelated.slice(0, limit);
  }
}