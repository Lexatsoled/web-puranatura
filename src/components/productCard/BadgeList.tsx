import { Product } from '../../types/product';
import { StockStatus } from '../../hooks/useProductCardState';

export const BadgeList = ({
  product,
  stockStatus,
}: {
  product: Product;
  stockStatus: StockStatus;
}) => (
  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
    {product.isNew && (
      <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
        Nuevo
      </span>
    )}
    {stockStatus === 'low-stock' && (
      <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
        Últimas unidades!
      </span>
    )}
  </div>
);
