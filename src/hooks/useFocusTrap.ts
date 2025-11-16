import { useEffect, useRef, RefObject } from 'react';

export interface FocusTrapOptions {
  restoreFocus?: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  autoFocus?: boolean;
}

export const useFocusTrap = (
  containerRef: RefObject<HTMLElement>,
  options: FocusTrapOptions = {},
  enabled: boolean = true
) => {
  const { restoreFocus = true, initialFocusRef, autoFocus = true } = options;
  const previouslyFocusedElementRef = useRef<Element | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!enabled || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const trapFocus = () => {
    if (!enabled || !containerRef.current) return;

    // Store the previously focused element
    previouslyFocusedElementRef.current = document.activeElement;

    // Focus the initial element
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (autoFocus) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
  };

  const releaseFocus = () => {
    if (!enabled) return;

    document.removeEventListener('keydown', handleKeyDown);

    // Restore focus to the previously focused element
    if (
      restoreFocus &&
      previouslyFocusedElementRef.current instanceof HTMLElement
    ) {
      previouslyFocusedElementRef.current.focus();
    }
  };

  useEffect(() => {
    if (enabled) {
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled]);

  return { trapFocus, releaseFocus };
};