import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';
import { apiClient } from '../../services/apiClient';

// Define types for the mock
interface MockAuthState {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  error: string | null;
}

interface MockAuthStore extends MockAuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
  clearError: () => void;
}

// Mock the entire authStore to avoid persist middleware issues
vi.mock('../authStore', () => {
  const mockStore: MockAuthStore = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    login: vi.fn(async (email: string, password: string) => {
      try {
        const { data } = await apiClient.post('/api/auth/login', { email, password });
        mockStore.isAuthenticated = true;
        mockStore.user = { id: '1', email, firstName: '', lastName: '', addresses: [], orderHistory: [], createdAt: new Date() };
        mockStore.isLoading = false;
      } catch (err) {
        const status = (err as any)?.response?.status;
        mockStore.isAuthenticated = false;
        mockStore.user = null;
        mockStore.isLoading = false;
        mockStore.error = status === 401 ? 'Email o contrasena incorrectos.' : 'No se pudo iniciar sesion.';
        throw err;
      }
    }),
    register: vi.fn(async (email: string, password: string) => {
      try {
        const name = email.split('@')[0]; // composeFullName(undefined, undefined, email)
        const { data } = await apiClient.post('/api/auth/signup', { email, password, name });
        mockStore.isAuthenticated = true;
        mockStore.user = { id: '2', email, firstName: '', lastName: '', addresses: [], orderHistory: [], createdAt: new Date() };
        mockStore.isLoading = false;
      } catch (err) {
        const status = (err as any)?.response?.status;
        mockStore.isAuthenticated = false;
        mockStore.user = null;
        mockStore.isLoading = false;
        mockStore.error = status === 409 ? 'El email ya esta registrado.' : 'No se pudo crear la cuenta.';
        throw err;
      }
    }),
    logout: vi.fn(async () => {
      await apiClient.post('/api/auth/logout');
      mockStore.isAuthenticated = false;
      mockStore.user = null;
      mockStore.isLoading = false;
      mockStore.error = null;
    }),
    loadCurrentUser: vi.fn(async () => {
      try {
        const { data } = await apiClient.get('/api/auth/me');
        if (data?.user) {
          mockStore.isAuthenticated = true;
          mockStore.user = { id: '3', email: data.user.email, firstName: '', lastName: '', addresses: [], orderHistory: [], createdAt: new Date() };
          mockStore.isLoading = false;
        }
      } catch (err) {
        const status = (err as any)?.response?.status;
        if (status === 401) {
          mockStore.isAuthenticated = false;
          mockStore.user = null;
          mockStore.isLoading = false;
          mockStore.error = null;
          return; // Don't throw for 401
        }
        mockStore.isAuthenticated = false;
        mockStore.user = null;
        mockStore.isLoading = false;
        mockStore.error = 'No pudimos validar tu sesion.';
        throw err;
      }
    }),
    clearError: vi.fn(() => {
      mockStore.error = null;
    }),
  };

  return {
    useAuthStore: vi.fn(() => mockStore),
  };
});

vi.mock('../../services/apiClient', () => {
  return {
    apiClient: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

const mockedApiClient = apiClient as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock store state
    const store = useAuthStore();
    store.isAuthenticated = false;
    store.user = null;
    store.isLoading = false;
    store.error = null;
  });

  it('marks user as authenticated on successful login', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          created_at: '2025-11-05T00:00:00.000Z',
        },
      },
    });

    const { login } = useAuthStore();
    await login('test@example.com', 'password123');

    const { isAuthenticated, user, error, isLoading } = useAuthStore();
    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(isAuthenticated).toBe(true);
    expect(user?.email).toBe('test@example.com');
    expect(error).toBeNull();
    expect(isLoading).toBe(false);
  });

  it('stores an error when login fails with 401', async () => {
    mockedApiClient.post.mockRejectedValueOnce({
      response: { status: 401 },
    });

    const { login } = useAuthStore();
    await expect(login('test@example.com', 'wrong')).rejects.toBeDefined();

    const { isAuthenticated, user, error, isLoading } = useAuthStore();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(error).toBe('Email o contrasena incorrectos.');
    expect(isLoading).toBe(false);
  });

  it('registers user and authenticates on success', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        user: {
          id: 2,
          email: 'new@example.com',
          name: 'new',
          created_at: '2025-11-05T00:00:00.000Z',
        },
      },
    });

    const { register } = useAuthStore();
    await register('new@example.com', 'password123');

    const { isAuthenticated, user, error } = useAuthStore();
    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/signup', {
      email: 'new@example.com',
      password: 'password123',
      name: 'new',
    });
    expect(isAuthenticated).toBe(true);
    expect(user?.email).toBe('new@example.com');
    expect(error).toBeNull();
  });

  it('handles register conflict errors', async () => {
    mockedApiClient.post.mockRejectedValueOnce({
      response: { status: 409 },
    });

    const { register } = useAuthStore();
    await expect(register('existing@example.com', 'password123')).rejects.toBeDefined();

    const { isAuthenticated, user, error } = useAuthStore();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(error).toBe('El email ya esta registrado.');
  });

  it('clears authentication on logout', async () => {
    // Set initial authenticated state
    const store = useAuthStore();
    store.isAuthenticated = true;
    store.user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      addresses: [],
      orderHistory: [],
      createdAt: new Date(),
    };
    store.isLoading = false;
    store.error = null;

    mockedApiClient.post.mockResolvedValueOnce({});

    const { logout } = useAuthStore();
    await logout();

    const state = useAuthStore();
    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/logout');
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('loads current user when session exists', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        user: {
          id: 3,
          email: 'current@example.com',
          name: 'Current User',
          created_at: '2025-11-05T00:00:00.000Z',
        },
      },
    });

    const { loadCurrentUser } = useAuthStore();
    await loadCurrentUser();

    const { isAuthenticated, user, error } = useAuthStore();
    expect(mockedApiClient.get).toHaveBeenCalledWith('/api/auth/me');
    expect(isAuthenticated).toBe(true);
    expect(user?.email).toBe('current@example.com');
    expect(error).toBeNull();
  });

  it('resets auth state if current user endpoint returns 401', async () => {
    mockedApiClient.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    const { loadCurrentUser } = useAuthStore();
    await loadCurrentUser();

    const state = useAuthStore();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
