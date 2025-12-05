import { WithErrorHandlingOptions } from './withErrorHandling.types';

export const handleSuccessNotification = <T>(
  options: WithErrorHandlingOptions<T>
) => {
  if (options.successMessage && options.showNotification) {
    options.showNotification({
      type: 'success',
      title: 'Éxito',
      message: options.successMessage,
    });
  }
};

export const notifySuccess = <T>(
  options: WithErrorHandlingOptions<T>,
  data: T
) => {
  handleSuccessNotification(options);
  options.onSuccess?.(data);
};
