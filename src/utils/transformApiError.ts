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

/**
 * map an axios-like error/response shape into domain errors used across the app
 */
export function transformApiError(error: any): Error {
  if (!error?.response) {
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
      return new ApiError(data?.message || 'Error desconocido', status, data);
  }
}

export default transformApiError;
