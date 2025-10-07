import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'puranatura_navigation_state';

// Función helper para limpiar solo el flag fromProductPage
const clearFromProductPageFlag = () => {
  const savedState = sessionStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      delete state.fromProductPage;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error al limpiar flag fromProductPage:', e);
    }
  }
};

export const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Ejecutar después del render completo
    const handleScroll = () => {
      const currentPath = location.pathname;
      
      // Si vamos a /tienda, verificar si venimos de producto
      if (currentPath === '/tienda') {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            
            // Si venimos de página de producto, restaurar scroll
            if (state.fromProductPage && typeof state.scrollPosition === 'number') {
              console.log('🔄 ScrollManager: Restaurando scroll a:', state.scrollPosition + 'px');
              
              setTimeout(() => {
                window.scrollTo({
                  top: state.scrollPosition,
                  behavior: 'smooth'
                });
                
                // Limpiar el flag después de restaurar scroll
                clearFromProductPageFlag();
              }, 200); // Más tiempo para asegurar render completo
              
              return; // Salir sin hacer scroll reset
            }
          } catch (e) {
            console.warn('Error al parsear estado de navegación:', e);
          }
        }
        
        // Si llegamos aquí, es navegación normal - resetear scroll
        console.log('📍 ScrollManager: Navegación normal - reseteando scroll');
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
        
      } else if (currentPath.startsWith('/producto/')) {
        // Para páginas de producto, siempre resetear scroll
        console.log('📍 ScrollManager: Página de producto - reseteando scroll');
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
        
      } else {
        // Para cualquier otra página, scroll reset normal
        console.log('📍 ScrollManager: Otra página - reseteando scroll');
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      }
    };

    handleScroll();
  }, [location.pathname, location.key]); // Agregar location.key para detectar cambios de ruta

  return null; // Este componente no renderiza nada
};

export default ScrollManager;