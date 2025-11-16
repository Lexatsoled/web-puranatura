import { useLocation } from 'react-router-dom';
import { NextSeoProps } from 'next-seo';
import { DEFAULT_SEO_CONFIG } from '../config/seo.config';

interface SeoProps extends Partial<NextSeoProps> {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  url?: string;
}

export const useSeo = (props: SeoProps = {}): NextSeoProps => {
  const location = useLocation();
  const currentUrl = `${DEFAULT_SEO_CONFIG.openGraph?.url}${location.pathname}`;

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
