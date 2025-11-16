import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from '../../src/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return initial value when no item in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value from localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored value');
  });

  it('should update localStorage when setValue is called', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    // Actualizamos el valor
    await act(async () => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(JSON.parse(window.localStorage.getItem('test-key') || 'null')).toBe(
      'new value'
    );
  });

  it('should handle errors when localStorage is not available', () => {
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    // En el entorno de tests usamos un mock global de localStorage (vitest.setup.tsx),
    // por eso es más fiable espiar sobre globalThis.localStorage directamente.
    const mockGetItem = vi
      .spyOn(globalThis.localStorage as any, 'getItem')
      .mockImplementation(() => {
        throw new Error('localStorage not available');
      });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(mockConsoleError).toHaveBeenCalled();

    mockConsoleError.mockRestore();
    mockGetItem.mockRestore();
  });
});
