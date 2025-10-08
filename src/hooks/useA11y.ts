/**
 * Hook de Accesibilidad - Utilidades WCAG 2.1 AA
 * 
 * Proporciona funcionalidades para:
 * - Gestión de focus
 * - Trap de focus en modales
 * - Anuncios para screen readers
 * - Navegación por teclado
 * - Skip links
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para gestionar el focus trap en modales
 * Mantiene el foco dentro del modal cuando está abierto
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus en el primer elemento al abrir
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 50);
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Tab + Shift
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab solo
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook para gestionar anuncios de screen reader
 * Utiliza un elemento aria-live para anunciar cambios dinámicos
 */
export function useScreenReaderAnnounce() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Crear el elemento de anuncios si no existe
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcerRef.current) return;

    // Actualizar prioridad
    announcerRef.current.setAttribute('aria-live', priority);

    // Limpiar y establecer nuevo mensaje
    announcerRef.current.textContent = '';
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);

    // Limpiar después de 5 segundos
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    }, 5000);
  }, []);

  return announce;
}

/**
 * Hook para gestionar navegación por teclado en listas
 * Permite navegación con flechas arriba/abajo y selección con Enter/Space
 */
export function useKeyboardNavigation<T>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  isActive: boolean = true
) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setSelectedIndex(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (items[selectedIndex]) {
            onSelect(items[selectedIndex], selectedIndex);
          }
          break;
        case 'Escape':
          // Dejar que el componente padre maneje el escape
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, items, selectedIndex, onSelect]);

  return { selectedIndex, setSelectedIndex };
}

/**
 * Hook para gestionar focus restoration
 * Guarda el elemento con focus antes de abrir un modal y lo restaura al cerrar
 */
export function useFocusRestore(isActive: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Guardar el elemento activo
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else {
      // Restaurar el focus cuando se cierra
      setTimeout(() => {
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
        previousFocusRef.current = null;
      }, 100);
    }
  }, [isActive]);
}

/**
 * Hook para detectar navegación por teclado
 * Útil para mostrar outlines de focus solo cuando se usa el teclado
 */
export function useKeyboardUser() {
  const [isKeyboardUser, setIsKeyboardUser] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-user');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-user');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}

/**
 * Hook para gestionar skip links
 * Permite saltar al contenido principal
 */
export function useSkipLink() {
  const skipToMain = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return skipToMain;
}

// Exportar React para el hook de navegación
import React from 'react';
