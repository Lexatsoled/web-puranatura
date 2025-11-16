const DEFAULT_SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'secret',
  'apikey',
  'cc',
  'creditcard',
  'cardnumber',
  'cvv',
  'ssn',
];

const ADDRESS_KEYWORDS = [
  'address',
  'direccion',
  'street',
  'calle',
  'avenue',
  'avenida',
  'road',
  'roadway',
  'route',
  'lane',
  'lane',
  'boulevard',
  'bulevard',
  'blk',
  'sector',
  'colony',
  'colonia',
  'city',
  'ciudad',
  'state',
  'estado',
  'zip',
  'postal',
  'suite',
  'unit',
  'apt',
  'floor',
];

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?){0,1}(\(?\d{2,5}\)?[-.\s]?)?(\d{3,4}[-.\s]?){1,2}\d{2,4}/;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/;
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/;
const ADDRESS_CONTENT_REGEX = /\d{1,5}\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+/;

const DEFAULT_CENSOR = '[REDACTED]';

interface RedactionOptions {
  sensitiveFields?: string[];
  censor?: string;
}

const normalizeKey = (key?: string) => key?.toLowerCase() ?? '';

const isSensitiveKey = (sensitiveFields: string[], key?: string) => {
  const normalized = normalizeKey(key);
  return sensitiveFields.some((field) => normalized.includes(field));
};

const isAddressKey = (key?: string) => {
  const normalized = normalizeKey(key);
  return ADDRESS_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) {
    return DEFAULT_CENSOR;
  }
  const visiblePortion = local.slice(0, Math.min(2, local.length));
  return `${visiblePortion}***@${domain.trim()}`;
};

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  const suffix = digits.slice(-4);
  return suffix ? `***${suffix}` : '***';
};

const maskSSN = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const suffix = digits.slice(-4);
  return suffix ? `***-**-${suffix}` : '***-**-****';
};

const maskCreditCard = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const suffix = digits.slice(-4);
  if (!suffix) {
    return '****';
  }
  return `**** **** **** ${suffix}`;
};

const maskAddress = (value: string) => value.replace(/\d/g, '*');

export const maskIp = (ip?: string | null) => {
  if (!ip) return ip ?? '';
  if (ip.includes(':')) {
    const segments = ip.split(':');
    if (segments.length > 2) {
      return `${segments[0]}:${segments[1]}:**:**`;
    }
    return ip;
  }
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip;
};

const maskByPattern = (value: string, key?: string) => {
  if (EMAIL_REGEX.test(value)) {
    return maskEmail(value);
  }

  if (SSN_REGEX.test(value)) {
    return maskSSN(value);
  }

  if (CREDIT_CARD_REGEX.test(value)) {
    return maskCreditCard(value);
  }

  if (PHONE_REGEX.test(value)) {
    return maskPhone(value);
  }

  if (isAddressKey(key) || ADDRESS_CONTENT_REGEX.test(value)) {
    return maskAddress(value);
  }

  return value;
};

const redactValue = (input: unknown, options: RedactionOptions, key?: string): unknown => {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    if (isSensitiveKey(options.sensitiveFields ?? [], key)) {
      return options.censor ?? DEFAULT_CENSOR;
    }
    return maskByPattern(input, key);
  }

  if (Array.isArray(input)) {
    return input.map((item) => redactValue(item, options, key));
  }

  if (typeof input === 'object') {
    const redacted: Record<string, unknown> = {};
    for (const [entryKey, entryValue] of Object.entries(input as Record<string, unknown>)) {
      redacted[entryKey] = redactValue(entryValue, options, entryKey);
    }
    return redacted;
  }

  return input;
};

const buildSensitiveFields = (custom?: string[]) => {
  const baseFields = DEFAULT_SENSITIVE_KEYS.slice();
  if (custom && custom.length) {
    baseFields.push(...custom);
  }
  return baseFields.map((field) => field.toLowerCase());
};

export function redactPII<T>(value: T, options: RedactionOptions = {}): T {
  const sensitiveFields = buildSensitiveFields(options.sensitiveFields);
  return redactValue(value, { ...options, sensitiveFields }) as T;
}

export { maskEmail, maskPhone, maskSSN, maskCreditCard, maskAddress };
