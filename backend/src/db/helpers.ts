import validator from 'validator';

export const sanitizeDbString = (value: string): string =>
  validator.escape(validator.trim(value ?? ''));

export const sanitizeOptionalString = (value?: string | null): string | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return sanitizeDbString(value);
};

export const sanitizePhone = (value: string): string =>
  validator.whitelist(value ?? '', '+0-9 ()-').trim();

export const clampNumber = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const sanitizeAddress = <T extends Record<string, unknown>>(address: T): T => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(address).forEach(([key, val]) => {
    if (typeof val === 'string') {
      cleaned[key] = key.toLowerCase().includes('phone')
        ? sanitizePhone(val)
        : sanitizeDbString(val);
    } else {
      cleaned[key] = val;
    }
  });
  return cleaned as T;
};
