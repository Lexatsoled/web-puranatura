// Import types from next-seo removed; file uses plain inlined types for images
import { DEFAULT_SEO_CONFIG } from '../../config/seo.config';

export const buildCurrentUrl = (baseUrl: string, path: string) =>
  `${baseUrl}${path}`;

export const makeImageCard = (imageUrl: string, altText: string) => ({
  url: imageUrl,
  width: 1200,
  height: 630,
  alt: altText,
});

export const buildOpenGraphImages = (
  image?: string,
  title?: string
):
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }[]
  | undefined => {
  if (image) {
    // Prefer provided title, otherwise fall back to defaultTitle (string)
    const alt = title ?? DEFAULT_SEO_CONFIG.defaultTitle ?? '';
    return [makeImageCard(image, alt)];
  }

  // If the default config provides an `openGraph.images` array, return it
  // otherwise return undefined. Use an explicit guard so TypeScript narrows
  // the union safely.
  if (
    DEFAULT_SEO_CONFIG.openGraph &&
    'images' in DEFAULT_SEO_CONFIG.openGraph
  ) {
    // TypeScript's OpenGraph type may not include images in a way that narrows cleanly,
    // cast to any to read the runtime value safely and preserve the declared return type.
    return (DEFAULT_SEO_CONFIG.openGraph as any).images as {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }[];
  }

  return undefined;
};
