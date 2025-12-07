import { NextSeo, ProductJsonLd } from 'next-seo';
// Use CSS transition for page entrance; avoid framer-motion in route pages
import { useParams } from 'react-router-dom';
import { Product, ProductImage } from '../types/product';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductHero } from '../../pages/product/components/ProductHero';
import { ProductInfo } from '../../pages/product/components/ProductInfo';
import { useProductSeo } from '../../pages/product/hooks/useProductSeo';
import { useProductBreadcrumbs } from './product/hooks/useProductBreadcrumbs';
import BreadcrumbStructuredData from '../../components/product/BreadcrumbStructuredData';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, status } = useProductDetails(id);
  const { currentUrl, seoConfig } = useProductSeo(product);
  const { sanitizedBreadcrumbJsonLd } = useProductBreadcrumbs(
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
      <BreadcrumbStructuredData sanitizedJson={sanitizedBreadcrumbJsonLd} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-transform duration-500 ease-out transform-gpu">
          <ProductHero product={product as Product} />
          <ProductInfo product={product as Product} />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
