import { Product } from '../../../types/product';

export const useProductSeo = (product: Product | null | undefined) => {
  if (!product) {
    return {
      currentUrl: '',
      seoConfig: {
        title: 'Producto no encontrado - PuraNatura',
        description: 'El producto que buscas no está disponible.',
      },
    };
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = `${product.name} - PuraNatura`;
  const description =
    product.description || `Compra ${product.name} en PuraNatura.`;
  const images = product.images.map((img) => ({
    url: img.full,
    width: 800,
    height: 600,
    alt: img.alt || product.name,
  }));

  return {
    currentUrl,
    seoConfig: {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'product',
        url: currentUrl,
        images,
        price: {
          amount: product.price,
          currency: 'EUR',
        },
      },
    },
  };
};
