import React from 'react';
// Prefer CSS transitions for notifications; avoid framer-motion in top-level context
import { Notification } from './NotificationContext.types';
import {
  getCardClasses,
  getTitleClasses,
  getMessageClasses,
  getButtonClasses,
} from './notificationStyles';

type Props = {
  notifications: Notification[];
  onRemove: (id: string) => void;
};

export const NotificationContainer: React.FC<Props> = ({
  notifications,
  onRemove,
}) => (
  <div className="fixed top-4 right-4 z-50 space-y-4 min-w-[320px]">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`${getCardClasses(notification.type)} transition-transform duration-150`}
      >
        <div className="flex justify-between items-start">
          <div>
            {notification.title && (
              <h3 className={getTitleClasses(notification.type)}>
                {notification.title}
              </h3>
            )}
            <p className={getMessageClasses(notification.type)}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className={getButtonClasses(notification.type)}
          >
            <span className="sr-only">Cerrar notificación</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    ))}
  </div>
);
