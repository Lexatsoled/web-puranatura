import React, { createContext, useContext, useState, useCallback, Suspense } from 'react';
// The NotificationContainer imports framer-motion which is relatively heavy.
// Load it lazily so framer-motion is only downloaded/parsed when the app actually
// needs to render notifications. This reduces initial JS execution cost.
// NotificationContainer is a named export in the module. React.lazy expects
// a Promise resolving to { default: Component }, so map the imported module
// to that shape.
const NotificationContainer = React.lazy(() =>
  import('./NotificationContainer').then((mod) => ({ default: mod.NotificationContainer }))
);
import {
  Notification,
  NotificationContextType,
} from './NotificationContext.types';

// Tipos de notificación
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    ({ type, message, title, duration = 5000 }: Omit<Notification, 'id'>) => {
      const id = Date.now().toString();
      const notification: Notification = {
        id,
        type,
        message,
        title,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove notification after duration
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
      {/* only render the notification UI when we actually have notifications */}
      {notifications.length > 0 && (
        <Suspense fallback={null}>
          <NotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />
        </Suspense>
      )}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar las notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    // En entornos donde el provider no esté montado (p.ej. durante builds
    // o importaciones tempranas), devolvemos un stub que evita lanzar y
    // permite que la aplicación siga funcionando. Registrar un warning
    // para facilitar el diagnóstico en CI/local.
    // NOTA: esto evita crashes en E2E cuando algún módulo llama a
    // useNotifications fuera del árbol de providers.

    console.warn(
      'useNotifications usado sin NotificationProvider - usando stub'
    );
    return {
      notifications: [],
      showNotification: () => undefined,
      removeNotification: () => undefined,
      clearNotifications: () => undefined,
    } as NotificationContextType;
  }
  return context;
};
