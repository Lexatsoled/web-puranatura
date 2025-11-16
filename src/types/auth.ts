// JWT Authentication Types
export interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface JWTToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  tokens?: AuthTokens;
  error?: string;
}

// User types (keeping existing ones)
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
  role?: string;
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
  items: Array<Record<string, unknown>>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  getCurrentUser: () => Promise<User | null>;
}

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

// API Response Types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
}
