import { useMemo, useState } from 'react';
import { Product } from '../../types';

export const useProductCompare = (products: Product[]) => {
  const [showDifferences, setShowDifferences] = useState(false);

  const comparison = useMemo(() => {
    if (products.length < 2) return null;

    const allFeatures = new Set<string>();
    const commonFeatures = new Set<string>();
    const differentFeatures = new Set<string>();

    products.forEach((product) => {
      product.benefits?.forEach((benefit) => allFeatures.add(benefit));
    });

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

  return { comparison, showDifferences, setShowDifferences };
};
