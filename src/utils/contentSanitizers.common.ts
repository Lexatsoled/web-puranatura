export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&w=600&q=80';

export const sanitizeImagePath = (value: string) => {
  if (!value) return FALLBACK_IMAGE;
  const trimmed = value.trim();
  if (trimmed.startsWith('/')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return FALLBACK_IMAGE;
};
