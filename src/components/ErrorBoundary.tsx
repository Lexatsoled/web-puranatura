import React from 'react';
import { logger } from '../services/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {this.props.fallback ?? (
            <div>
              <strong>Algo falló al renderizar este módulo.</strong>
              <div className="text-sm mt-2">
                Intenta recargar la página o contacta al soporte.
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
