import { sanitizeHtml, sanitizeText, sanitizeUrl } from './sanitizer';
import { BlogPost } from '../../types';
import { Product } from '../types/product';

export const sanitizeBlogPostContent = (post: BlogPost): BlogPost => ({
  ...post,
  title: sanitizeText(post.title),
  summary: sanitizeText(post.summary),
  imageUrl: sanitizeUrl(post.imageUrl),
  content: sanitizeHtml(post.content),
});

export const sanitizeProductContent = (product: Product): Product => ({
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
    full: sanitizeUrl(image.full),
    thumbnail: sanitizeUrl(image.thumbnail),
  })),
  sku: sanitizeText(product.sku),
});
