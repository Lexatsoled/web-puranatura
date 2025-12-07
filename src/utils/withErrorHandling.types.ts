import { NotificationPayload } from './errorHandler.rules';

export type WithErrorHandlingOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  showNotification?: (payload: NotificationPayload) => void;
  handleError?: (error: unknown) => void;
};
