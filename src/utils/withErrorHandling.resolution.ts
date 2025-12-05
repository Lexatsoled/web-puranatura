import { WithErrorHandlingOptions } from './withErrorHandling.types';
import { logAndNotifyError } from './errorHandler';

export const resolveErrorHandler = <T>(
  options: WithErrorHandlingOptions<T>
) => {
  if (options.onError) return options.onError;
  if (options.handleError) return options.handleError;
  if (options.showNotification) {
    return (error: unknown) =>
      logAndNotifyError(error, options.showNotification!);
  }
  return null;
};
