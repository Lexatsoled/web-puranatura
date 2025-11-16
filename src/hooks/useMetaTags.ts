import React from 'react';

interface MetaTagsOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export const useMetaTags = () => {
  const setMetaTags = React.useCallback((options: MetaTagsOptions) => {
    const {
      title = 'Pureza Naturalis - Terapias Naturales',
      description = 'Productos naturales y terapias holísticas para tu bienestar',
      image = '/og-image.jpg',
      url = typeof window !== 'undefined' ? window.location.href : '',
      type = 'website',
    } = options;

    if (typeof document === 'undefined') return;

    document.title = title;

    const updateMetaTag = (
      property: string,
      content: string,
      useProperty = false
    ) => {
      const selector = useProperty
        ? `meta[property="${property}"]`
        : `meta[name="${property}"]`;

      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (useProperty) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Standard
    updateMetaTag('description', description);

    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', `https://web.purezanaturalis.com${image}`, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Pureza Naturalis', true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `https://web.purezanaturalis.com${image}`);

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, []);

  return { setMetaTags };
};

export default useMetaTags;

