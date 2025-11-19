import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos de notificación
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Interfaz para una notificación
interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

// Interfaz del contexto
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

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
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar las notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications debe ser usado dentro de un NotificationProvider'
    );
  }
  return context;
};

// Componente para mostrar las notificaciones
const NotificationContainer: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 min-w-[320px]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 rounded-lg shadow-lg ${
              notification.type === 'error'
                ? 'bg-red-50 border-l-4 border-red-500'
                : notification.type === 'success'
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : notification.type === 'warning'
                    ? 'bg-yellow-50 border-l-4 border-yellow-500'
                    : 'bg-blue-50 border-l-4 border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                {notification.title && (
                  <h3
                    className={`text-sm font-medium ${
                      notification.type === 'error'
                        ? 'text-red-800'
                        : notification.type === 'success'
                          ? 'text-green-800'
                          : notification.type === 'warning'
                            ? 'text-yellow-800'
                            : 'text-blue-800'
                    }`}
                  >
                    {notification.title}
                  </h3>
                )}
                <p
                  className={`text-sm ${
                    notification.type === 'error'
                      ? 'text-red-600'
                      : notification.type === 'success'
                        ? 'text-green-600'
                        : notification.type === 'warning'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className={`ml-4 text-sm font-medium ${
                  notification.type === 'error'
                    ? 'text-red-500 hover:text-red-600'
                    : notification.type === 'success'
                      ? 'text-green-500 hover:text-green-600'
                      : notification.type === 'warning'
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                <span className="sr-only">Cerrar notificación</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
