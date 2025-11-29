import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// mock the AuthContext used by the hook
const mockUser = {
  id: 'u1',
  email: 'a@b.com',
  firstName: 'Juan',
  lastName: 'Perez',
  phone: '+34 600 000 000',
  createdAt: new Date('2020-01-01').toISOString(),
  orderHistory: [],
  addresses: [],
};

const mockUpdate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    updateProfile: mockUpdate,
    isLoading: false,
  }),
}));

import useProfile from '../../src/hooks/useProfile';

describe('useProfile', () => {
  beforeEach(() => {
    mockUpdate.mockReset();
  });

  it('initializes form data from user and computes memberSinceText', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.formData.firstName).toBe('Juan');
    expect(result.current.formData.email).toBe('a@b.com');
    expect(result.current.memberSinceText).toBe(
      new Date(mockUser.createdAt).toLocaleDateString()
    );
  });

  it('handleInputChange updates form data', () => {
    const { result } = renderHook(() => useProfile());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'firstName', value: 'Maria' },
      } as any);
    });

    expect(result.current.formData.firstName).toBe('Maria');
  });

  it('handleSave calls updateProfile and sets messages on success', async () => {
    mockUpdate.mockResolvedValue(true);
    const { result } = renderHook(() => useProfile());

    act(() => {
      result.current.setIsEditing(true);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      firstName: result.current.formData.firstName,
      lastName: result.current.formData.lastName,
      phone: result.current.formData.phone || undefined,
    });
    expect(result.current.isEditing).toBe(false);
    expect(result.current.saveMessage).toMatch(
      /Perfil actualizado correctamente|/
    );
  });

  it('handleCancel resets the form to user values', () => {
    const { result } = renderHook(() => useProfile());

    act(() =>
      result.current.setFormData({ ...result.current.formData, firstName: 'X' })
    );
    expect(result.current.formData.firstName).toBe('X');

    act(() => result.current.handleCancel());
    expect(result.current.formData.firstName).toBe('Juan');
    expect(result.current.isEditing).toBe(false);
  });
});
