import { useCallback } from 'react';

export const useCartVariants = (
  onUpdateVariant?: (itemId: string, variantId: string) => void
) => {
  const handleVariantChange = useCallback(
    (itemId: string, variantId: string) => {
      onUpdateVariant?.(itemId, variantId);
    },
    [onUpdateVariant]
  );

  return handleVariantChange;
};
