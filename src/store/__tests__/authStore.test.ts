import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { authService } from '../../services/authService';

// Mock authService
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

describe('authStore', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
  };



  beforeEach(() => {
    useAuthStore.setState({
      user: null,

      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should handle successful login', async () => {
    (authService.login as any).mockResolvedValue({
      user: mockUser,

    });

    await useAuthStore
      .getState()
      .login({ email: 'test@example.com', password: 'password' });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);

    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle login error', async () => {
    const errorMsg = 'Invalid credentials';
    (authService.login as any).mockRejectedValue({
      response: { data: { message: errorMsg } },
    });

    await expect(
      useAuthStore
        .getState()
        .login({ email: 'test@example.com', password: 'wrong' })
    ).rejects.toBeTruthy();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });

  it('should handle logout', async () => {
    // Setup initial state
    useAuthStore.setState({
      user: mockUser,

      isAuthenticated: true,
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();

    expect(state.isAuthenticated).toBe(false);
  });
});
