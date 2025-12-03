import React, { useMemo } from 'react';
import { NextSeo, ProductJsonLd } from 'next-seo';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  ProductJsonLd as ProductJsonLdProps,
  ProductImage,
} from '../types/product';
import { generateBreadcrumbJsonLd } from '../utils/schemaGenerators';
import { sanitizeHtml } from '../utils/sanitizer';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductHero } from '../../pages/product/components/ProductHero';
import { ProductInfo } from '../../pages/product/components/ProductInfo';
import { useProductSeo } from '../../pages/product/hooks/useProductSeo';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, status } = useProductDetails(id);
  const { currentUrl, seoConfig } = useProductSeo(product);

  const breadcrumbs = useMemo(
    () => [
      { name: 'Inicio', url: '/' },
      { name: 'Tienda', url: '/store' },
      { name: product?.category ?? 'Tienda', url: `/store` },
      { name: product?.name ?? 'Producto', url: currentUrl },
    ],
    [product?.category, product?.name, currentUrl]
  );

  const sanitizedBreadcrumbJsonLd = useMemo(
    () => sanitizeHtml(JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs))),
    [breadcrumbs]
  );

  if (status === 'loading') {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!product || status === 'error') {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }

  return (
    <>
      <NextSeo {...seoConfig} />
      <ProductJsonLd
        productName={product.name}
        images={product.images.map((img: ProductImage) => img.full)}
        description={product.description}
        offers={{
          price: product.price,
          priceCurrency: 'EUR',
          availability: product.inStock ? 'InStock' : 'OutOfStock',
          url: currentUrl,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizedBreadcrumbJsonLd,
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <ProductHero product={product as ProductJsonLdProps} />
          <ProductInfo product={product as ProductJsonLdProps} />
        </motion.div>
      </div>
    </>
  );
};

export default ProductPage;
