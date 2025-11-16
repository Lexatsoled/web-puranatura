import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/client.js';
import { products } from '../../db/schema/index.js';
import { productService } from '../productService.js';
import { cacheService } from '../cacheService.js';

const baseProduct = {
  name: 'Producto Test',
  price: 19.99,
  category: 'vitaminas',
  stock: 10,
};

describe('productService prepared statements', () => {
  beforeEach(async () => {
    await db.delete(products);
    await cacheService.clear();
  });

  it('obtains products por id reutilizando el statement preparado', async () => {
    const [created] = await db.insert(products).values(baseProduct).returning();

    const result = await productService.getProductById(String(created.id));

    expect(result).not.toBeNull();
    expect(result?.id).toBe(created.id);
    expect(result?.name).toBe(baseProduct.name);
  });

  it('reutiliza el statement preparado para categorias y respeta el limite', async () => {
    await db.insert(products).values([
      { ...baseProduct, name: 'Beta', is_featured: false },
      { ...baseProduct, name: 'Alfa', is_featured: true },
      { ...baseProduct, name: 'Gamma', is_featured: false },
    ]);

    const results = await productService.getProductsByCategory('vitaminas', 2);

    expect(results).toHaveLength(2);
    expect(results[0]?.name).toBe('Alfa'); // featured primero
  });
});
