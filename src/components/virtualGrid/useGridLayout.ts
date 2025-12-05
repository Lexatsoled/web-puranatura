import { useEffect, useMemo, useState } from 'react';
import { buildGridLayout } from './useGridLayout.helpers';

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
  useMemo(
    () => buildGridLayout(containerWidth, gapSize, itemsPerRow, productCount),
    [containerWidth, gapSize, itemsPerRow, productCount]
  );
