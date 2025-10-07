import { DefaultSeoProps } from 'next-seo';

export const DEFAULT_SEO_CONFIG: DefaultSeoProps = {
  titleTemplate: '%s | Pureza Naturalis - Terapias Naturales',
  defaultTitle: 'Pureza Naturalis - Terapias Naturales y Suplementos',
  description: 'Descubre nuestra selección de terapias naturales y suplementos de alta calidad. Productos naturales para tu bienestar y salud.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.purezanaturalis.com/',
    siteName: 'Pureza Naturalis',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pureza Naturalis - Terapias Naturales',
      },
    ],
  },
  twitter: {
    handle: '@purezanaturalis',
    site: '@puranatura',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#4CAF50',
    },
  ],
};
