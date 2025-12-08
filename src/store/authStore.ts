import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: any) => Promise<void>; // Tipar mejor según types/auth
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.login(credentials);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Error al iniciar sesión',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.register(data);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Error al registrarse',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Opcional: llamar a endpoint de logout si existe
          // await authService.logout();
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch {
          // Token inválido o expirado
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        // TODO: Implementar llamada real a API cuando authService lo soporte
        // const updatedUser = await authService.updateProfile(data);
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
        return true;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
