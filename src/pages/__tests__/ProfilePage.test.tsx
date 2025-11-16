import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from '../ProfilePage';
import { AuthProvider } from '../../contexts/AuthContext';
import * as useAuthModule from '../../hooks/useAuth';
import { includesText } from '../../test/utils/text';

// Mock the useAuth hook (ProfilePage usa useAuth)
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isLoading: false,
    updateProfile: vi.fn(),
  })),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      updateProfile: vi.fn(),
    });
  });

  const renderProfilePage = (initialEntries = ['/profile']) => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('muestra acceso denegado cuando no está autenticado', () => {
    renderProfilePage();
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    expect(
      screen.getByText(includesText('Debes iniciar sesión para ver tu perfil.'))
    ).toBeInTheDocument();
  });

  it('renderiza información de usuario cuando está autenticado', () => {
    const mockUser = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '',
      addresses: [],
      orderHistory: [],
      createdAt: new Date(),
    } as any;
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false,
      updateProfile: vi.fn(),
    });
    renderProfilePage();

    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renderiza secciones de perfil correctamente', () => {
    const mockUser = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '',
      addresses: [],
      orderHistory: [],
      createdAt: new Date(),
    } as any;
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false,
      updateProfile: vi.fn(),
    });
    renderProfilePage();

    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: includesText('Información personal') })
    ).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});

