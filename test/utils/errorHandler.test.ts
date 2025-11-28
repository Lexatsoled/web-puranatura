import { describe, it, expect, vi } from 'vitest';
import {
  ApiError,
  ValidationError,
  NetworkError,
  getNotificationForError,
  logAndNotifyError,
  withErrorHandling,
  // NotificationPayload removed from import since tests no longer rely on that type
} from '../../src/utils/errorHandler';

describe('errorHandler utils', () => {
  it('builds the correct notification payload for an ApiError', () => {
    const error = new ApiError('Falló el servidor', 500);
    const payload = getNotificationForError(error);

    expect(payload).toEqual({
      type: 'error',
      title: 'Error del servidor',
      message: 'Falló el servidor',
    });
  });

  it('builds a warning payload for validation errors', () => {
    const error = new ValidationError('Campo inválido');
    const payload = getNotificationForError(error);

    expect(payload.type).toBe('warning');
    expect(payload.title).toContain('validación');
  });

  it('obtains the network payload for NetworkError', () => {
    const error = new NetworkError();
    const payload = getNotificationForError(error);

    expect(payload.message).toContain('conexión');
  });

  it('falls back to unknown error payload for untyped values', () => {
    const payload = getNotificationForError({} as Error);
    expect(payload.message).toContain('inesperado');
  });

  it('calls notify with the mapped payload', () => {
    const notifySpy = vi.fn();
    logAndNotifyError(new ApiError('boom', 500), notifySpy);
    expect(notifySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error del servidor',
      })
    );
  });

  it('withErrorHandling honors provided showNotification', async () => {
    const notify = vi.fn();
    const failing = () => Promise.reject(new ApiError('Boom', 500));

    await expect(
      withErrorHandling(failing, { showNotification: notify })
    ).resolves.toBeUndefined();
    expect(notify).toHaveBeenCalled();
  });

  it('withErrorHandling rethrows when no handlers exist', async () => {
    const error = new Error('boom');
    const fn = () => Promise.reject(error);

    await expect(withErrorHandling(fn)).rejects.toBe(error);
  });
});
