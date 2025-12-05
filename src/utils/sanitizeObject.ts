import { sanitizeRecord } from './sanitizeObject.helpers';

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  return sanitizeRecord(obj) as T;
}
