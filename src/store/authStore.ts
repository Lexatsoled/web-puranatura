import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { isAxiosError } from 'axios';
import { User } from '@/types/auth';
import { apiClient } from '@/services/apiClient';
import {
  BackendUserDTO,
  composeFullName,
  mapBackendUserToUser,
} from '@/utils/authMapper';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
  clearError: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const extractStatusCode = (error: unknown): number | undefined => {
  if (isAxiosError(error)) {
    return error.response?.status;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  ) {
    return (error as { response?: { status?: number } }).response?.status;
  }

  return undefined;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      login: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const { data } = await apiClient.post<{ user: BackendUserDTO }>(
            '/api/v1/auth/login',
            { email, password }
          );

          set((state) => {
            state.isAuthenticated = true;
            state.user = mapBackendUserToUser(data.user);
            state.isLoading = false;
          });
        } catch (err) {
          const status = extractStatusCode(err);
          set((state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isLoading = false;
            state.error =
              status === 401
                ? 'Email o contrasena incorrectos.'
                : 'No se pudo iniciar sesion.';
          });
          throw err;
        }
      },

      register: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const name = composeFullName(undefined, undefined, email);
          const { data } = await apiClient.post<{ user: BackendUserDTO }>(
            '/api/v1/auth/signup',
            { email, password, name }
          );

          set((state) => {
            state.isAuthenticated = true;
            state.user = mapBackendUserToUser(data.user);
            state.isLoading = false;
          });
        } catch (err) {
          const status = extractStatusCode(err);
          set((state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isLoading = false;
            state.error =
              status === 409
                ? 'El email ya esta registrado.'
                : 'No se pudo crear la cuenta.';
          });
          throw err;
        }
      },

      logout: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          await apiClient.post('/api/v1/auth/logout');
        } finally {
          set(() => ({
            ...initialState,
          }));
        }
      },

      loadCurrentUser: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const { data } = await apiClient.get<{ user: BackendUserDTO }>(
            '/api/v1/auth/me'
          );

          if (data?.user) {
            set((state) => {
              state.isAuthenticated = true;
              state.user = mapBackendUserToUser(data.user);
              state.isLoading = false;
            });
          } else {
            set(() => ({ ...initialState }));
          }
        } catch (err) {
          const status = extractStatusCode(err);
          if (status === 401) {
            set(() => ({ ...initialState }));
            return;
          }

          set((state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isLoading = false;
            state.error = 'No pudimos validar tu sesion.';
          });
        }
      },
    })),
    {
      name: 'pureza-naturalis-auth-storage',
      version: 2,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
