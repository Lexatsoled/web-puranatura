import { useEffect, useMemo, useState } from 'react';

export const useGridDimensions = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  cardHeight: number
) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    const updateDimensions = () => {
      const root = containerRef.current;
      if (!root) return;

      const width = root.offsetWidth;
      const height = Math.min(window.innerHeight - 200, 1200);
      setContainerWidth(width);
      setContainerHeight(height);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [cardHeight, containerRef]);

  return { containerWidth, containerHeight };
};

export const useGridLayout = (
  containerWidth: number,
  gapSize: number,
  itemsPerRow: number | undefined,
  productCount: number
) =>
  useMemo(() => {
    const determineColumns = () => {
      if (itemsPerRow) return itemsPerRow;
      if (containerWidth >= 1280) return 4;
      if (containerWidth >= 1024) return 3;
      if (containerWidth >= 640) return 2;
      return 1;
    };

    const columnCount = determineColumns();
    const rowCount = Math.ceil(productCount / columnCount);
    const columnWidth =
      containerWidth > 0
        ? (containerWidth - gapSize * (columnCount + 1)) / columnCount
        : 0;

    return { columnCount, rowCount, columnWidth };
  }, [containerWidth, gapSize, itemsPerRow, productCount]);
