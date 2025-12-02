const defaultMessages: Record<number, string> = {
  400: 'Datos inválidos',
  401: 'No autorizado',
  403: 'Acceso denegado',
  404: 'Recurso no encontrado',
  429: 'Demasiadas solicitudes',
  500: 'Error interno del servidor',
};

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
  constructor(message: string = 'Error de conexión') {
    super(message);
    this.name = 'NetworkError';
  }
}

export function transformApiError(error: unknown): Error {
  const response = (error as any)?.response;
  if (!response) return new NetworkError();

  const { status, data } = response;
  const message =
    data?.message || defaultMessages[status] || 'Error desconocido';

  if (status === 400) {
    return new ValidationError(message, data?.field, data);
  }

  return new ApiError(message, status, data);
}

export default transformApiError;
