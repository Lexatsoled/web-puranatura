/**
 * Focus Manager Component
 * Gestiona el focus trap y restauración para modales y overlays
 * WCAG 2.1 - Criterio 2.4.3 (Focus Order)
 */

import React, { useEffect, useRef } from 'react';

interface FocusManagerProps {
  children: React.ReactNode;
  isActive: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  isActive,
  restoreFocus = true,
  autoFocus = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Guardar elemento con focus anterior
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    const container = containerRef.current;
    if (!container) return;

    // Obtener todos los elementos focusables
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Auto-focus en el primer elemento
    if (autoFocus && firstElement) {
      setTimeout(() => firstElement.focus(), 50);
    }

    // Manejar teclas
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      if (focusableElements.length === 1) {
        e.preventDefault();
        firstElement?.focus();
        return;
      }

      if (e.shiftKey) {
        // Tab + Shift: ir hacia atrás
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: ir hacia adelante
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restaurar focus al cerrar
      if (restoreFocus && previousFocusRef.current) {
        setTimeout(() => {
          if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
            previousFocusRef.current.focus();
          }
        }, 50);
      }
    };
  }, [isActive, restoreFocus, autoFocus]);

  return (
    <div ref={containerRef} className="focus-manager-container" tabIndex={-1}>
      {children}
    </div>
  );
};

export default FocusManager;
