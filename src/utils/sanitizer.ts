import { sanitizeHtml, sanitizeText, sanitizeUrl } from './sanitizerCore';
import { sanitizeObject } from './sanitizeObject';

export { sanitizeHtml, sanitizeText, sanitizeUrl, sanitizeObject };

export const useSanitizer = () => ({
  sanitizeFormData: <T extends Record<string, unknown>>(formData: T): T =>
    sanitizeObject(formData),
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
});

export const createSanitizeValidator = (
  type: 'html' | 'text' | 'url' = 'text'
) => {
  const sanitizeByType: Record<
    'html' | 'text' | 'url',
    (value: string) => string
  > = {
    html: sanitizeHtml,
    text: sanitizeText,
    url: sanitizeUrl,
  };

  return (value: string) => {
    if (typeof value !== 'string') {
      return value;
    }
    const handler = sanitizeByType[type] || sanitizeText;
    return handler(value);
  };
};
