/**
 * Error Boundary Component
 * Captura errores en componentes hijos y muestra UI de fallback
 */

import React, { Component, ReactNode } from 'react';
import { errorLogger } from '../../services/errorLogger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Actualizar estado para mostrar fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log del error
    errorLogger.logBoundaryError(
      error,
      errorInfo,
      this.props.componentName || 'UnknownComponent'
    );

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Actualizar estado con errorInfo
    this.setState({
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset automático si cambian las props (opcional)
    if (
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Mostrar fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <div className="error-boundary-fallback">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Algo salió mal</h2>
            <p className="error-boundary-message">
              Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta
              recargar la página.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary>Detalles del error (solo desarrollo)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                onClick={this.reset}
                className="error-boundary-button error-boundary-button-primary"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.reload()}
                className="error-boundary-button error-boundary-button-secondary"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
