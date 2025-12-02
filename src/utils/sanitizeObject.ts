import { sanitizeHtml, sanitizeText, sanitizeUrl } from './sanitizerCore';

const isString = (value: unknown): value is string => typeof value === 'string';
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const sanitizePrimitiveByKey = (key: string, value: string) => {
  const lower = key.toLowerCase();
  if (lower.includes('html')) {
    return sanitizeHtml(value);
  }
  if (lower.includes('url')) {
    return sanitizeUrl(value);
  }
  return sanitizeText(value);
};

const sanitizeUnknown = (value: unknown, keyHint = ''): unknown => {
  if (isString(value)) {
    return sanitizePrimitiveByKey(keyHint, value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeUnknown(item));
  }
  if (isPlainObject(value)) {
    return sanitizeObject(value);
  }
  return value;
};

export function sanitizeObject<T extends object>(obj: T): T {
  const entries = Object.entries(obj).map(([key, value]) => [
    key,
    sanitizeUnknown(value, key),
  ]);
  return Object.fromEntries(entries) as T;
}
