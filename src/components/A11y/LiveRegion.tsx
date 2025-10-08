/**
 * Live Region Component
 * Anuncia cambios dinámicos a usuarios de screen reader
 * WCAG 2.1 - Criterio 4.1.3 (Status Messages)
 */

import React, { useEffect, useRef } from 'react';

type LivePriority = 'polite' | 'assertive';
type LiveRole = 'status' | 'alert' | 'log';

interface LiveRegionProps {
  message: string;
  priority?: LivePriority;
  clearAfter?: number; // ms
  role?: LiveRole;
}

const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  clearAfter = 5000,
  role = 'status',
}) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Establecer nuevo timeout para limpiar
    if (clearAfter > 0 && message) {
      timeoutRef.current = window.setTimeout(() => {
        // El mensaje se limpiará automáticamente por re-render
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      role={role}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

export default LiveRegion;

/**
 * Hook para usar Live Region fácilmente
 */
export function useLiveRegion() {
  const [message, setMessage] = React.useState('');
  const [priority, setPriority] = React.useState<'polite' | 'assertive'>('polite');

  const announce = React.useCallback((text: string, urgent: boolean = false) => {
    setPriority(urgent ? 'assertive' : 'polite');
    setMessage(text);

    // Auto-limpiar después de 5 segundos
    setTimeout(() => {
      setMessage('');
    }, 5000);
  }, []);

  return {
    announce,
    LiveRegionComponent: () => (
      <LiveRegion message={message} priority={priority} />
    ),
  };
}
