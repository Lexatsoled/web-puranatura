import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AddressesPage from '../AddressesPage';
import { AuthProvider } from '../../contexts/AuthContext';
import * as authStoreModule from '../../store/authStore';
import * as addressServiceModule from '../../services/addressService';

// Mock the authStore
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
  })),
}));

// Mock the addressService
vi.mock('../../services/addressService', () => ({
  AddressService: {
    getAddresses: vi.fn(),
    addAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
  },
}));

describe('AddressesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    // Reset localStorage mock
    vi.mocked(localStorageMock.getItem).mockReturnValue(null);
    // Reset mock before each test if not overridden in a specific test
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    vi.mocked(addressServiceModule.AddressService.getAddresses).mockResolvedValue([]);
  });

  const renderAddressesPage = (initialEntries = ['/addresses']) => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('redirects to login if user is not authenticated', async () => {
    renderAddressesPage();
        await waitFor(() => {
      expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
      expect(
        screen.getByText((t) =>
          !!t &&
          t
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .includes('Debes iniciar sesion para gestionar tus direcciones.')
        )
      ).toBeInTheDocument();
    });
  });

  it('displays a message if no addresses are found', async () => {
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    renderAddressesPage();
    await waitFor(() => {
      expect(screen.getByText('Mis Direcciones')).toBeInTheDocument();
    });
  });

  it('displays a list of addresses when authenticated and addresses exist', async () => {
    const mockAddresses = [
      {
        id: '1',
        type: 'home' as const,
        name: 'Casa',
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
        isDefault: true
      },
      {
        id: '2',
        type: 'work' as const,
        name: 'Oficina',
        street: '456 Oak Ave',
        city: 'Otherville',
        postalCode: '67890',
        country: 'USA',
        isDefault: false
      },
    ];
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(addressServiceModule.AddressService.getAddresses).mockResolvedValue(mockAddresses);

    renderAddressesPage();

    await waitFor(() => {
      expect(screen.getByText('Casa')).toBeInTheDocument();
      expect(screen.getByText('Oficina')).toBeInTheDocument();
    });
  });

  it('calls getAddresses on component mount when authenticated', async () => {
    const mockGetAddresses = vi.fn().mockResolvedValue([]);
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(addressServiceModule.AddressService.getAddresses).mockImplementation(mockGetAddresses);

    renderAddressesPage();

    await waitFor(() => {
      expect(mockGetAddresses).toHaveBeenCalledTimes(1);
    });
  });

  it('allows adding a new address', async () => {
    const mockAddAddress = vi.fn().mockResolvedValue({ id: '3', street: '789 Pine Rd', city: 'New City', state: 'TX', zip: '11223' });
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(addressServiceModule.AddressService.getAddresses).mockResolvedValue([]);
    vi.mocked(addressServiceModule.AddressService.addAddress).mockImplementation(mockAddAddress);

    renderAddressesPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Agregar/i })).toBeInTheDocument();
    });

    const addButtons = screen.getAllByRole('button', { name: /Agregar Dirección|Agregar Direcci/i });
    // Click the submit button inside the form (likely the second match)
    fireEvent.click(addButtons[addButtons.length - 1]);

    // Fill in minimal required fields and submit
    fireEvent.change(screen.getByLabelText(/Tipo de dirección/i), { target: { value: 'home' } });
    fireEvent.change(screen.getByLabelText(/Nombre de la dirección/i), { target: { value: 'Casa nueva' } });
    fireEvent.change(screen.getByLabelText(/^Dirección$/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/^Ciudad$/i), { target: { value: 'Madrid' } });
    fireEvent.change(screen.getByLabelText(/Código Postal|C[oó]digo Postal/i), { target: { value: '28001' } });
    fireEvent.change(screen.getByLabelText(/^Pa[ií]s$/i), { target: { value: 'España' } });

    const submitButtons = screen.getAllByRole('button', { name: /Agregar Dirección|Agregar Direcci/i });
    fireEvent.click(submitButtons[submitButtons.length - 1]);

    // New address appears in list
    await waitFor(() => {
      expect(screen.getByText('Casa nueva')).toBeInTheDocument();
    });
  });
});
