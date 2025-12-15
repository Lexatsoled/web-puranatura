export const FALLBACK_IMAGE = '/Jpeg/vitamina_c_1000_500x500.jpg';

export const sanitizeImagePath = (value: string) => {
  if (!value) return FALLBACK_IMAGE;
  const trimmed = value.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('optimized/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    // Reject external images to prevent picsum/unsplash leaks
    // Only allow if it's explicitly trusted (none for now)
    return FALLBACK_IMAGE;
  }
  return FALLBACK_IMAGE;
};
