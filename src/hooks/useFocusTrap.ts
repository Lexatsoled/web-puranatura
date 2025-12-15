import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Hook to trap focus inside a specific element (e.g., a modal).
 * It listens for Tab and Shift+Tab key presses to cycle focus within the element.
 * It also restores focus to the previously focused element when unmounted.
 *
 * @param containerRef - Ref to the container element where focus should be trapped.
 * @param options - Options for the trap (isActive, onEscape, initialFocusRef).
 */
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement | null>,
  { isActive, onEscape, initialFocusRef }: FocusTrapOptions
) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Capture previous focus and set initial focus
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus usage: explicit initial ref > container first focusable > container
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const container = containerRef.current;
        if (container) {
          const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          if (firstElement) {
            firstElement.focus();
          } else {
            container.focus();
          }
        }
      }
    } else {
      // Restore focus when deactivating
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    // Cleanup: Restore focus on unmount if still active
    return () => {
      if (isActive && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, initialFocusRef, containerRef]);

  // Handle Tab and Escape keys
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      // Handle Tab
      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef, onEscape]);
};
