// import { NextSeo, ProductJsonLd } from 'next-seo'; // Removed
// Use CSS transition for page entrance; avoid framer-motion in route pages
import { useParams } from 'react-router-dom';
import { Product } from '../types/product';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductHero } from './product/components/ProductHero';
import { ProductInfo } from './product/components/ProductInfo';
import { useProductSeo } from './product/hooks/useProductSeo';
import { useProductBreadcrumbs } from './product/hooks/useProductBreadcrumbs';
import BreadcrumbStructuredData from '../components/product/BreadcrumbStructuredData';
import { ProductRichDetails } from './product/components/ProductRichDetails';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, status } = useProductDetails(id);
  const { currentUrl, seoConfig } = useProductSeo(product);
  const { breadcrumbJsonLd } = useProductBreadcrumbs(
    product ?? undefined,
    currentUrl
  );

  if (status === 'loading') {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!product || status === 'error') {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }

  return (
    <>
      {/* Native React 19 SEO Support */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      <meta property="og:title" content={seoConfig.openGraph?.title} />
      <meta
        property="og:description"
        content={seoConfig.openGraph?.description}
      />
      <meta property="og:type" content="product" />
      <meta property="og:url" content={seoConfig.openGraph?.url} />
      {seoConfig.openGraph?.images?.map((img: any) => (
        <meta property="og:image" content={img.url} key={img.url} />
      ))}
      <meta property="product:price:amount" content={String(product.price)} />
      <meta property="product:price:currency" content="EUR" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.images.map((img) => img.full),
          description: product.description,
          sku: product.sku,
          mpn: product.sku,
          brand: {
            '@type': 'Brand',
            name: 'PuraNatura',
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: product.price,
            availability: product.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: currentUrl,
          },
        })}
      </script>

      <BreadcrumbStructuredData data={breadcrumbJsonLd} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-transform duration-500 ease-out transform-gpu">
          <ProductHero product={product as Product} />
          <ProductInfo product={product as Product} />
        </div>
        <ProductRichDetails product={product as Product} />
      </div>
    </>
  );
};

export default ProductPage;
