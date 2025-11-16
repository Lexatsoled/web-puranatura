import { getCDNUrl } from './cdn';

const DEFAULT_BREAKPOINTS = [320, 480, 640, 768, 1024, 1280];

export interface GenerateSrcSetOptions {
  /**
   * Custom widths (in px) for the generated srcset entries.
   */
  widths?: number[];
  /**
   * Append a query fallback (?w=) for backends that resize dynamically.
   * Enabled por defecto.
   */
  includeWidthQueryFallback?: boolean;
}

const shouldPreferWebp = (ext: string) =>
  ['jpg', 'jpeg', 'png'].includes(ext.toLowerCase());

const encodePath = (path: string) => {
  // Encode each path segment so characters like spaces and commas
  // are converted to %20 and %2C respectively. We avoid encodeURI
  // because it leaves commas unencoded which breaks srcset lists.
  return path
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
};

const buildVariant = (
  directory: string,
  baseName: string,
  extension: string,
  width: number
) => encodePath(`${directory}${baseName}_${width}.${extension}`);

const buildQueryFallback = (
  cleanPath: string,
  originalQuery: string,
  width: number
) => {
  const queryPrefix = originalQuery ? `${originalQuery}&` : '';
  return encodePath(`${cleanPath}?${queryPrefix}w=${width}`);
};

/**
 * generateSrcSet
 *
 * Devuelve un string `srcset` responsivo basado en variantes optimizadas.
 * Intenta usar archivos estáticos con sufijos (`_320.webp`, `_640.webp`, etc.)
 * y agrega un fallback con query `?w=` para entornos que realicen resize dinámico.
 */
export const generateSrcSet = (
  imagePath: string,
  options: GenerateSrcSetOptions = {}
): string => {
  if (!imagePath || imagePath.startsWith('data:')) {
    return '';
  }

  const { widths = DEFAULT_BREAKPOINTS, includeWidthQueryFallback = true } =
    options;

  const [cleanPath, originalQuery = ''] = imagePath.split('?');
  const lastSlashIndex = cleanPath.lastIndexOf('/');
  const directory =
    lastSlashIndex >= 0 ? cleanPath.slice(0, lastSlashIndex + 1) : '';
  const filename =
    lastSlashIndex >= 0 ? cleanPath.slice(lastSlashIndex + 1) : cleanPath;

  const dotIndex = filename.lastIndexOf('.');
  const baseName = dotIndex >= 0 ? filename.slice(0, dotIndex) : filename;
  const extension = dotIndex >= 0 ? filename.slice(dotIndex + 1) : '';
  const variantExtension = shouldPreferWebp(extension)
    ? 'webp'
    : extension || 'webp';

  const entries = widths.map((width) => {
    const variant = buildVariant(directory, baseName, variantExtension, width);
    return `${getCDNUrl(variant)} ${width}w`;
  });

  if (includeWidthQueryFallback) {
    const fallbackWidth = widths[widths.length - 1] ?? 1280;
    entries.push(
      `${getCDNUrl(
        buildQueryFallback(cleanPath, originalQuery, fallbackWidth)
      )} ${fallbackWidth}w`
    );
  }

  const joined = Array.from(new Set(entries)).join(', ');
  return normalizeSrcSet(joined) || joined;
};

/**
 * normalizeSrcSet
 * A helper to ensure a srcset string is valid for the browser.
 * - trims entries
 * - converts numeric-only descriptors ("200") to "200w"
 * - tries to infer width from filenames like "_320.jpg" or "-320.webp"
 */
export const normalizeSrcSet = (srcSet?: string): string | undefined => {
  if (!srcSet) return undefined;
  // Helper: encode each path segment of a URL or relative path while
  // avoiding double-encoding. Works with absolute (https://...) and
  // relative (/path/...) URLs. Preserves query and hash.
  const encodeUrlSegments = (raw: string) => {
    if (!raw) return raw;
    // split off hash
    const [withoutHash, hash = ''] = raw.split('#', 2);
    // split off query
    const [pathPart, queryPart] = withoutHash.split('?', 2);

    // try absolute URL
    try {
      const maybe = new URL(raw);
      // encode each segment of pathname safely
      maybe.pathname = maybe.pathname
        .split('/')
        .map((seg) => {
          if (!seg) return ''; // keep empty for leading '/'
          try {
            return encodeURIComponent(decodeURIComponent(seg));
          } catch {
            return encodeURIComponent(seg);
          }
        })
        .join('/');
      return maybe.toString();
    } catch {
      // relative path: encode pathPart segments
      const encodedPath = pathPart
        .split('/')
        .map((seg) => {
          if (!seg) return '';
          try {
            return encodeURIComponent(decodeURIComponent(seg));
          } catch {
            return encodeURIComponent(seg);
          }
        })
        .join('/');
      // ensure commas are encoded (defensive, in case encodeURIComponent
      // behavior differs across environments)
      const encodedPathSafe = encodedPath.replace(/,/g, '%2C');
      const q = queryPart ? `?${queryPart}` : '';
      const h = hash ? `#${hash}` : '';
      return `${encodedPathSafe}${q}${h}`;
    }
  };

  // First, split by comma but be resilient to commas that may appear inside
  // filenames (e.g. "CoQ10, 100 mg Anverso.webp"). We attempt to re-join
  // pieces that were split incorrectly by looking for parts that don't look
  // like a filename (no dot) and merging them with the next part.
  const rawParts = srcSet.split(',').map((p) => p.trim());
  const candidates: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    let part = rawParts[i];
    // if part doesn't contain a dot (likely split inside filename), try to
    // merge with following parts until we find an extension-like segment.
    // Note: allow extension followed by whitespace (descriptor) so we don't
    // mistake a valid candidate like "..._320.webp 320w" for a partial piece.
    while (
      i + 1 < rawParts.length &&
      !/\.[a-z0-9]{2,4}(?:$|\s|\?)/i.test(part) // no extension yet (allow space after ext)
    ) {
      i++;
      part = `${part}, ${rawParts[i]}`;
    }
    if (part) candidates.push(part);
  }

  const normalized = candidates
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      // parse descriptor as the last whitespace-delimited token (if present)
      const lastSpace = entry.lastIndexOf(' ');
      let rawUrl: string;
      let maybeDesc = '';
      if (lastSpace > -1) {
        rawUrl = entry.slice(0, lastSpace).trim();
        maybeDesc = entry.slice(lastSpace + 1).trim();
      } else {
        rawUrl = entry;
      }

      const url = rawUrl || '';
      // normalize descriptor
      let desc = maybeDesc || '';
      if (!desc) {
        const match = url.match(/[_-](\d{2,4})(?=\.[a-z]{2,4}(?:$|\?))/i);
        if (match) desc = `${match[1]}w`;
      } else if (/^\d+$/.test(desc)) {
        desc = `${desc}w`;
      }

      const encodedUrl = encodeUrlSegments(url);
      return desc ? `${encodedUrl} ${desc}` : `${encodedUrl}`;
    })
    .join(', ');

  return normalized || undefined;
};

export const PRODUCT_IMAGE_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
