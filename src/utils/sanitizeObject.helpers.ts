import { sanitizeHTML, sanitizeText, sanitizeUrl } from './sanitizerCore';

type InputValue = unknown;

const isString = (value: InputValue): value is string =>
  typeof value === 'string';

const isPlainObject = (value: InputValue): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

type Sanitizer = (value: string) => string;

const SANITIZER_RULES: ReadonlyArray<[RegExp, Sanitizer]> = [
  [/html/i, sanitizeHTML],
  [/url/i, sanitizeUrl],
];

const findSanitizer = (key: string): Sanitizer => {
  const match = SANITIZER_RULES.find(([matcher]) => matcher.test(key));
  return match ? match[1] : sanitizeText;
};

const sanitizePrimitiveByKey = (key: string, value: string) =>
  findSanitizer(key)(value);

export const sanitizeArray = (values: InputValue[]) =>
  values.map((item) => sanitizeUnknown(item));

export const sanitizeRecord = (record: Record<string, InputValue>) =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      sanitizeUnknown(value, key),
    ])
  ) as Record<string, unknown>;

export const sanitizeUnknown = (value: InputValue, keyHint = ''): unknown => {
  if (isString(value)) {
    return sanitizePrimitiveByKey(keyHint, value);
  }
  if (Array.isArray(value)) {
    return sanitizeArray(value);
  }
  if (isPlainObject(value)) {
    return sanitizeRecord(value);
  }
  return value;
};
