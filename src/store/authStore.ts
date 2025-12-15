import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to allow checkAuth to verify cookie
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
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
      // Optional: call logout endpoint if backend supports it
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch {
      // Token invalid or expired
      // Do not call logout() here to avoid infinite loops if logout fails, just reset state
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(data);
      set(() => ({
        user: updatedUser,
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar perfil',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
