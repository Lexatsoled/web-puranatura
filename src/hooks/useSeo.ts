import { useLocation } from 'react-router-dom';
import { NextSeoProps } from 'next-seo';
import {
  buildSeoConfig,
  normalizeBaseUrl,
  SeoProps,
} from './seo/buildSeoConfig';
import { DEFAULT_SEO_CONFIG } from '../config/seo.config';

export const useSeo = (props: SeoProps = {}): NextSeoProps => {
  const location = useLocation();
  const baseUrl =
    import.meta.env.VITE_APP_URL ||
    DEFAULT_SEO_CONFIG.openGraph?.url ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl || '');
  const path = `${location.pathname}${location.search}`;

  return buildSeoConfig(props, normalizedBaseUrl, path);
};
