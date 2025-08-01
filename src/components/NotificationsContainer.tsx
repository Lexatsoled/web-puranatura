import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const notificationIcons = {
  success: (
    <svg
      className="w-6 h-6 text-green-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-6 h-6 text-red-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-6 h-6 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-6 h-6 text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);
  const { id, type, message, title, autoClose = true, duration = 5000 } = notification;

  useEffect(() => {
    if (!autoClose) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;

      if (newProgress <= 0) {
        onClose(id);
      } else {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [autoClose, duration, id, onClose]);

  const variants = {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-96 bg-white rounded-lg shadow-lg overflow-hidden"
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{notificationIcons[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium text-gray-900">{title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Cerrar</span>
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
        </div>
      </div>
      {autoClose && (
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div
            className="h-full bg-green-500 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
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
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsContainer;
