import { useNotifications } from '../contexts/NotificationContext';
import transformApiError, {
  ApiError,
  ValidationError,
  NetworkError,
} from './transformApiError';
export { ApiError, ValidationError, NetworkError } from './transformApiError';

export type NotificationPayload = {
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
};

const notificationRules: {
  match: (error: unknown) => error is Error;
  mapper: (error: Error) => NotificationPayload;
}[] = [
  {
    match: (error): error is ApiError => error instanceof ApiError,
    mapper: (error) => ({
      type: 'error',
      title: 'Error del servidor',
      message: error.message,
    }),
  },
  {
    match: (error): error is ValidationError =>
      error instanceof ValidationError,
    mapper: (error) => ({
      type: 'warning',
      title: 'Error de validación',
      message: error.message,
    }),
  },
  {
    match: (error): error is NetworkError => error instanceof NetworkError,
    mapper: () => ({
      type: 'error',
      title: 'Error de conexión',
      message:
        'Por favor, verifica tu conexión a internet e intenta nuevamente.',
    }),
  },
  {
    match: (error): error is Error => error instanceof Error,
    mapper: (error) => ({
      type: 'error',
      title: 'Error',
      message: error.message,
    }),
  },
];

export function getNotificationForError(error: unknown): NotificationPayload {
  for (const rule of notificationRules) {
    if (rule.match(error)) {
      return rule.mapper(error);
    }
  }
  return {
    type: 'error',
    title: 'Error inesperado',
    message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
  };
}

export function logAndNotifyError(
  error: unknown,
  notify: (payload: NotificationPayload) => void
) {
  console.error('Error capturado:', error);
  notify(getNotificationForError(error));
}

// Hook para manejar errores
export const useErrorHandler = () => {
  const { showNotification } = useNotifications();

  const handleError = (error: unknown) => {
    logAndNotifyError(error, showNotification);
  };

  return { handleError };
};

// Función para envolver las llamadas a la API
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    successMessage?: string;
    showNotification?: (payload: NotificationPayload) => void;
    handleError?: (error: unknown) => void;
  } = {}
): Promise<T | undefined> {
  try {
    const data = await fn();

    if (options.successMessage && options.showNotification) {
      options.showNotification({
        type: 'success',
        title: 'Éxito',
        message: options.successMessage,
      });
    }

    options.onSuccess?.(data);
    return data;
  } catch (error) {
    if (options.onError) {
      options.onError(error);
    } else if (options.handleError) {
      options.handleError(error);
    } else if (options.showNotification) {
      logAndNotifyError(error, options.showNotification);
    } else {
      console.error('Unhandled error in withErrorHandling:', error);
      throw error;
    }
  }
}

// Utilidad para transformar errores de la API
// transformApiError implementation has been moved to src/utils/transformApiError.ts
