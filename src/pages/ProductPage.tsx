import {
  errorLogger,
  ErrorSeverity,
  ErrorCategory,
} from '../services/errorLogger';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { generateProductSEO } from '../utils/seo';
import { generateSrcSet, PRODUCT_IMAGE_SIZES } from '../utils/image';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useNavigationState } from '../hooks/useNavigationState';
import QuantitySelector from '../components/QuantitySelector';
import ImageZoom from '../components/ImageZoom';
import ProductTabs from '../components/ProductTabs';
import ScientificReferences from '../components/ScientificReferences';
import { useProductStore } from '@/store/productStore';

// Helper types y funciones para manejo robusto de imágenes
const PLACEHOLDER_IMG = '/placeholder-product.jpg';

type AnyImage =
  | string
  | { full?: string; url?: string; src?: string; thumbnail?: string };

function pickUrl(img: AnyImage | null | undefined): string | null {
  if (!img) return null;
  if (typeof img === 'string') return img.trim() || null;
  const candidates = [img.full, img.url, img.src].filter(
    (x) => typeof x === 'string' && x.trim()
  );
  return (candidates[0] as string | undefined) ?? null;
}

function pickThumb(img: AnyImage | null | undefined): string | null {
  if (!img) return null;
  if (typeof img === 'string') return img.trim() || null;
  const candidates = [img.thumbnail, img.full, img.url, img.src].filter(
    (x) => typeof x === 'string' && x.trim()
  );
  return (candidates[0] as string | undefined) ?? null;
}

