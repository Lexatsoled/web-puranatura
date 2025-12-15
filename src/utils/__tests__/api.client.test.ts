import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { api } from '../api.client';
import {
  sanitizeRequestMiddleware,
  sanitizeResponseMiddleware,
} from '../sanitizationMiddleware';

// Mock axios BEFORE import to capture creation if possible,
// but since 'api' is created at top level, we relies on hoisting of vi.mock
vi.mock('axios', () => {
  const mockInterceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  };
  const mockCreate = vi.fn(() => ({
    interceptors: mockInterceptors,
    defaults: { headers: { common: {} } },
  }));
  return {
    default: {
      create: mockCreate,
    },
  };
});

describe('api.client', () => {
  it('should create axios instance with correct config', () => {
    // Note: Since 'api' is exported as a singleton created at module load,
    // the mock axios.create should have been called already.
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringMatching(/\/api$/),
        timeout: 10000,
        withCredentials: true,
      })
    );
  });

  it('should attach sanitization middleware', () => {
    // We access the created instance from the export
    // But since we mocked create to return a mock object, 'api' IS that mock object.
    expect(api.interceptors.request.use).toHaveBeenCalledWith(
      sanitizeRequestMiddleware
    );
    expect(api.interceptors.response.use).toHaveBeenCalledWith(
      sanitizeResponseMiddleware
    );
  });
});
