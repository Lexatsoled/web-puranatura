/**
 * Page Error Boundary
 * Error Boundary específico para páginas completas con mejor UI
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './ErrorBoundary.css';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
}

const PageErrorFallback: React.FC<{
  error?: Error;
  pageName?: string;
  onReset?: () => void;
}> = ({ error, pageName, onReset }) => {
  const navigate = useNavigate();

  return (
    <div className="error-boundary-fallback" style={{ minHeight: '100vh' }}>
      <div className="error-boundary-container" style={{ maxWidth: '700px' }}>
        <div className="error-boundary-icon">🔧</div>
        <h2 className="error-boundary-title">
          Error en {pageName || 'la página'}
        </h2>
        <p className="error-boundary-message">
          Lo sentimos, no pudimos cargar esta página correctamente. Esto puede
          ser temporal. Por favor, intenta una de las siguientes opciones:
        </p>

        <div className="error-boundary-actions">
          {onReset && (
            <button
              onClick={onReset}
              className="error-boundary-button error-boundary-button-primary"
            >
              Reintentar
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="error-boundary-button error-boundary-button-secondary"
          >
            Ir al inicio
          </button>
          <button
            onClick={() => navigate(-1)}
            className="error-boundary-button error-boundary-button-secondary"
          >
            Volver atrás
          </button>
        </div>

        {import.meta.env.DEV && error && (
          <details
            className="error-boundary-details"
            style={{ marginTop: '2rem' }}
          >
            <summary>Detalles técnicos (solo desarrollo)</summary>
            <pre className="error-boundary-stack">
              {error.toString()}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <p
          style={{
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: '#9ca3af',
          }}
        >
          Si el problema persiste, por favor{' '}
          <a
            href="/contacto"
            style={{
              color: '#059669',
              textDecoration: 'underline',
            }}
          >
            contáctanos
          </a>
          .
        </p>
      </div>
    </div>
  );
};

const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
  children,
  pageName,
}) => {
  const [key, setKey] = React.useState(0);

  const handleReset = React.useCallback(() => {
    // Forzar re-render incrementando la key
    setKey((prev) => prev + 1);
  }, []);

  return (
    <ErrorBoundary
      key={key}
      componentName={`Page: ${pageName || 'Unknown'}`}
      fallback={<PageErrorFallback pageName={pageName} onReset={handleReset} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
