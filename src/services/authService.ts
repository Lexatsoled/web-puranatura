import axios from 'axios';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para cookies httpOnly
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<{ user: User }>('/auth/me', data);
    return response.data.user;
  },
};
