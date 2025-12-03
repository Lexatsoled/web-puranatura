import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { AddProductCard } from './productCompare/AddProductCard';
import { CompareHeader } from './productCompare/CompareHeader';
import { ProductCardCompare } from './productCompare/ProductCardCompare';
import { useProductCompare } from './productCompare/useProductCompare';

interface ProductCompareProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  maxProducts?: number;
}

const ProductCompare: React.FC<ProductCompareProps> = ({
  products,
  onRemoveProduct,
  maxProducts = 3,
}) => {
  const { comparison, showDifferences, setShowDifferences } =
    useProductCompare(products);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <CompareHeader
        count={products.length}
        max={maxProducts}
        showDifferences={showDifferences}
        toggleDifferences={() => setShowDifferences((prev) => !prev)}
      />

      <div className="overflow-x-auto">
        <div className="inline-flex space-x-6 min-w-full">
          <AnimatePresence initial={false}>
            {products.map((product, index) => (
              <ProductCardCompare
                key={product.id}
                product={product}
                index={index}
                showDifferences={showDifferences}
                differentFeatures={comparison?.different || []}
                onRemove={onRemoveProduct}
              />
            ))}
          </AnimatePresence>

          {products.length < maxProducts && <AddProductCard onAdd={() => {}} />}
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
