import { sanitizeHTML, sanitizeText } from './sanitizer';
import { Product } from '../types/product';
import { sanitizeImagePath } from './contentSanitizers.common';

const sanitizeOptional = <T, R>(
  value: T | undefined,
  sanitizer: (input: T) => R
) => (value ? sanitizer(value) : undefined);

const mapOptional = <T, R>(values: T[] | undefined, mapper: (input: T) => R) =>
  values?.map(mapper);

const mapOrEmpty = <T, R>(values: T[] | undefined, mapper: (input: T) => R) =>
  values?.map(mapper) ?? [];

type ProductComponent = { name: string; description?: string; amount?: string };

const sanitizeComponent = (component: ProductComponent) => ({
  ...component,
  name: sanitizeText(component.name),
  description: sanitizeOptional(component.description, sanitizeText),
  amount: sanitizeOptional(component.amount, sanitizeText),
});

const sanitizeFaq = (faq: NonNullable<Product['faqs']>[number]) => ({
  question: sanitizeText(faq.question),
  answer: sanitizeHTML(faq.answer),
});

export const sanitizeProductFields = (product: Product) => ({
  ...product,
  name: sanitizeText(product.name),
  category: sanitizeText(product.category),
  description: sanitizeText(product.description),
  detailedDescription: sanitizeOptional(
    product.detailedDescription,
    sanitizeHTML
  ),
  mechanismOfAction: sanitizeOptional(product.mechanismOfAction, sanitizeHTML),
  benefitsDescription: mapOptional(product.benefitsDescription, sanitizeText),
  healthIssues: mapOptional(product.healthIssues, sanitizeText),
  components: mapOptional(product.components, sanitizeComponent),
  faqs: mapOptional(product.faqs, sanitizeFaq),
  dosage: sanitizeOptional(product.dosage, sanitizeText),
  administrationMethod: sanitizeOptional(
    product.administrationMethod,
    sanitizeText
  ),
  tags: mapOrEmpty(product.tags, sanitizeText),
  sku: sanitizeText(product.sku),
});

export const sanitizeProductImages = (images: Product['images'] = []) =>
  (images || []).map((image) => ({
    full: sanitizeImagePath(image.full),
    thumbnail: sanitizeImagePath(image.thumbnail),
  }));
