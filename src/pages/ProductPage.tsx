import React, { useEffect, useMemo, useState } from 'react';
import { NextSeo, ProductJsonLd } from 'next-seo';
import { useParams, useLocation } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { motion } from 'framer-motion';
import { Product, ProductImage } from '../types/product';
import { products as legacyProducts } from '../../data/products';
import { generateBreadcrumbJsonLd } from '../utils/schemaGenerators';
import { sanitizeHtml } from '../utils/sanitizer';
import { sanitizeProductContent } from '../utils/contentSanitizers';
import { useApi } from '../utils/api';
import { mapApiProduct, ApiProduct } from '../utils/productMapper';
import { formatCurrency } from '../utils/intl';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  const fallbackProducts = useMemo(
    () => legacyProducts.map((legacy) => sanitizeProductContent(legacy)),
    []
  );

  useEffect(() => {
    if (!id) {
      setStatus('error');
      return;
    }

    let active = true;
    const fetchProduct = async () => {
      setStatus('loading');
      try {
        const apiProduct = await api.get<ApiProduct>(`/products/${id}`);
        if (!active) return;
        setProduct(sanitizeProductContent(mapApiProduct(apiProduct)));
        setStatus('ready');
      } catch (error) {
        console.error('Error cargando producto', error);
        if (!active) return;
        const fallback = fallbackProducts.find((item) => item.id === id);
        if (fallback) {
          setProduct(fallback);
          setStatus('ready');
        } else {
          setStatus('error');
        }
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [api, fallbackProducts, id]);

  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  const seoConfig = useSeo({
    title: product?.name,
    description: product?.description,
    type: 'product',
    image: product?.images[0]?.full,
  });

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
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={product.images[0]?.full}
              alt={product.name}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl text-gray-600">
              {formatCurrency(product.price)}
            </p>
            <div className="prose prose-green">
              <p>{product.description}</p>
            </div>

            <button
              type="button"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              Añadir al carrito
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProductPage;
