export const FALLBACK_IMAGE = '/optimized/placeholder.webp';

export const getDefaultDescription = (description?: string | null) =>
  description ?? 'Producto de PuraNatura';

export const getDefaultCategory = (category?: string | null) =>
  category ?? 'otros';

export const getProductImage = (imageUrl?: string | null) =>
  imageUrl ?? FALLBACK_IMAGE;
