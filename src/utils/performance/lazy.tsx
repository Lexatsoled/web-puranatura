import React, { Suspense } from 'react';

interface WithLazyLoadingProps {
  fallback?: React.ReactNode;
}

export function withLazyLoading<P extends object>(
  ComponentOrLazy:
    | React.ComponentType<P>
    | React.LazyExoticComponent<React.ComponentType<P>>,
  options: WithLazyLoadingProps = {}
): React.FC<P> {
  const RenderComp: React.ComponentType<P> =
    (ComponentOrLazy as React.ComponentType<P>);

  return function WrappedComponent(props: P) {
    const fallback =
      options.fallback || (
        <div className="flex items-center justify-center w-full h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando...</p>
          </div>
        </div>
      );
    return (
      <Suspense fallback={fallback}>
        <RenderComp {...props} />
      </Suspense>
    );
  };
}

export function withPageLazyLoading<P extends object>(
  ComponentOrLazy:
    | React.ComponentType<P>
    | React.LazyExoticComponent<React.ComponentType<P>>,
  options: WithLazyLoadingProps = {}
): React.FC<P> {
  const RenderComp: React.ComponentType<P> =
    (ComponentOrLazy as React.ComponentType<P>);

  return function WrappedComponent(props: P) {
    const fallback =
      options.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Cargando página...</p>
          </div>
        </div>
      );
    return (
      <Suspense fallback={fallback}>
        <RenderComp {...props} />
      </Suspense>
    );
  };
}

export default withLazyLoading;
