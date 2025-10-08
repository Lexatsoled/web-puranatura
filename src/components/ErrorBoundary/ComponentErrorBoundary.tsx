/**
 * Component-Specific Error Boundary
 * Error Boundary más ligero para componentes individuales
 */

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  fallbackMessage?: string;
}

const ComponentErrorFallback: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div style={{
      padding: '1rem',
      margin: '1rem 0',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#991b1b',
    }}>
      <p style={{ margin: 0, fontSize: '0.875rem' }}>
        ⚠️ {message || 'No se pudo cargar este componente'}
      </p>
    </div>
  );
};

const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  componentName,
  fallbackMessage,
}) => {
  return (
    <ErrorBoundary
      componentName={componentName}
      fallback={<ComponentErrorFallback message={fallbackMessage} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ComponentErrorBoundary;
