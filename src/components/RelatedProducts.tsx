import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { OptimizedImage } from './OptimizedImage';

interface RelatedProductsProps {
  currentProduct: Product;
  products: Product[];
  onProductClick: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  products,
  onProductClick,
}) => {
  // Definir sistemas sinérgicos específicos
  const energySystemProducts = ['102', 'pr-ashwagandha', '105', '1']; // CoQ10, Ashwagandha, Magnesio Citrato, Vitamina C
  const antiAgingSystemProducts = ['1', '9', 'prb-bamboo', '16', '6']; // Vitamina C, Colágeno, Bambú, Ácido Hialurónico, Vitamina E
  const articularSystemProducts = [
    '5',
    'pr-collagen-peptides',
    'pr-turmeric-advanced',
    'pr-bamboo-extract',
  ]; // Glucosamina+Condroitina, Colágeno, Cúrcuma, Bambú

  // Verificar si el producto actual pertenece a un sistema sinérgico
  const isEnergySystemProduct = energySystemProducts.includes(
    currentProduct.id
  );
  const isAntiAgingSystemProduct = antiAgingSystemProducts.includes(
    currentProduct.id
  );
  const isArticularSystemProduct = articularSystemProducts.includes(
    currentProduct.id
  );

  let relatedProducts: Product[] = [];

  if (isEnergySystemProduct) {
    // Si es producto del Sistema Energía Natural, mostrar otros componentes del sistema
    relatedProducts = energySystemProducts
      .filter((id) => id !== currentProduct.id)
      .map((id) => products.find((p) => p.id === id))
      .filter((product): product is Product => product !== undefined)
      .slice(0, 4);
  } else if (isAntiAgingSystemProduct) {
    // Si es producto del Sistema Anti-Edad, mostrar otros componentes del sistema
    relatedProducts = antiAgingSystemProducts
      .filter((id) => id !== currentProduct.id)
      .map((id) => products.find((p) => p.id === id))
      .filter((product): product is Product => product !== undefined)
      .slice(0, 4);
  } else if (isArticularSystemProduct) {
    // Si es producto del Sistema Articular Avanzado, mostrar otros componentes del sistema
    relatedProducts = articularSystemProducts
      .filter((id) => id !== currentProduct.id)
      .map((id) => products.find((p) => p.id === id))
      .filter((product): product is Product => product !== undefined)
      .slice(0, 4);
  } else {
    // Para otros productos, usar lógica de categorías comunes (comportamiento original)
    relatedProducts = products
      .filter((product) => {
        // Verificar si hay categorías en común
        const hasCommonCategories =
          currentProduct.categories &&
          product.categories &&
          currentProduct.categories.some((cat: string) =>
            product.categories!.includes(cat)
          );
        return hasCommonCategories && product.id !== currentProduct.id;
      })
      .slice(0, 4); // Mostrar máximo 4 productos relacionados
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEnergySystemProduct ? (
            <span>
              ⚡ <span className="text-red-600">Sistema Energía Natural</span> -
              Productos Complementarios
            </span>
          ) : isAntiAgingSystemProduct ? (
            <span>
              🌿 <span className="text-green-600">Sistema Anti-Edad</span> -
              Productos Complementarios
            </span>
          ) : isArticularSystemProduct ? (
            <span>
              🏗️{' '}
              <span className="text-blue-600">Sistema Articular Avanzado</span>{' '}
              - Productos Complementarios
            </span>
          ) : (
            'Productos Relacionados'
          )}
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {relatedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <div className="aspect-square relative">
                <OptimizedImage
                  src={product.images[0].full}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  aspectRatio={1}
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full text-sm">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-bold">
                    DOP ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí puedes agregar la lógica para agregar al carrito
                    }}
                    className="text-green-600 hover:text-green-700 focus:outline-none"
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedProducts;
