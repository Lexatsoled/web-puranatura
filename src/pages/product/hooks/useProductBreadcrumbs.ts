import { useMemo } from 'react';
import { Product } from '../../../types/product';
import { generateBreadcrumbJsonLd } from '../../../utils/schemaGenerators';

interface Breadcrumb {
  name: string;
  url: string;
}

export const useProductBreadcrumbs = (
  product: Product | undefined,
  currentUrl: string
) => {
  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
    const baseBreadcrumbs: Breadcrumb[] = [
      { name: 'Inicio', url: '/' },
      { name: 'Tienda', url: '/store' },
    ];

    const productBreadcrumb = {
      name: product?.category ?? 'Tienda',
      url: '/store',
    };

    const detailBreadcrumb = {
      name: product?.name ?? 'Producto',
      url: currentUrl,
    };

    return [...baseBreadcrumbs, productBreadcrumb, detailBreadcrumb];
  }, [currentUrl, product?.category, product?.name]);

  const breadcrumbJsonLd = useMemo(() => {
    return generateBreadcrumbJsonLd(breadcrumbs);
  }, [breadcrumbs]);

  return { breadcrumbs, breadcrumbJsonLd };
};
