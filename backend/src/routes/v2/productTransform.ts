import type {
  ProductBase,
  ProductListResult,
  ProductListResultV2,
  ProductV2,
  ProductReview,
  ProductVariant,
} from '../../types/product';

const buildVariants = (product: ProductBase): ProductVariant[] => {
  const baseVariant = {
    id: `variant-${product.id}-base`,
    name: `${product.name} Clásico`,
    price: product.price,
    available: product.stock > 0,
    sku: product.sku,
    attributes: {
      size: 'Estándar',
      categoría: product.category,
      featured: product.isFeatured ? 'sí' : 'no',
    },
  };

  const premiumPrice = Number((product.price * 1.15).toFixed(2));
  const premiumVariant = {
    id: `variant-${product.id}-premium`,
    name: `${product.name} Premium`,
    price: premiumPrice,
    available: product.stock > 3,
    sku: product.sku ? `${product.sku}-PREM` : `PREM-${product.id}`,
    attributes: {
      size: 'Premium',
      tier: 'premium',
      categoría: product.category,
    },
  };

  return [baseVariant, premiumVariant];
};

const buildReviews = (product: ProductBase): ProductReview[] => {
  const count = Math.min(Math.max(product.reviewCount, 0), 3);
  return Array.from({ length: count }, (_, index) => {
    const rating = Math.min(5, Math.max(1, Math.round(product.rating) - index));
    return {
      id: `review-${product.id}-${index + 1}`,
      rating,
      title: `Reseña #${index + 1} de ${product.name}`,
      body: `Comentario generado automáticamente para ${product.name}`,
      author: `Cliente ${index + 1}`,
      createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
      helpfulVotes: index,
    };
  });
};

export function toProductV2(product: ProductBase): ProductV2 {
  return {
    ...product,
    variants: buildVariants(product),
    reviews: buildReviews(product),
  };
}

export function toProductListResultV2(result: ProductListResult): ProductListResultV2 {
  return {
    ...result,
    products: result.products.map(toProductV2),
  };
}
