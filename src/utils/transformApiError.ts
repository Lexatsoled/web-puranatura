import { NetworkError } from './transformApiError.types';
import {
  getErrorMessage,
  createErrorInstance,
} from './transformApiError.helpers';

export * from './transformApiError.types';

export function transformApiError(error: unknown): Error {
  const response = (error as any)?.response;

  if (!response) {
    return new NetworkError();
  }

  const { status, data } = response;
  const message = getErrorMessage(status, data);

  return createErrorInstance(status, message, data);
}

export default transformApiError;
