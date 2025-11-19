import DOMPurify from 'dompurify';

// Configuración para DOMPurify
const purifyConfig = {
  ALLOWED_TAGS: [
    'b',
    'i',
    'em',
    'strong',
    'a',
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
  ],
  ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title'],
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['frameborder', 'allow', 'allowfullscreen'],
};

/**
 * Sanitiza una cadena HTML
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, purifyConfig);
};

/**
 * Sanitiza texto plano (elimina cualquier HTML)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Sanitiza una URL
 */
export const sanitizeUrl = (url: string): string => {
  const sanitized = DOMPurify.sanitize(url);
  if (!url.match(/^https?:\/\//i)) {
    return `https://${sanitized}`;
  }
  return sanitized;
};

/**
 * Sanitiza un objeto completo de forma recursiva
 */
export function sanitizeObject<T extends object>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Sanitizar strings basándose en el nombre del campo
      if (key.toLowerCase().includes('html')) {
        (sanitized as any)[key] = sanitizeHtml(value);
      } else if (key.toLowerCase().includes('url')) {
        (sanitized as any)[key] = sanitizeUrl(value);
      } else {
        (sanitized as any)[key] = sanitizeText(value);
      }
    } else if (Array.isArray(value)) {
      // Sanitizar arrays recursivamente
      (sanitized as any)[key] = value.map((item) =>
        typeof item === 'object'
          ? sanitizeObject(item)
          : typeof item === 'string'
            ? sanitizeText(item)
            : item
      );
    } else if (value && typeof value === 'object') {
      // Sanitizar objetos anidados
      (sanitized as any)[key] = sanitizeObject(value);
    } else {
      // Mantener otros tipos de datos sin cambios
      (sanitized as any)[key] = value;
    }
  }

  return sanitized;
}

/**
 * Hook personalizado para sanitizar datos de formulario
 */
export const useSanitizer = () => {
  return {
    sanitizeFormData: <T extends object>(formData: T): T => {
      return sanitizeObject(formData);
    },
    sanitizeHtml,
    sanitizeText,
    sanitizeUrl,
  };
};

/**
 * Validador personalizado para React Hook Form
 */
export const createSanitizeValidator = (
  type: 'html' | 'text' | 'url' = 'text'
) => {
  return (value: string) => {
    if (typeof value !== 'string') return value;

    switch (type) {
      case 'html':
        return sanitizeHtml(value);
      case 'url':
        return sanitizeUrl(value);
      default:
        return sanitizeText(value);
    }
  };
};
