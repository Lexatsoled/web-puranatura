import { Product } from '../../../src/types/product';
import { formatCurrency } from '../../../src/utils/intl';

export const ProductInfo = ({ product }: { product: Product }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
    <p className="text-xl text-gray-600">{formatCurrency(product.price)}</p>
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
);
