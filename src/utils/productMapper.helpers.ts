export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&w=600&q=80';

export const getDefaultDescription = (description?: string | null) =>
  description ?? 'Producto de PuraNatura';

export const getDefaultCategory = (category?: string | null) =>
  category ?? 'otros';

export const getProductImage = (imageUrl?: string | null) =>
  imageUrl ?? FALLBACK_IMAGE;
