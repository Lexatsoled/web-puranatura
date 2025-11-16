import React from 'react';
/**
 * Utilidades de rendimiento (cliente)
 * Propósito: Proveer HOCs y hooks ligeros para lazy-loading, memoización estable
 *            y callbacks estables, ayudando a minimizar renders y peso inicial.
 * Expuesto:
 *  - withLazyLoading / withPageLazyLoading: envoltorios para lazy con fallback
 *  - useStableMemo / useStableCallback / withMemo: helpers de memoización
 */

// Componente de loading con animación
// const LoadingFallback: React.FC = () => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="flex items-center justify-center w-full h-32"
//   >
//     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
//   </motion.div>
// );
// Loading component for page-level lazy loading
export const PageLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600">Cargando página...</p>
    </div>
  </div>
);

// Loading component for component-level lazy loading
export const ComponentLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center w-full h-32">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Cargando...</p>
    </div>
  </div>
);

// (utilidades no-React movidas a utils/performance y hooks/useStable)

// HOC para lazy loading
// utilidades de rendimiento movidas a src/utils/performance/lazy.tsx y src/hooks/useStable.ts
