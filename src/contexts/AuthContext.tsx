import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de usuario
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  addresses: Address[];
  orderHistory: Order[];
  createdAt: Date;
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

// Contexto de autenticación
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('puranatura-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('puranatura-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('puranatura-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('puranatura-user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar credenciales (simulado)
    const savedUsers = JSON.parse(localStorage.getItem('puranatura-users') || '[]');
    const foundUser = savedUsers.find((u: any) => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Verificar si el email ya existe
      const savedUsers = JSON.parse(localStorage.getItem('puranatura-users') || '[]');
      const emailExists = savedUsers.some((u: any) => u.email === userData.email);
      
      if (emailExists) {
        setIsLoading(false);
        return false;
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        addresses: [],
        orderHistory: [],
        createdAt: new Date()
      };
      
      // Guardar en "base de datos" simulada
      const userWithPassword = { ...newUser, password: userData.password };
      savedUsers.push(userWithPassword);
      localStorage.setItem('puranatura-users', JSON.stringify(savedUsers));
      
      // Autenticar automáticamente
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Actualizar en "base de datos"
      const savedUsers = JSON.parse(localStorage.getItem('puranatura-users') || '[]');
      const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        savedUsers[userIndex] = { ...savedUsers[userIndex], ...userData };
        localStorage.setItem('puranatura-users', JSON.stringify(savedUsers));
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
