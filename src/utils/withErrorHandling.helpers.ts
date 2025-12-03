import { NotificationPayload } from './errorHandler.rules';
import { logAndNotifyError } from './errorHandler';

export type WithErrorHandlingOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  showNotification?: (payload: NotificationPayload) => void;
  handleError?: (error: unknown) => void;
};

export const notifySuccess = <T>(
  options: WithErrorHandlingOptions<T>,
  data: T
) => {
  if (options.successMessage && options.showNotification) {
    options.showNotification({
      type: 'success',
      title: 'Éxito',
      message: options.successMessage,
    });
  }
  options.onSuccess?.(data);
};

export const notifyFailure = <T>(
  error: unknown,
  options: WithErrorHandlingOptions<T>
) => {
  if (options.onError) return options.onError(error);
  if (options.handleError) return options.handleError(error);
  if (options.showNotification)
    return logAndNotifyError(error, options.showNotification);
  // When no handlers are provided we should rethrow the original
  // error so callers can decide how to handle it. Tests expect the
  // original error to be propagated in this case.
  throw error;
};
