import { create } from 'zustand';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove after duration (default 5s)
    const duration = notification.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));

// Helper functions for quick notifications
export const showSuccessNotification = (
  message: string,
  duration?: number,
  action?: { label: string; onClick: () => void }
) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'success',
    duration,
    action,
  });
};

export const showErrorNotification = (
  message: string,
  duration?: number,
  action?: { label: string; onClick: () => void }
) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'error',
    duration,
    action,
  });
};

export const showInfoNotification = (
  message: string,
  duration?: number,
  action?: { label: string; onClick: () => void }
) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'info',
    duration,
    action,
  });
};

export const showWarningNotification = (
  message: string,
  duration?: number,
  action?: { label: string; onClick: () => void }
) => {
  useNotificationStore.getState().addNotification({
    message,
    type: 'warning',
    duration,
    action,
  });
};
