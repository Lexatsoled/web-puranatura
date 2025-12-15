import DOMPurify from 'dompurify';
import sanitizerConfig from './sanitizerConfig.json';

type PurifyConfig = Omit<typeof sanitizerConfig, 'ALLOWED_URI_REGEXP'> & {
  ALLOWED_URI_REGEXP: RegExp;
};

const purifyConfig: PurifyConfig = {
  ...sanitizerConfig,
  ALLOWED_URI_REGEXP: new RegExp(sanitizerConfig.ALLOWED_URI_REGEXP, 'i'),
};

export const sanitizeHTML = (html: string): string =>
  DOMPurify.sanitize(html, purifyConfig);

export const sanitizeText = (text: string): string =>
  DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });

export const sanitizeUrl = (url: string): string => {
  const sanitized = DOMPurify.sanitize(url);
  const isRelative = sanitized.startsWith('/');
  const hasProtocol = /^https?:\/\//i.test(sanitized);
  return hasProtocol || isRelative ? sanitized : `https://${sanitized}`;
};
