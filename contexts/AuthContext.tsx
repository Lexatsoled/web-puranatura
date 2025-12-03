import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useApi } from '../src/utils/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses?: Address[];
  orderHistory?: Order[];
  createdAt?: Date;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: Date;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ApiAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
let hasCheckedSession = false;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const api = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapUser = (apiUser: ApiAuthResponse['user']): User => ({
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    phone: apiUser.phone ?? undefined,
  });

  // Keep track of mount state so async flows don't try to update state
  // after the provider has been unmounted (prevents React post-teardown
  // commits that can cause "instanceof" errors during tests).
  const mountedRef = React.useRef(true);

  const loadSession = useCallback(async () => {
    try {
      const response = await api.get<{ user: ApiAuthResponse['user'] }>(
        '/auth/me'
      );
      setUser(mapUser(response.user));
    } catch {
      if (mountedRef.current) setUser(null);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (hasCheckedSession) {
      setIsLoading(false);
      return;
    }
    hasCheckedSession = true;
    loadSession();
  }, [loadSession]);

  // track mount/unmount so async functions can avoid updating state post-unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiAuthResponse>('/auth/login', {
        email,
        password,
      });
      if (mountedRef.current) setUser(mapUser(response.user));
      return true;
    } catch {
      return false;
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiAuthResponse>(
        '/auth/register',
        userData
      );
      if (mountedRef.current) setUser(mapUser(response.user));
      return true;
    } catch {
      return false;
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignorar fallo de logout del backend; limpiar la sesión igual.
    }
    setUser(null);
  }, [api]);

  useEffect(() => {
    const handleForcedLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, [logout]);

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    return true;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'useAuth debe usarse dentro de AuthProvider (envoltorio de autenticacion)'
    );
  }
  return context;
};
