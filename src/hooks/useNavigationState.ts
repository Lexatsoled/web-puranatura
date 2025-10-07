import { useNavigate } from 'react-router-dom';

export interface StoreNavigationState {
  selectedCategory: string;
  searchTerm: string;
  sortOption: string;
  currentPage: number;
  itemsPerPage: number;
  scrollPosition: number;
  fromProductPage?: boolean;
}

const STORAGE_KEY = 'puranatura_navigation_state';

export const useNavigationState = () => {
  const navigate = useNavigate();

  // Guardar estado actual de la tienda
  const saveNavigationState = (state: Omit<StoreNavigationState, 'scrollPosition' | 'fromProductPage'>) => {
    const navigationState: StoreNavigationState = {
      ...state,
      scrollPosition: window.scrollY,
      fromProductPage: false,
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(navigationState));
  };

  // Obtener estado guardado
  const getNavigationState = (): StoreNavigationState | null => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  // Marcar que venimos desde página de producto
  const markFromProductPage = () => {
    const currentState = getNavigationState();
    if (currentState) {
      const updatedState = { ...currentState, fromProductPage: true };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    }
  };

  // Volver a la lista con estado preservado
  const returnToStore = () => {
    markFromProductPage();
    navigate('/tienda');
  };

  // Limpiar estado (para navegación fresh)
  const clearNavigationState = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // Limpiar solo el flag fromProductPage
  const clearFromProductPageFlag = () => {
    const currentState = getNavigationState();
    if (currentState) {
      delete currentState.fromProductPage;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    }
  };

  // Verificar si venimos desde página de producto
  const isFromProductPage = (): boolean => {
    const state = getNavigationState();
    return state?.fromProductPage || false;
  };

  return {
    saveNavigationState,
    getNavigationState,
    returnToStore,
    clearNavigationState,
    clearFromProductPageFlag,
    isFromProductPage,
    markFromProductPage,
  };
};

export default useNavigationState;