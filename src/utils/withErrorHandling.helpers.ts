import { WithErrorHandlingOptions } from './withErrorHandling.types';
import { resolveErrorHandler } from './withErrorHandling.resolution';

export type { WithErrorHandlingOptions };
export { notifySuccess } from './withErrorHandling.notifications';

export const notifyFailure = <T>(
  error: unknown,
  options: WithErrorHandlingOptions<T>
) => {
  const errorHandler = resolveErrorHandler(options);

  if (errorHandler) {
    return errorHandler(error);
  }

  // When no handlers are provided we should rethrow the original
  // error so callers can decide how to handle it. Tests expect the
  // original error to be propagated in this case.
  throw error;
};
