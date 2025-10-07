import { useEffect } from 'react';

/**
 * Hook personalizado para resetear el scroll al inicio de la página
 * cuando el componente se monta o cuando cambian las dependencias especificadas
 */
export const useScrollToTop = (dependencies: any[] = [], shouldScroll: boolean = true) => {
  useEffect(() => {
    if (shouldScroll) {
      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [...dependencies, shouldScroll]);
};

/**
 * Hook para scroll inmediato (sin animación suave)
 * Útil para casos donde necesitas scroll instantáneo
 */
export const useScrollToTopImmediate = (dependencies: any[] = []) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, dependencies);
};

export default useScrollToTop;