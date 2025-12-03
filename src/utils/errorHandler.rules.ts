import { ApiError, NetworkError, ValidationError } from './transformApiError';

export type NotificationPayload = {
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
};

export type Rule = {
  match: (error: unknown) => boolean;
  mapper: (error: any) => NotificationPayload;
};

export const notificationRules: Rule[] = [
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

export const defaultNotification: NotificationPayload = {
  type: 'error',
  title: 'Error inesperado',
  message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
};
