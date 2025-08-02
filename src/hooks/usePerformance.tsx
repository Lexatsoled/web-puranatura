import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

// Componente de loading con animación
const LoadingFallback: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center justify-center w-full h-32"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
  </motion.div>
);

interface WithLazyLoadingProps {
  fallback?: React.ReactNode;
}

// HOC para lazy loading
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  options: WithLazyLoadingProps = {}
): React.FC<P> {
  const LazyComponent = React.lazy(() => 
    Promise.resolve({ default: Component })
  );

  return function WrappedComponent(props: P) {
    return (
      <Suspense fallback={options.fallback || <LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Hook para memoizar funciones basadas en dependencias
export function useStableMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return React.useMemo(() => factory(), deps);
}

// HOC para memoización de componentes
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.NamedExoticComponent<P> {
  return React.memo(Component, propsAreEqual);
}

// Hook para callbacks estables
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return React.useCallback(callback, deps);
}
