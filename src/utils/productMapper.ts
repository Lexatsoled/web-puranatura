import { Product } from '../types/product';
import {
  getDefaultDescription,
  getDefaultCategory,
  getProductImage,
} from './productMapper.helpers';

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  price: number;
  imageUrl?: string | null;
  stock: number;
}

export const mapApiProduct = (
  apiProduct: ApiProduct,
  localProducts: Product[] = []
): Product => {
  const image = getProductImage(apiProduct.imageUrl);

  // Try to find local rich data to augment the API response
  const localMatch = localProducts.find(
    (p) => String(p.id) === String(apiProduct.id)
  );

  // Use local images if available and API doesn't provide an array (assuming API only gives imageUrl)
  // If API gave real images in the future, we'd prefer those.
  let images = [{ full: image, thumbnail: image }];

  if (localMatch && localMatch.images && localMatch.images.length > 1) {
    images = localMatch.images;
  } else if (
    String(apiProduct.id) === '103' ||
    apiProduct.name.toLowerCase().includes('gaba')
  ) {
    // Failsafe for GABA 750mg if loose matching fails, or matched by name
    images = [
      {
        thumbnail: '/optimized/gaba-anverso_320.webp?v=3',
        full: '/optimized/gaba-anverso_320.webp?v=3',
      },
      {
        thumbnail: '/optimized/gaba-reverso_320.webp',
        full: '/optimized/gaba-reverso.webp',
      },
    ];
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: getDefaultDescription(apiProduct.description),
    price: apiProduct.price,
    category: getDefaultCategory(apiProduct.category),
    images: images,
    benefits: [],
    inStock: apiProduct.stock > 0,
    stock: apiProduct.stock,
    featured: false,
    seoDescription: apiProduct.description ?? undefined,
    sku: apiProduct.slug,
    ingredients: [],
    tags: [],
  };
};
