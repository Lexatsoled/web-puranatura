import React from 'react';
// Use CSS transitions instead of framer-motion to avoid bundling motion runtime
import { useNotificationTimer } from '../hooks/useNotificationTimer';
import { NotificationIcon } from './NotificationsContainer.icons';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

interface NotificationsContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    onClick={onClick}
  >
    <span className="sr-only">Cerrar</span>
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="absolute bottom-0 left-0 right-0 h-1">
    <div
      className="h-full bg-green-500 transition-all duration-300 ease-linear"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  const {
    id,
    type,
    message,
    title,
    autoClose = true,
    duration = 5000,
  } = notification;

  const handleClose = () => onClose(id);
  const progress = useNotificationTimer(duration, autoClose, handleClose);

  return (
    <div
      role="alert"
      className="relative w-96 bg-white rounded-lg shadow-lg overflow-hidden transition-transform transition-opacity duration-200 ease-out transform"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <NotificationIcon type={type} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium text-gray-900">{title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <CloseButton onClick={handleClose} />
          </div>
        </div>
      </div>
      {autoClose && <ProgressBar progress={progress} />}
    </div>
  );
};

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notifications,
  onClose,
  position = 'bottom-right',
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  return (
    <div
      className={`fixed z-50 m-6 flex flex-col items-end space-y-4 ${positionClasses[position]}`}
      role="status"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default NotificationsContainer;
