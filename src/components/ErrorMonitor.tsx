/**
 * Error Monitor Component
 * Panel de desarrollo para visualizar errores capturados
 */

import React, { useState, useEffect } from 'react';
import {
  errorLogger,
  type ErrorLogEntry,
  ErrorSeverity,
} from '../services/errorLogger';

const ErrorMonitor: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | ErrorSeverity>('all');

  useEffect(() => {
    // Actualizar errores cada 2 segundos
    const interval = setInterval(() => {
      setErrors(errorLogger.getErrors());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!import.meta.env.DEV) {
    return null;
  }

  const filteredErrors =
    filter === 'all' ? errors : errors.filter((e) => e.severity === filter);

  const getSeverityColor = (severity: ErrorSeverity): string => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return '#3b82f6'; // blue
      case ErrorSeverity.MEDIUM:
        return '#f59e0b'; // amber
      case ErrorSeverity.HIGH:
        return '#ef4444'; // red
      case ErrorSeverity.CRITICAL:
        return '#dc2626'; // red-600
      default:
        return '#6b7280'; // gray
    }
  };

  const getSeverityLabel = (severity: ErrorSeverity): string => {
    return severity.toUpperCase();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: errors.length > 0 ? '#ef4444' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={`${errors.length} errores capturados`}
      >
        {errors.length > 0 ? '⚠️' : '✓'}
        {errors.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#991b1b',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {errors.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        width: '500px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
            🔍 Error Monitor
          </h3>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.75rem',
              color: '#6b7280',
            }}
          >
            {filteredErrors.length} error(es) capturado(s)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              errorLogger.clearErrors();
              setErrors([]);
            }}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Limpiar
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        {(
          [
            'all',
            ErrorSeverity.LOW,
            ErrorSeverity.MEDIUM,
            ErrorSeverity.HIGH,
            ErrorSeverity.CRITICAL,
          ] as const
        ).map((severity) => (
          <button
            key={severity}
            onClick={() => setFilter(severity)}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              backgroundColor: filter === severity ? '#3b82f6' : '#f3f4f6',
              color: filter === severity ? 'white' : '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {severity === 'all' ? 'Todos' : severity.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Lista de errores */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem',
        }}
      >
        {filteredErrors.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af',
            }}
          >
            <p>No hay errores capturados</p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <details
              key={error.id}
              style={{
                marginBottom: '0.5rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.75rem',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    backgroundColor: getSeverityColor(error.severity),
                    color: 'white',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                  }}
                >
                  {getSeverityLabel(error.severity)}
                </span>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                  }}
                >
                  {error.category}
                </span>
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {error.message}
                </span>
              </summary>
              <div
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#4b5563',
                }}
              >
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Time:</strong>{' '}
                  {new Date(error.timestamp).toLocaleTimeString()}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>URL:</strong> {error.url}
                </p>
                {error.componentStack && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Component Stack:</strong>
                    <pre
                      style={{
                        marginTop: '0.25rem',
                        padding: '0.5rem',
                        backgroundColor: '#1f2937',
                        color: '#f3f4f6',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        overflow: 'auto',
                      }}
                    >
                      {error.componentStack}
                    </pre>
                  </div>
                )}
                {error.stack && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Stack Trace:</strong>
                    <pre
                      style={{
                        marginTop: '0.25rem',
                        padding: '0.5rem',
                        backgroundColor: '#1f2937',
                        color: '#f3f4f6',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        overflow: 'auto',
                        maxHeight: '200px',
                      }}
                    >
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorMonitor;