const ProductPage: React.FC = () => {
  // TODOS LOS HOOKS AL INICIO (antes de cualquier early return)
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = useCartStore((s) => s.addToCart);
  const getItemQuantity = useCartStore((s) => s.getItemQuantity);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { returnToStore, getNavigationState } = useNavigationState();
  const fetchProductById = useProductStore((state) => state.fetchProductById);

  useScrollToTop([productId]);

  // Computar todas las variables derivadas de Hooks ANTES de early returns
  const hasStoredState = getNavigationState() !== null;
  const quantity = product ? getItemQuantity(product.id) : 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  const mainImageUrl = useMemo(() => {
    if (
      !product ||
      !Array.isArray(product.images) ||
      product.images.length === 0
    ) {
      return ''; // ImageZoom mostrará su placeholder
    }
    const entry = product.images[selectedImageIndex] ?? product.images[0];
    return pickUrl(entry) ?? '';
  }, [product, selectedImageIndex]);

  const mainImageSrcSet = useMemo(() => {
    return mainImageUrl ? generateSrcSet(mainImageUrl) : '';
  }, [mainImageUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }
      try {
        const resolved = await fetchProductById(productId);
        if (cancelled) return;
        if (resolved) {
          setProduct(resolved);
          const seo = generateProductSEO(resolved);
          if (seo.title) document.title = seo.title;
          const meta = document.querySelector('meta[name="description"]');
          if (meta && seo.description)
            meta.setAttribute('content', seo.description);
        } else {
          navigate('/tienda');
        }
      } catch (error) {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.MEDIUM,
          ErrorCategory.API,
          { context: 'ProductPage', action: 'fetchProductById', productId }
        );
        if (!cancelled) {
          navigate('/tienda');
        }
      }
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProductById, navigate, productId]);

  // Early returns DESPUÉS de todos los Hooks
  if (isLoading) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-emerald-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Producto no encontrado
          </h1>
          <Link
            to="/tienda"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => addToCart(product, selectedQuantity);
  const handleWishlistToggle = () => toggleItem(product);

  const safe = (s?: string) => {
    const t = s ?? '';
    return t
      .replace(/[\\u0000-\\u001f\\u007f]/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim();
  };

  return (
    <div className="bg-emerald-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="flex justify-between items-center mb-8"
          aria-label="Breadcrumb"
        >
          <div className="flex-1">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <Link
                    to="/tienda"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2"
                  >
                    Tienda
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </div>
          {hasStoredState && (
            <div className="flex-shrink-0 ml-4">
              <button
                onClick={returnToStore}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:text-green-800 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Volver a la lista
              </button>
            </div>
          )}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start"
        >
          {/* Galería */}
          <div className="flex flex-col-reverse">
            <div className="w-full">
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <ImageZoom
                  src={mainImageUrl || PLACEHOLDER_IMG}
                  srcSet={mainImageSrcSet}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt={product.name}
                  zoom={2}
                  loading="eager"
                  decoding="sync"
                  className="w-full max-w-lg mx-auto"
                />
              </div>
              <div className="mt-6 w-full max-w-2xl mx-auto lg:max-w-none">
                <div className="flex flex-wrap justify-center gap-4">
                  {(product.images ?? []).length > 0 ? (
                    product.images.map((image, index) => {
                      const url = pickUrl(image);
                      const thumb = pickThumb(image);
                      const thumbnailSrcSet = url
                        ? generateSrcSet(url, {
                            widths: [120, 160, 240],
                            includeWidthQueryFallback: false,
                          })
                        : '';

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-20 w-20 bg-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            index === selectedImageIndex
                              ? 'ring-2 ring-green-600 shadow-lg transform scale-105'
                              : 'border border-gray-200 hover:border-green-400 hover:shadow'
                          }`}
                          disabled={!url}
                          title={url ? `Imagen ${index + 1}` : 'Sin imagen'}
                        >
                          <span className="sr-only">Imagen {index + 1}</span>
                          {thumb ? (
                            <img
                              src={thumb}
                              srcSet={thumbnailSrcSet}
                              sizes="80px"
                              alt={`Vista ${index + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-16 h-16 object-contain p-1"
                            />
                          ) : (
                            <div className="w-16 h-16 grid place-items-center text-xs text-gray-400">
                              N/D
                            </div>
                          )}
                          {index === selectedImageIndex && (
                            <span className="absolute inset-0 border-2 border-green-600 rounded-lg pointer-events-none"></span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Este producto no tiene imágenes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">
              {product.name}
            </h1>
            <div className="mt-3">
              <p className="text-3xl text-gray-900 font-bold">
                {product.price.toFixed(2)} RDS
              </p>
            </div>

            <div className="mt-6">
              <QuantitySelector
                value={selectedQuantity}
                onChange={setSelectedQuantity}
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`px-4 py-3 rounded-md transition-colors font-medium ${product.stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {product.stock === 0
                    ? 'Agotado'
                    : quantity > 0
                      ? `En carrito (${quantity}) - Añadir ${selectedQuantity} más`
                      : `Agregar al carrito ${selectedQuantity > 1 ? `(${selectedQuantity})` : ''}`}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-4 py-3 rounded-md border transition-colors font-medium ${inWishlist ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {inWishlist
                    ? 'En lista de deseos'
                    : 'Agregar a mi lista de deseos'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pestañas */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 font-display">
            Información del producto
          </h3>
          <ProductTabs
            tabs={[
              {
                id: 'description',
                label: 'Descripción Detallada',
                content: (
                  <div>
                    {product?.detailedDescription && (
                      <>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                          Acerca de {product?.name}
                        </h4>
                        <p className="mb-6">{product?.detailedDescription}</p>
                      </>
                    )}
                    {product?.mechanismOfAction && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          Mecanismo de acción
                        </h4>
                        <p className="mb-6">{product?.mechanismOfAction}</p>
                      </>
                    )}
                    {Array.isArray(product?.benefitsDescription) &&
                      product.benefitsDescription.length > 0 && (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            Beneficios
                          </h4>
                          <ul className="list-disc pl-6 mb-6 space-y-2">
                            {product.benefitsDescription.map((benefit, idx) => (
                              <li key={idx} className="text-gray-700">
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    {Array.isArray(product?.healthIssues) &&
                      product.healthIssues.length > 0 && (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            Ayuda con
                          </h4>
                          <ul className="list-disc pl-6 mb-6 space-y-2">
                            {product.healthIssues.map((issue, idx) => (
                              <li key={idx} className="text-gray-700">
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                  </div>
                ),
              },
              {
                id: 'components',
                label: 'Componentes',
                content: (
                  <div>
                    {product.components && product.components.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Componente
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Descripción
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Cantidad
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {product.components.map((c, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-2 text-gray-800">
                                  {c.name}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                  {c.description}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                  {c.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        No hay información sobre componentes disponible para
                        este producto.
                      </p>
                    )}
                  </div>
                ),
              },
              {
                id: 'usage',
                label: 'Modo de empleo',
                content: (
                  <div>
                    {product.usage ||
                    product.dosage ||
                    product.administrationMethod ? (
                      <>
                        {product.usage && (
                          <>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">
                              Instrucciones de uso
                            </h4>
                            <p className="mb-6 text-gray-700">
                              {product.usage}
                            </p>
                          </>
                        )}
                        {product.dosage && (
                          <>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">
                              Dosis recomendada
                            </h4>
                            <p className="mb-6 text-gray-700">
                              {product.dosage}
                            </p>
                          </>
                        )}
                        {product.administrationMethod && (
                          <>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">
                              Forma de administración
                            </h4>
                            <p className="mb-6 text-gray-700">
                              {product.administrationMethod}
                            </p>
                          </>
                        )}
                        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                          <h4 className="text-lg font-medium text-blue-800 mb-2">
                            Aviso importante
                          </h4>
                          <p className="text-blue-700">
                            Los suplementos dietéticos no deben utilizarse como
                            sustituto de una dieta variada y equilibrada. No
                            exceda la dosis diaria recomendada. Si está
                            embarazada, amamantando, tomando medicamentos o
                            tiene una condición médica, consulte a un
                            profesional de la salud antes de usar.
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">
                        No hay información sobre el modo de empleo disponible
                        para este producto.
                      </p>
                    )}
                  </div>
                ),
              },
              {
                id: 'faqs',
                label: 'Preguntas frecuentes',
                content: (
                  <div>
                    {product.faqs && product.faqs.length > 0 ? (
                      <div className="space-y-6">
                        {product.faqs.map((faq, idx) => (
                          <div
                            key={idx}
                            className="border-b border-gray-200 pb-6 last:border-0"
                          >
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                              {safe(faq.question)}
                            </h4>
                            <div
                              className="text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(safe(faq.answer)),
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        No hay preguntas frecuentes disponibles para este
                        producto.
                      </p>
                    )}
                  </div>
                ),
              },
              {
                id: 'scientific-references',
                label: 'Referencias Científicas',
                content: <ScientificReferences product={product} />,
              },
            ]}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
