import { useEffect } from 'react';

/**
 * Hook: useScrollToTop
 * Propósito: Desplazar suavemente la ventana al inicio cuando cambien dependencias
 *            o forzar un scroll inmediato (variante useScrollToTopImmediate).
 * Uso: Llamar desde páginas para mejorar la UX en cambios de vista.
 */

/**
 * Hook personalizado para resetear el scroll al inicio de la página
 * cuando el componente se monta o cuando cambian las dependencias especificadas
 */
export const useScrollToTop = (
  dependencies: React.DependencyList = [],
  shouldScroll: boolean = true
) => {
  useEffect(() => {
    if (shouldScroll) {
      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [...dependencies, shouldScroll]); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * Hook para scroll inmediato (sin animación suave)
 * Útil para casos donde necesitas scroll instantáneo
 */
export const useScrollToTopImmediate = (dependencies: React.DependencyList = []) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useScrollToTop;
