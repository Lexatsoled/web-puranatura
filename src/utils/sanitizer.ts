import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance that works both in browser and Node (JSDOM)
const windowForPurify = typeof window !== 'undefined' ? window : new JSDOM('').window;
const DOMPurify = createDOMPurify(windowForPurify);

/**
 * Sanitiza HTML para permitir solo tags seguros básicos.
 * Útil para contenido de blog o descripciones ricas.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  const clean = DOMPurify.sanitize(html, {
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
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onmouseover', 'onerror', 'onclick', 'onload', 'onfocus'],
  });

  return String(clean);
};

/**
 * Elimina todo el HTML y deja solo texto plano.
 */
export const sanitizeText = (html: string): string => {
  if (!html) return '';

  // Detect if input contains raw tags (e.g. '<p>') vs encoded entities ('&lt;script&gt;')
  const hasRawTags = /<\s*[a-zA-Z]+[^>]*>/.test(html);

  // If input had raw tags, strip tags and return plain text content
  if (hasRawTags) {
    const stripped = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    // Ensure entities are decoded and return only text
    const div = windowForPurify.document.createElement('div');
    div.innerHTML = String(stripped);
    return (div.textContent || '').trim();
  }

  // If input contained encoded entities, decode them but preserve the decoded string
  const decDiv = windowForPurify.document.createElement('div');
  decDiv.innerHTML = html;
  return String(decDiv.textContent || '').trim();
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
