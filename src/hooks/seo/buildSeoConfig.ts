// import { NextSeoProps } from 'next-seo'; // Removed
import { DEFAULT_SEO_CONFIG } from '../../config/seo.config';
import {
  buildCurrentUrl,
  buildOpenGraphImages,
} from './buildSeoConfig.helpers';

type SeoProps = {
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
) => {
  const currentUrl = buildCurrentUrl(baseUrl, path);
  const description = props.description || DEFAULT_SEO_CONFIG.description;
  const canonical = props.url || currentUrl;
  const type = props.type || 'website';
  return {
    ...DEFAULT_SEO_CONFIG,
    title: props.title,
    description,
    canonical,
    openGraph: {
      ...DEFAULT_SEO_CONFIG.openGraph,
      title: props.title,
      description,
      url: canonical,
      type,
      images: buildOpenGraphImages(props.image, props.title),
    },
  };
};

export type { SeoProps };
