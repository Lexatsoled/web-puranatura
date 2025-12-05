import { Product } from '../../../types/product';
import { sanitizeProductContent } from '../../../utils/contentSanitizers';
import { Category, DEFAULT_CATEGORY } from '../constants';

export const FALLBACK_MESSAGE =
  'Mostrando catálogo provisional mientras conectamos con la API.';

type FallbackResult = {
  products: Product[];
  categories: Category[];
};

export const loadFallbackProducts = async (): Promise<FallbackResult> => {
  const fallbackModule = await import('../../../../data/products.ts');
  const fallbackProducts = fallbackModule.products.map((product) =>
    sanitizeProductContent(product)
  );
  const merged = [DEFAULT_CATEGORY, ...fallbackModule.productCategories];
  const deduped = Array.from(
    new Map(
      merged.map((category: Category) => [category.id, category])
    ).values()
  );
  return {
    products: fallbackProducts,
    categories: deduped,
  };
};
