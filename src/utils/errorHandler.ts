import { useNotifications } from '../contexts/NotificationContext';
import {
  defaultNotification,
  notificationRules,
  NotificationPayload,
  Rule,
} from './errorHandler.rules';
export { withErrorHandling } from './withErrorHandling';
export { ApiError, NetworkError, ValidationError } from './transformApiError';
export { notificationRules, defaultNotification };

export const getNotificationForError = (
  error: unknown,
  rules: Rule[] = notificationRules
): NotificationPayload =>
  rules.find((rule) => rule.match(error))?.mapper(error) || defaultNotification;

import { remoteLogger } from './remoteLogger';

export function logAndNotifyError(
  error: unknown,
  notify: (payload: NotificationPayload) => void
) {
  // Enviar error al backend para monitoreo
  remoteLogger.error(error instanceof Error ? error.message : String(error), {
    stack: error instanceof Error ? error.stack : undefined,
  });

  notify(getNotificationForError(error));
}

export const useErrorHandler = () => {
  const { showNotification } = useNotifications();
  const handleError = (error: unknown) =>
    logAndNotifyError(error, showNotification);
  return { handleError };
};
