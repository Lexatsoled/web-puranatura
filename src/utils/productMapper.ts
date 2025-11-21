import { Product } from '../types/product';

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

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&w=600&q=80';

export const mapApiProduct = (apiProduct: ApiProduct): Product => {
  const image = apiProduct.imageUrl ?? FALLBACK_IMAGE;
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description ?? 'Producto de PuraNatura',
    price: apiProduct.price,
    category: apiProduct.category ?? 'otros',
    images: [
      {
        full: image,
        thumbnail: image,
      },
    ],
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
