import { RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTORS =
  'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  { isActive, onEscape, initialFocusRef }: FocusTrapOptions
) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return undefined;
    const root = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] =>
      Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter(
        (node) =>
          !node.hasAttribute('disabled') &&
          node.getAttribute('aria-hidden') !== 'true' &&
          node.tabIndex !== -1
      );

    const focusInitial = () => {
      const fallback = getFocusable()[0];
      const preferred = initialFocusRef?.current ?? fallback;
      preferred?.focus();
    };

    focusInitial();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const current = document.activeElement;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (current === first || !root.contains(current)) {
          event.preventDefault();
          last.focus();
        }
      } else if (current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, initialFocusRef, isActive, onEscape]);
};
