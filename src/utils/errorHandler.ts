import { useNotifications } from '../contexts/NotificationContext';

// Tipos de error personalizados
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de conexión') {
    super(message);
    this.name = 'NetworkError';
  }
}

// Hook para manejar errores
export const useErrorHandler = () => {
  const { showNotification } = useNotifications();

  const handleError = (error: unknown) => {
    console.error('Error capturado:', error);

    if (error instanceof ApiError) {
      showNotification({
        type: 'error',
        title: 'Error del servidor',
        message: error.message,
      });
    } else if (error instanceof ValidationError) {
      showNotification({
        type: 'warning',
        title: 'Error de validación',
        message: error.message,
      });
    } else if (error instanceof NetworkError) {
      showNotification({
        type: 'error',
        title: 'Error de conexión',
        message: 'Por favor, verifica tu conexión a internet e intenta nuevamente.',
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
        message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
      });
    }
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
  } = {}
): Promise<T | undefined> {
  const { showNotification } = useNotifications();
  
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
      const { handleError } = useErrorHandler();
      handleError(error);
    }
  }
}

// Utilidad para transformar errores de la API
export function transformApiError(error: any): Error {
  if (!error.response) {
    return new NetworkError();
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return new ValidationError(
        data.message || 'Datos inválidos',
        data.field,
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
      return new ApiError(
        data.message || 'Error desconocido',
        status,
        data
      );
  }
}
