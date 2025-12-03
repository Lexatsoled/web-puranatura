import { RefObject, useCallback } from 'react';

const FOCUSABLE_SELECTORS =
  'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useFocusables = (containerRef: RefObject<HTMLElement | null>) => {
  const getFocusable = useCallback((): HTMLElement[] => {
    const root = containerRef.current;
    if (!root) return [];

    return Array.from(
      root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(
      (node) =>
        !node.hasAttribute('disabled') &&
        node.getAttribute('aria-hidden') !== 'true' &&
        node.tabIndex !== -1
    );
  }, [containerRef]);

  return { getFocusable };
};
