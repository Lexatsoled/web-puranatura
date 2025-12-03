import { RefObject, useEffect } from 'react';
import { useFocusables } from './useFocusables';
import { createKeydownHandler, focusInitial } from './useFocusTrap.helpers';

interface FocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  { isActive, onEscape, initialFocusRef }: FocusTrapOptions
) => {
  const { getFocusable } = useFocusables(containerRef);

  useEffect(() => {
    if (!isActive || !containerRef.current) return undefined;
    const root = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    focusInitial(getFocusable, initialFocusRef);

    const handleKeyDown = createKeydownHandler(getFocusable, root, onEscape);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, initialFocusRef, isActive, onEscape]);
};
