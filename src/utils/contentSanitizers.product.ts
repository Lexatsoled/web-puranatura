import { sanitizeHtml, sanitizeText } from './sanitizer';
import { Product } from '../types/product';
import { sanitizeImagePath } from './contentSanitizers.common';

const sanitizeOptionalHtml = (value?: string) =>
  value ? sanitizeHtml(value) : undefined;

const sanitizeOptionalText = (value?: string) =>
  value ? sanitizeText(value) : undefined;

type ProductComponent = { name: string; description?: string; amount?: string };

const sanitizeComponent = (component: ProductComponent) => ({
  ...component,
  name: sanitizeText(component.name),
  description: component.description
    ? sanitizeText(component.description)
    : undefined,
  amount: component.amount ? sanitizeText(component.amount) : undefined,
});

const sanitizeFaq = (faq: NonNullable<Product['faqs']>[number]) => ({
  question: sanitizeText(faq.question),
  answer: sanitizeHtml(faq.answer),
});

export const sanitizeProductFields = (product: Product) => ({
  ...product,
  name: sanitizeText(product.name),
  category: sanitizeText(product.category),
  description: sanitizeText(product.description),
  detailedDescription: sanitizeOptionalHtml(product.detailedDescription),
  mechanismOfAction: sanitizeOptionalHtml(product.mechanismOfAction),
  benefitsDescription: product.benefitsDescription?.map(sanitizeText),
  healthIssues: product.healthIssues?.map(sanitizeText),
  components: product.components?.map(sanitizeComponent),
  faqs: product.faqs?.map(sanitizeFaq),
  dosage: sanitizeOptionalText(product.dosage),
  administrationMethod: sanitizeOptionalText(product.administrationMethod),
  tags: product.tags?.map(sanitizeText) ?? [],
  sku: sanitizeText(product.sku),
});

export const sanitizeProductImages = (images: Product['images']) =>
  images.map((image) => ({
    full: sanitizeImagePath(image.full),
    thumbnail: sanitizeImagePath(image.thumbnail),
  }));
