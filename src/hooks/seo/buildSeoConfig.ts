import { NextSeoProps } from 'next-seo';
import { DEFAULT_SEO_CONFIG } from '../../config/seo.config';

type SeoProps = Partial<NextSeoProps> & {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  url?: string;
};

export const normalizeBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export const buildSeoConfig = (
  props: SeoProps,
  baseUrl: string,
  path: string
): NextSeoProps => {
  const currentUrl = `${baseUrl}${path}`;
  return {
    ...DEFAULT_SEO_CONFIG,
    title: props.title,
    description: props.description || DEFAULT_SEO_CONFIG.description,
    canonical: props.url || currentUrl,
    openGraph: {
      ...DEFAULT_SEO_CONFIG.openGraph,
      title: props.title,
      description: props.description || DEFAULT_SEO_CONFIG.description,
      url: props.url || currentUrl,
      type: props.type || 'website',
      images: props.image
        ? [
            {
              url: props.image,
              width: 1200,
              height: 630,
              alt: props.title || DEFAULT_SEO_CONFIG.defaultTitle,
            },
          ]
        : DEFAULT_SEO_CONFIG.openGraph?.images,
    },
  };
};

export type { SeoProps };
