import { describe, it, expect } from 'vitest';
import transformApiError, {
  ApiError,
  ValidationError,
  NetworkError,
} from '../../src/utils/transformApiError';

describe('transformApiError', () => {
  it('returns NetworkError when error has no response', () => {
    const e = {} as any;
    const result = transformApiError(e);
    expect(result).toBeInstanceOf(NetworkError);
  });

  it('maps 400 -> ValidationError with field', () => {
    const e = {
      response: { status: 400, data: { message: 'bad', field: 'name' } },
    } as any;
    const result = transformApiError(e);
    expect(result).toBeInstanceOf(ValidationError);
    expect((result as ValidationError).field).toBe('name');
  });

  it('maps 401 -> ApiError', () => {
    const e = { response: { status: 401, data: {} } } as any;
    const result = transformApiError(e);
    expect(result).toBeInstanceOf(ApiError);
    expect((result as ApiError).message).toBe('No autorizado');
  });
});
