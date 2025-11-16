import React, { ErrorInfo } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface SuspenseBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({ fallback, children }) => {
  const errorHandler = (error: Error, info: ErrorInfo) => {
    console.error('ErrorBoundary caught an error', error, info);
  };

  const resetHandler = () => {
    window.location.reload();
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
        <div role="alert">
          <p>Something went wrong:</p>
          <pre>{error.message}</pre>
          <button onClick={resetErrorBoundary || resetHandler}>Try again</button>
        </div>
      )}
      onError={errorHandler}
    >
      <React.Suspense fallback={fallback}>{children}</React.Suspense>
    </ReactErrorBoundary>
  );
};

export default SuspenseBoundary;