import { describe, it, expect, vi } from 'vitest';
import {
  getNotificationForError,
  logAndNotifyError,
  useErrorHandler,
} from '../errorHandler';
import { ApiError, NetworkError, ValidationError } from '../transformApiError';
import { remoteLogger } from '../remoteLogger';
import { useNotifications } from '../../contexts/NotificationContext';

// Mock dependencies
vi.mock('../remoteLogger', () => ({
  remoteLogger: {
    error: vi.fn(),
  },
}));

vi.mock('../../contexts/NotificationContext', () => ({
  useNotifications: vi.fn(),
}));

describe('errorHandler', () => {
  describe('getNotificationForError', () => {
    it('should map ApiError correctly', () => {
      const error = new ApiError('API failed', 500);
      const notification = getNotificationForError(error);
      expect(notification).toEqual({
        type: 'error',
        title: 'Error del servidor',
        message: 'API failed',
      });
    });

    it('should map ValidationError correctly', () => {
      const error = new ValidationError('Invalid input');
      const notification = getNotificationForError(error);
      expect(notification).toEqual({
        type: 'warning',
        title: 'Error de validación',
        message: 'Invalid input',
      });
    });

    it('should map NetworkError correctly', () => {
      const error = new NetworkError('No internet');
      const notification = getNotificationForError(error);
      expect(notification).toEqual({
        type: 'error',
        title: 'Error de conexión',
        message:
          'Por favor, verifica tu conexión a internet e intenta nuevamente.',
      });
    });

    it('should map generic Error correctly', () => {
      const error = new Error('Something went wrong');
      const notification = getNotificationForError(error);
      expect(notification).toEqual({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong',
      });
    });

    it('should return default notification for unknown errors', () => {
      const notification = getNotificationForError('unknown string error');
      expect(notification).toEqual({
        type: 'error',
        title: 'Error inesperado',
        message:
          'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
      });
    });
  });

  describe('logAndNotifyError', () => {
    it('should log error and notify', () => {
      const notify = vi.fn();
      const error = new Error('Test error');

      logAndNotifyError(error, notify);

      expect(remoteLogger.error).toHaveBeenCalledWith('Test error', {
        stack: expect.any(String),
      });
      expect(notify).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'Test error',
      });
    });

    it('should handle non-Error objects in logging', () => {
      const notify = vi.fn();
      const error = 'String error';

      logAndNotifyError(error, notify);

      expect(remoteLogger.error).toHaveBeenCalledWith('String error', {
        stack: undefined,
      });
    });
  });

  describe('useErrorHandler', () => {
    it('should call showNotification and logger when handling error', () => {
      const showNotification = vi.fn();
      (useNotifications as any).mockReturnValue({ showNotification });

      const { handleError } = useErrorHandler();
      const error = new Error('Hook error');

      handleError(error);

      expect(remoteLogger.error).toHaveBeenCalledWith(
        'Hook error',
        expect.anything()
      );
      expect(showNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'Hook error',
      });
    });
  });
});
