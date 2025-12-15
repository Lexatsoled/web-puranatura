import createDOMPurify from 'dompurify';

const DOMPurify =
  typeof window !== 'undefined' ? createDOMPurify(window) : createDOMPurify;

/**
 * Sanitiza HTML para permitir solo tags seguros básicos.
 * Útil para contenido de blog o descripciones ricas.
 */
export const sanitizeHTML = (html: string): string => {
  // @ts-ignore - Handle potential diverse DOMPurify builds
  const clean = DOMPurify.sanitize
    ? DOMPurify.sanitize(html, {
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
          'span',
          'blockquote',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
        // Previene target="_blank" sin noopener noreferrer
        ADD_ATTR: ['target'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: ['onmwouseover', 'onerror', 'onclick'], // extra cautela
      })
    : html;

  return clean as string;
};

/**
 * Elimina todo el HTML y deja solo texto plano.
 */
export const sanitizeText = (html: string): string => {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
};

/**
 * Sanitiza URLs para prevenir javascript: y otros protocolos peligrosos.
 */
export const sanitizeUrl = (url: string): string => {
  // DOMPurify sanitiza URLs automáticamente en atributos, pero esto es para uso directo
  const clean = DOMPurify.sanitize(url, { ALLOWED_TAGS: [] });
  // Verificación adicional básica
  if (/^(javascript:|vbscript:|data:)/i.test(clean)) {
    return '';
  }
  return clean;
};

/**
 * Recorre un objeto y sanitiza todas sus propiedades string.
 */
export const sanitizeObject = <T>(obj: T): T => {
  if (typeof obj === 'string') {
    return sanitizeHTML(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = sanitizeObject((obj as any)[key]);
      }
    }
    return result as T;
  }
  return obj;
};
