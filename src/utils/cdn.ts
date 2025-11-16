const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const resolveBaseUrl = () =>
  (import.meta.env?.VITE_CDN_BASE_URL ?? '').toString().trim().replace(/\/+$/, '');

const stripLeadingSlash = (value: string) => value.replace(/^\/+/, '');

export const isCDNEnabled = () => Boolean(resolveBaseUrl());

export function getCDNUrl(path: string): string {
  if (!path) {
    return '';
  }

  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }
  const baseUrl = resolveBaseUrl();
  const [cleanPath, query = ''] = path.split('?');
  const normalizedPath = stripLeadingSlash(cleanPath);

  // Encode each path segment to ensure spaces, commas and other
  // special characters are percent-encoded. This avoids producing
  // img.src values with raw spaces which can cause src/srcset parse
  // warnings in some browsers.
  const encodeSegments = (p: string) =>
    p
      .split('/')
      .map((seg) => {
        try {
          // If segment is already encoded, decode then re-encode to
          // avoid double-encoding (e.g. %20 -> space -> %20)
          const decoded = decodeURIComponent(seg);
          return encodeURIComponent(decoded);
        } catch {
          return encodeURIComponent(seg);
        }
      })
      .join('/');

  const encodedPath = encodeSegments(normalizedPath).replace(/%2C/g, '%2C');
  const suffix = query ? `?${query}` : '';

  if (!baseUrl) {
    // No CDN base configured: return a relative path but encoded
    return `/${encodedPath}${suffix}`;
  }

  return `${baseUrl}/${encodedPath}${suffix}`;
}
