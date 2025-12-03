import {
  notifyFailure,
  notifySuccess,
  WithErrorHandlingOptions,
} from './withErrorHandling.helpers';

export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  options: WithErrorHandlingOptions<T> = {}
): Promise<T | undefined> => {
  try {
    const data = await fn();
    notifySuccess(options, data);
    return data;
  } catch (error) {
    notifyFailure(error, options);
    return undefined;
  }
};
