/**
 * Advanced Keyboard Navigation Hook for WCAG 2.1 AA Compliance
 * Provides comprehensive keyboard navigation support including:
 * - Focus management
 * - Keyboard traps for modals
 * - Arrow key navigation for lists/grids
 * - Skip links functionality
 * - Tab order management
 */

import { useEffect, useCallback, useRef, RefObject } from 'react';
import * as React from 'react';

export interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  onShiftTab?: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export interface FocusTrapOptions {
  restoreFocus?: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  autoFocus?: boolean;
}

export const useKeyboardNavigation = (
  options: KeyboardNavigationOptions,
  enabled: boolean = true
) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const {
        onEscape,
        onEnter,
        onSpace,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onHome,
        onEnd,
        onTab,
        onShiftTab,
        preventDefault = true,
      } = options;

      switch (event.key) {
        case 'Escape':
          onEscape?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'Enter':
          if (
            event.target instanceof HTMLElement &&
            (event.target.tagName === 'BUTTON' ||
              event.target.tagName === 'A' ||
              event.target.getAttribute('role') === 'button' ||
              event.target.getAttribute('role') === 'link')
          ) {
            onEnter?.();
            if (preventDefault) event.preventDefault();
          }
          break;

        case ' ':
          if (
            event.target instanceof HTMLElement &&
            (event.target.tagName === 'BUTTON' ||
              event.target.getAttribute('role') === 'button')
          ) {
            onSpace?.();
            if (preventDefault) event.preventDefault();
          }
          break;

        case 'ArrowUp':
          onArrowUp?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'ArrowDown':
          onArrowDown?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'ArrowLeft':
          onArrowLeft?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'ArrowRight':
          onArrowRight?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'Home':
          onHome?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'End':
          onEnd?.();
          if (preventDefault) event.preventDefault();
          break;

        case 'Tab':
          if (event.shiftKey) {
            onShiftTab?.(event);
          } else {
            onTab?.(event);
          }
          // Don't prevent default for Tab key to maintain natural tab order
          break;
      }
    },
    [options, enabled]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
};

// Focus trap hook for modals and dialogs
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement>,
  options: FocusTrapOptions = {},
  enabled: boolean = true
) => {
  const { restoreFocus = true, initialFocusRef, autoFocus = true } = options;

  const previouslyFocusedElementRef = useRef<Element | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [containerRef, enabled]
  );

  const trapFocus = useCallback(() => {
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
  }, [containerRef, initialFocusRef, autoFocus, handleKeyDown, enabled]);

  const releaseFocus = useCallback(() => {
    if (!enabled) return;

    document.removeEventListener('keydown', handleKeyDown);

    // Restore focus to the previously focused element
    if (
      restoreFocus &&
      previouslyFocusedElementRef.current instanceof HTMLElement
    ) {
      previouslyFocusedElementRef.current.focus();
    }
  }, [handleKeyDown, restoreFocus, enabled]);

  useEffect(() => {
    if (enabled) {
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  return { trapFocus, releaseFocus };
};

// Hook for managing focus in lists and grids
export const useRovingFocus = <T = unknown>(
  items: T[],
  orientation: 'horizontal' | 'vertical' | 'both' = 'vertical'
) => {
  const containerRef = useRef<HTMLElement>(null);
  const focusedIndexRef = useRef<number>(-1);

  const focusItem = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) return;

      const item = containerRef.current?.querySelector(
        `[data-roving-index="${index}"]`
      ) as HTMLElement;

      if (item) {
        item.focus();
        focusedIndexRef.current = index;
      }
    },
    [items.length]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = focusedIndexRef.current;

      switch (key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            newIndex = Math.min(focusedIndexRef.current + 1, items.length - 1);
            event.preventDefault();
          }
          break;

        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            newIndex = Math.max(focusedIndexRef.current - 1, 0);
            event.preventDefault();
          }
          break;

        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            newIndex = Math.min(focusedIndexRef.current + 1, items.length - 1);
            event.preventDefault();
          }
          break;

        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            newIndex = Math.max(focusedIndexRef.current - 1, 0);
            event.preventDefault();
          }
          break;

        case 'Home':
          newIndex = 0;
          event.preventDefault();
          break;

        case 'End':
          newIndex = items.length - 1;
          event.preventDefault();
          break;
      }

      if (newIndex !== focusedIndexRef.current) {
        focusItem(newIndex);
      }
    },
    [items.length, orientation, focusItem]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return {
    containerRef,
    focusItem,
    focusedIndex: focusedIndexRef.current,
  };
};

// Skip links component
export const SkipLinks = () => {
  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    (e.target as HTMLElement).style.top = '0';
  };

  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
    (e.target as HTMLElement).style.top = '-40px';
  };

  return React.createElement(
    'nav',
    { 'aria-label': 'Skip navigation links', className: 'skip-links' },
    React.createElement(
      'a',
      {
        href: '#main-content',
        className: 'skip-link',
        onFocus: handleFocus,
        onBlur: handleBlur,
      },
      'Skip to main content'
    ),
    React.createElement(
      'a',
      {
        href: '#navigation',
        className: 'skip-link',
        onFocus: handleFocus,
        onBlur: handleBlur,
      },
      'Skip to navigation'
    ),
    React.createElement(
      'a',
      {
        href: '#search',
        className: 'skip-link',
        onFocus: handleFocus,
        onBlur: handleBlur,
      },
      'Skip to search'
    ),
    React.createElement(
      'a',
      {
        href: '#footer',
        className: 'skip-link',
        onFocus: handleFocus,
        onBlur: handleBlur,
      },
      'Skip to footer'
    )
  );
};

// Utility function to manage tab order
export const manageTabOrder = (
  elements: HTMLElement[],
  direction: 'forward' | 'backward' = 'forward'
) => {
  const focusableElements = elements.filter(
    (el) => el.tabIndex !== -1 && !el.hasAttribute('disabled')
  );

  if (direction === 'backward') {
    focusableElements.reverse();
  }

  return focusableElements;
};

// Utility to announce content changes to screen readers
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  announcement.textContent = message;

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
};

export default useKeyboardNavigation;
