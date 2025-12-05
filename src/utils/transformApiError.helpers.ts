import {
  defaultMessages,
  ValidationError,
  ApiError,
} from './transformApiError.types';

export function getErrorMessage(status: number, data: any): string {
  return data?.message || defaultMessages[status] || 'Error desconocido';
}

export function createErrorInstance(
  status: number,
  message: string,
  data: any
): Error {
  if (status === 400) {
    return new ValidationError(message, data?.field, data);
  }
  return new ApiError(message, status, data);
}
