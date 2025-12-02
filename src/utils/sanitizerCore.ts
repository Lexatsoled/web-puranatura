import DOMPurify from 'dompurify';
import sanitizerConfig from './sanitizerConfig.json';

type PurifyConfig = typeof sanitizerConfig & {
  ALLOWED_URI_REGEXP: RegExp;
};

const purifyConfig: PurifyConfig = {
  ...sanitizerConfig,
  ALLOWED_URI_REGEXP: new RegExp(sanitizerConfig.ALLOWED_URI_REGEXP, 'i'),
};

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, purifyConfig);

export const sanitizeText = (text: string): string =>
  DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });

export const sanitizeUrl = (url: string): string => {
  const sanitized = DOMPurify.sanitize(url);
  const hasProtocol = /^https?:\/\//i.test(url);
  return hasProtocol ? sanitized : `https://${sanitized}`;
};
