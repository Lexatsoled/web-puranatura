import React from 'react';
import { NextSeo, ProductJsonLd } from 'next-seo';
import { useParams, useLocation } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { motion } from 'framer-motion';
import { ProductImage } from '../types';
import { Product } from '../../types';
import { products } from '../../data/products';
import { generateBreadcrumbJsonLd } from '../utils/schemaGenerators';

// Helper function to get product by ID
const getProductById = (id: string | undefined): Product | null => {
  if (!id) return null;
  return products.find((product) => product.id === id) || null;
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  const seoConfig = useSeo({
    title: product?.name,
    description: product?.description,
    type: 'product',
    image: product?.images[0]?.full,
  });

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/store' },
    { name: product.category, url: `/store/category/${product.category}` },
    { name: product.name, url: currentUrl },
  ];

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
          availability: 'InStock', // product.inStock ? 'InStock' : 'OutOfStock',
          url: currentUrl,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs)),
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
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl text-gray-600">${product.price.toFixed(2)}</p>
            <div className="prose prose-green">
              <p>{product.description}</p>
            </div>

            {/* <div className="space-y-4">
              <h2 className="text-xl font-semibold">Beneficios:</h2>
              <ul className="list-disc list-inside space-y-2">
                {product.benefits?.map((benefit: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div> */}

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
