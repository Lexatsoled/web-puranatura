import { NotificationType } from './NotificationContext';

const typeMap: Record<
  NotificationType,
  { card: string; title: string; message: string; button: string }
> = {
  error: {
    card: 'bg-red-50 border-l-4 border-red-500',
    title: 'text-red-800',
    message: 'text-red-600',
    button: 'text-red-500 hover:text-red-600',
  },
  success: {
    card: 'bg-green-50 border-l-4 border-green-500',
    title: 'text-green-800',
    message: 'text-green-600',
    button: 'text-green-500 hover:text-green-600',
  },
  warning: {
    card: 'bg-yellow-50 border-l-4 border-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-600',
    button: 'text-yellow-500 hover:text-yellow-600',
  },
  info: {
    card: 'bg-blue-50 border-l-4 border-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-600',
    button: 'text-blue-500 hover:text-blue-600',
  },
};

export const getCardClasses = (type: NotificationType) =>
  `p-4 rounded-lg shadow-lg ${typeMap[type].card}`;
export const getTitleClasses = (type: NotificationType) =>
  `text-sm font-medium ${typeMap[type].title}`;
export const getMessageClasses = (type: NotificationType) =>
  `text-sm ${typeMap[type].message}`;
export const getButtonClasses = (type: NotificationType) =>
  `ml-4 text-sm font-medium ${typeMap[type].button}`;
