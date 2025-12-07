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

export const mapApiProduct = (apiProduct: ApiProduct): Product => {
  const image = getProductImage(apiProduct.imageUrl);

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: getDefaultDescription(apiProduct.description),
    price: apiProduct.price,
    category: getDefaultCategory(apiProduct.category),
    images: [{ full: image, thumbnail: image }],
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
