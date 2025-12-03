import { useNotifications } from '../contexts/NotificationContext';
import {
  defaultNotification,
  notificationRules,
  NotificationPayload,
  Rule,
} from './errorHandler.rules';
export { withErrorHandling } from './withErrorHandling';

const getNotificationForError = (
  error: unknown,
  rules: Rule[] = notificationRules
): NotificationPayload =>
  rules.find((rule) => rule.match(error))?.mapper(error) || defaultNotification;

export function logAndNotifyError(
  error: unknown,
  notify: (payload: NotificationPayload) => void
) {
  notify(getNotificationForError(error));
}

export const useErrorHandler = () => {
  const { showNotification } = useNotifications();
  const handleError = (error: unknown) =>
    logAndNotifyError(error, showNotification);
  return { handleError };
};
