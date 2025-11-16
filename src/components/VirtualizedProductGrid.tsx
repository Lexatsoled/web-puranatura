import React, { useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';
import { Product } from '../types/product';
import ProductCard from './ProductCard';

interface VirtualizedProductGridProps {
  products: Product[];
  containerWidth: number;
  containerHeight: number;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

const VirtualizedProductGrid: React.FC<VirtualizedProductGridProps> = ({
  products,
  containerWidth,
  containerHeight,
  itemWidth = 280,
  itemHeight = 400,
  gap = 16,
  onLoadMore,
  hasNextPage = false,
  isLoading = false,
}) => {
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);

  const gridMetrics = useMemo(() => {
    const minItemWidth = Math.max(200, Math.min(itemWidth, containerWidth));
    const estimatedColumns = Math.max(
      1,
      Math.floor(containerWidth / (minItemWidth + gap))
    );
    return {
      minItemWidth,
      estimatedColumns,
      estimatedItemHeight: itemHeight + gap,
    };
  }, [containerWidth, itemHeight, itemWidth, gap]);

  const ListComponent = useMemo(() => {
    const Component = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ style, ...props }, ref) => (
        <div
          ref={ref}
          {...props}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${gridMetrics.minItemWidth}px, 1fr))`,
            gap,
            padding: gap / 2,
            boxSizing: 'border-box',
            alignItems: 'stretch',
            ...style,
          }}
        />
      )
    );
    Component.displayName = 'VirtualizedProductGridList';
    return Component;
  }, [gridMetrics.minItemWidth, gap]);

  const ItemComponent = useMemo(() => {
    const Component = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ style, ...props }, ref) => (
        <div
          ref={ref}
          {...props}
          style={{
            width: '100%',
            height: '100%',
            ...style,
          }}
        />
      )
    );
    Component.displayName = 'VirtualizedProductGridItem';
    return Component;
  }, []);

  const handleEndReached = () => {
    if (hasNextPage && !isLoading) {
      onLoadMore?.();
    }
  };

  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <svg
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-4a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <VirtuosoGrid
        ref={virtuosoRef}
        data={products}
        style={{ height: containerHeight, width: containerWidth }}
        overscan={itemHeight}
        endReached={handleEndReached}
        itemContent={(index, product) => (
          <ProductCard
            product={product}
            prioritizeImage={
              index < Math.max(4, gridMetrics.estimatedColumns * 2)
            }
          />
        )}
        components={{
          Item: ItemComponent,
          List: ListComponent,
          ScrollSeekPlaceholder: () => (
            <div
              style={{
                height: gridMetrics.estimatedItemHeight - gap,
                margin: gap / 2,
                borderRadius: 12,
                background: 'linear-gradient(90deg, #f5f5f5 25%, #e0e0e0 50%, #f5f5f5 75%)',
                animation: 'loading 1.5s infinite',
              }}
            />
          ),
        }}
        itemClassName="h-full"
      />

      {isLoading && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
            <span className="text-sm text-gray-600">Cargando más productos...</span>
          </div>
        </div>
      )}

      {!hasNextPage && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay más productos para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default VirtualizedProductGrid;
