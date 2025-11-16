import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { isAxiosError } from 'axios';
import {
  User,
  AuthContextType,
  LoginCredentials,
  RegisterData,
} from '../types/auth';
import { apiClient, refreshAccessToken } from '@/services/apiClient';
import {
  BackendUserDTO,
  composeFullName,
  mapBackendUserToUser,
} from '@/utils/authMapper';
import { sanitizeFormValues } from '@/utils/sanitizer';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logAuthError = useCallback(async (err: unknown, message: string) => {
    try {
      const { errorLogger, ErrorSeverity, ErrorCategory } = await import(
        '../services/errorLogger'
      );
      errorLogger.log(
        err instanceof Error ? err : new Error(String(err)),
        ErrorSeverity.MEDIUM,
        ErrorCategory.STATE,
        { context: 'AuthContext', message }
      );
    } catch {
      // Ignore logging failures to keep auth flow resilient
    }
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const { data } = await apiClient.get<{ user: BackendUserDTO }>(
        '/api/v1/auth/me'
      );
      if (data?.user) {
        const mappedUser = mapBackendUserToUser(data.user);
        setUser(mappedUser);
        setError(null);
        return mappedUser;
      }
      setUser(null);
      return null;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setUser(null);
        return null;
      }
      await logAuthError(err, 'Error fetching current user');
      setError('No pudimos validar tu sesion. Intenta iniciar sesion de nuevo.');
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logAuthError]);

  useEffect(() => {
    fetchCurrentUser().catch(async (err) => {
      await logAuthError(err, 'Error inicializando autenticacion');
    });
  }, [fetchCurrentUser, logAuthError]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      const sanitizedCredentials = sanitizeFormValues(credentials);
      const { data } = await apiClient.post<{ user: BackendUserDTO }>(
        '/api/v1/auth/login',
        sanitizedCredentials
      );
      const mappedUser = mapBackendUserToUser(data.user);
      setUser(mappedUser);
      setError(null);
      return true;
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Email o contrasena incorrectos.');
          return false;
        }
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          'No se pudo iniciar sesion.';
        setError(message);
      } else {
        setError('Ocurrio un error inesperado al iniciar sesion.');
      }
      await logAuthError(err, 'Login error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const sanitizedData = sanitizeFormValues(userData);
      const fullName = composeFullName(
        sanitizedData.firstName,
        sanitizedData.lastName,
        sanitizedData.email
      );

      const { data } = await apiClient.post<{ user: BackendUserDTO }>(
        '/api/auth/signup',
        {
          email: sanitizedData.email,
          password: sanitizedData.password,
          name: fullName,
        }
      );

      const mappedUser = mapBackendUserToUser(data.user);
      setUser(mappedUser);
      setError(null);
      return true;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError('El email ya esta registrado.');
        return false;
      }
      await logAuthError(err, 'Registration error');
      setError('No se pudo crear la cuenta. Intenta nuevamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      await logAuthError(err, 'Logout error');
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) {
      return false;
    }

    // TODO: Integrate with backend profile endpoint (future phase)
    setUser({ ...user, ...userData });
    return true;
  };

  const clearError = () => {
    setError(null);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      await refreshAccessToken();
      return true;
    } catch (err) {
      await logAuthError(err, 'Refresh token error');
      setUser(null);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    tokens: null,
    isLoading,
    isAuthenticated: Boolean(user),
    error,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    clearError,
    getCurrentUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
