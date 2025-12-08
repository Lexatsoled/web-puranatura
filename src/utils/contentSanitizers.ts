import { BlogPost } from '../types/blog';
import { Product } from '../types/product';
import { sanitizeBlogPost } from './contentSanitizers.blog';
import { sanitizeImagePath, FALLBACK_IMAGE } from './contentSanitizers.common';
import {
  sanitizeProductFields,
  sanitizeProductImages,
} from './contentSanitizers.product';

export const sanitizeBlogPostContent = (post: BlogPost): BlogPost =>
  sanitizeBlogPost(post);

export const sanitizeProductContent = (product: Product): Product => ({
  ...sanitizeProductFields(product),
  images: sanitizeProductImages(product.images),
});

export { FALLBACK_IMAGE, sanitizeImagePath };
