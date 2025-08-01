import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface ProductCompareProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  maxProducts?: number;
}

const ProductCompare: React.FC<ProductCompareProps> = ({
  products,
  onProductSelect,
  onRemoveProduct,
  maxProducts = 3,
}) => {
  const [showDifferences, setShowDifferences] = useState(false);

  // Calcular las características comunes y diferentes
  const comparison = useMemo(() => {
    if (products.length < 2) return null;

    const allFeatures = new Set<string>();
    const commonFeatures = new Set<string>();
    const differentFeatures = new Set<string>();

    // Extraer todas las características y beneficios
    products.forEach((product) => {
      if (product.benefits) {
        product.benefits.forEach((benefit) => allFeatures.add(benefit));
      }
    });

    // Identificar características comunes y diferentes
    allFeatures.forEach((feature) => {
      const hasFeature = products.every((product) =>
        product.benefits?.includes(feature)
      );
      if (hasFeature) {
        commonFeatures.add(feature);
      } else {
        differentFeatures.add(feature);
      }
    });

    return {
      common: Array.from(commonFeatures),
      different: Array.from(differentFeatures),
    };
  }, [products]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Comparar Productos ({products.length}/{maxProducts})
        </h2>
        {products.length >= 2 && (
          <button
            onClick={() => setShowDifferences(!showDifferences)}
            className="text-green-600 hover:text-green-700 font-medium flex items-center"
          >
            {showDifferences ? 'Mostrar Todo' : 'Mostrar Diferencias'}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex space-x-6 min-w-full">
          {/* Productos */}
          <AnimatePresence initial={false}>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="w-72 flex-shrink-0"
                initial="enter"
                animate="center"
                exit="exit"
                variants={slideVariants}
                custom={index}
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {/* Cabecera del producto */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={product.images[0].url}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    aspectRatio={1}
                  />
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                    aria-label="Eliminar de la comparación"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="text-xl font-bold text-green-600 mb-4">
                  DOP ${product.price.toFixed(2)}
                </div>

                {/* Características */}
                <div className="space-y-3">
                  {(!showDifferences || !comparison) &&
                    product.benefits?.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-start text-sm text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{benefit}</span>
                      </div>
                    ))}

                  {showDifferences &&
                    comparison?.different.map((feature) => {
                      const hasFeature = product.benefits?.includes(feature);
                      return (
                        <div
                          key={feature}
                          className="flex items-start text-sm text-gray-600"
                        >
                          {hasFeature ? (
                            <svg
                              className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          <span>{feature}</span>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Añadir producto */}
          {products.length < maxProducts && (
            <div className="w-72 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
              <button
                onClick={() => {
                  // Aquí puedes implementar la lógica para mostrar un modal de selección de productos
                }}
                className="p-6 text-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="block font-medium">
                  Agregar Producto para Comparar
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      {products.length >= 2 && (
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => products.forEach((p) => onRemoveProduct(p.id))}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            Limpiar Todo
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Compartir Comparación
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCompare;
