import { sanitizeHtml, sanitizeText, sanitizeUrl } from './sanitizer';
import { BlogPost } from '../../types';
import { Product } from '../types/product';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&w=600&q=80';

export const sanitizeBlogPostContent = (post: BlogPost): BlogPost => ({
  ...post,
  title: sanitizeText(post.title),
  summary: sanitizeText(post.summary),
  imageUrl: sanitizeUrl(post.imageUrl),
  content: sanitizeHtml(post.content),
});

export const sanitizeProductContent = (product: Product): Product => {
  const sanitizeImagePath = (value: string) => {
    if (!value) return FALLBACK_IMAGE;
    const trimmed = value.trim();
    if (trimmed.startsWith('/')) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // Normaliza rutas relativas internas evitando prefijos inseguros
    return FALLBACK_IMAGE;
  };

  return {
    ...product,
    name: sanitizeText(product.name),
    category: sanitizeText(product.category),
    description: sanitizeText(product.description),
    detailedDescription: product.detailedDescription
      ? sanitizeHtml(product.detailedDescription)
      : undefined,
    mechanismOfAction: product.mechanismOfAction
      ? sanitizeHtml(product.mechanismOfAction)
      : undefined,
    benefitsDescription: product.benefitsDescription?.map(sanitizeText),
    healthIssues: product.healthIssues?.map(sanitizeText),
    components: product.components?.map((component) => ({
      ...component,
      name: sanitizeText(component.name),
      description: component.description
        ? sanitizeText(component.description)
        : undefined,
      amount: component.amount ? sanitizeText(component.amount) : undefined,
    })),
    faqs: product.faqs?.map((faq) => ({
      question: sanitizeText(faq.question),
      answer: sanitizeHtml(faq.answer),
    })),
    dosage: product.dosage ? sanitizeText(product.dosage) : undefined,
    administrationMethod: product.administrationMethod
      ? sanitizeText(product.administrationMethod)
      : undefined,
    tags: product.tags?.map(sanitizeText) ?? [],
    images: product.images.map((image) => ({
      full: sanitizeImagePath(image.full),
      thumbnail: sanitizeImagePath(image.thumbnail),
    })),
    sku: sanitizeText(product.sku),
  };
};
