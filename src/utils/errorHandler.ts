import { useNotifications } from '../hooks/useNotifications';

// Tipos de error personalizados
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de conexiï¿½n') {
    super(message);
    this.name = 'NetworkError';
  }
}

// Hook para manejar errores
export const useErrorHandler = () => {
  const { showNotification } = useNotifications();

  const handleError = (error: unknown) => {
  // errorLogger.log(error, 'error', 'ui') // (opcional: log centralizado)

    if (error instanceof ApiError) {
      showNotification({
        type: 'error',
        title: 'Error del servidor',
        message: error.message,
      });
    } else if (error instanceof ValidationError) {
      showNotification({
        type: 'warning',
        title: 'Error de validaciï¿½n',
        message: error.message,
      });
    } else if (error instanceof NetworkError) {
      showNotification({
        type: 'error',
        title: 'Error de conexiï¿½n',
        message:
          'Por favor, verifica tu conexiï¿½n a internet e intenta nuevamente.',
      });
    } else if (error instanceof Error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
    } else {
      showNotification({
        type: 'error',
        title: 'Error inesperado',
        message:
          'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
      });
    }
  };

  return { handleError };
};

// Funciï¿½n para envolver las llamadas a la API
export const useWithErrorHandling = () => {
  const { showNotification } = useNotifications();
  const { handleError } = useErrorHandler();

  const wrapAsyncFunction = async <T>(
    fn: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: unknown) => void;
      successMessage?: string;
    } = {}
  ): Promise<T | undefined> => {
    try {
      const data = await fn();

      if (options.successMessage) {
        showNotification({
          type: 'success',
          message: options.successMessage,
        });
      }

      options.onSuccess?.(data);
      return data;
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      } else {
        handleError(error);
      }
    }
  };

  return { wrapAsyncFunction };
};

// Utilidad para transformar errores de la API
type MinimalAxiosError = {
  response?: { status: number; data?: { message?: string; field?: string } };
};

export function transformApiError(error: unknown): Error {
  const e = error as MinimalAxiosError;
  if (!e || !e.response) {
    return new NetworkError();
  }

  const { status, data } = e.response;

  switch (status) {
    case 400:
      return new ValidationError(
        data?.message || 'Datos inválidos',
        data?.field,
        data
      );
    case 401:
      return new ApiError('No autorizado', status, data);
    case 403:
      return new ApiError('Acceso denegado', status, data);
    case 404:
      return new ApiError('Recurso no encontrado', status, data);
    case 429:
      return new ApiError('Demasiadas solicitudes', status, data);
    case 500:
      return new ApiError('Error interno del servidor', status, data);
    default:
      return new ApiError(data?.message || 'Error desconocido', status, data);
  }
}

