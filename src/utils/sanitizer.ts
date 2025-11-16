import DOMPurify from 'dompurify';

type DomPurifyConfig = Parameters<typeof DOMPurify.sanitize>[1];
type InputKind = 'text' | 'html' | 'url' | 'email';
type AnyObject = Record<string, unknown>;

const HTML_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'code',
    'pre',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
} as DomPurifyConfig;

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

export const sanitizeHtml = (dirty: string, config?: DomPurifyConfig): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, config ?? HTML_CONFIG);
};

export const sanitizeText = (dirty: string): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], KEEP_CONTENT: true }).trim();
};

export const sanitizeEmail = (dirty: string): string => {
  const clean = sanitizeText(dirty).toLowerCase();
  return clean.replace(/[^\w@.+-]/g, '');
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = sanitizeText(url);
  try {
    const parsed = new URL(trimmed, 'http://localhost');
    if (!SAFE_PROTOCOLS.includes(parsed.protocol)) {
      return 'about:blank';
    }
    return parsed.href.replace('http://localhost', '');
  } catch {
    return 'about:blank';
  }
};

const sanitizeUnknown = (value: unknown, keyHint?: string): unknown => {
  if (typeof value === 'string') {
    if (keyHint?.toLowerCase().includes('html')) return sanitizeHtml(value);
    if (keyHint?.toLowerCase().includes('url')) return sanitizeUrl(value);
    if (keyHint?.toLowerCase().includes('email')) return sanitizeEmail(value);
    const trimmed = value.trim();
    if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
      return sanitizeUrl(trimmed);
    }
    if (/^javascript:/i.test(trimmed)) {
      return 'about:blank';
    }
    return sanitizeText(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeUnknown(entry));
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value as AnyObject);
  }
  return value;
};

export const sanitizeObject = <T extends AnyObject>(obj: T): T => {
  const sanitized: AnyObject = {};
  Object.entries(obj).forEach(([key, value]) => {
    sanitized[key] = sanitizeUnknown(value, key);
  });
  return sanitized as T;
};

export const sanitizeFormValues = <T>(data: T): T => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((entry) => sanitizeUnknown(entry)) as T;
  }

  const clone: AnyObject = { ...(data as AnyObject) };
  Object.entries(clone).forEach(([key, value]) => {
    if (typeof value === 'string') {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('email')) {
        clone[key] = sanitizeEmail(value);
      } else if (lowerKey.includes('url') || lowerKey.includes('website')) {
        clone[key] = sanitizeUrl(value);
      } else if (lowerKey.includes('html')) {
        clone[key] = sanitizeHtml(value);
      } else {
        clone[key] = sanitizeText(value);
      }
    } else if (Array.isArray(value) || (value && typeof value === 'object')) {
      clone[key] = sanitizeUnknown(value, key);
    } else {
      clone[key] = value;
    }
  });
  return clone as T;
};

export const createSanitizeValidator = (type: InputKind = 'text') => {
  return (value: string) => {
    if (typeof value !== 'string') {
      return value;
    }
    switch (type) {
      case 'html':
        return sanitizeHtml(value);
      case 'url':
        return sanitizeUrl(value);
      case 'email':
        return sanitizeEmail(value);
      default:
        return sanitizeText(value);
    }
  };
};
