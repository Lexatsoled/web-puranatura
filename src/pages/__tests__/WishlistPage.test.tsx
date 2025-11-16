import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WishlistPage from '../WishlistPage';
import { AuthProvider } from '../../contexts/AuthContext';
import * as authStoreModule from '../../store/authStore';
import * as wishlistStoreModule from '../../store/wishlistStore';
import { Product } from '../../types/product';
import { includesText } from '../../test/utils/text';

// Mock the authStore
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
  })),
}));

// Mock the wishlistStore
vi.mock('../../store/wishlistStore', () => ({
  useWishlistStore: vi.fn(() => ({
    items: [],
    loadWishlist: vi.fn(),
  removeItem: vi.fn(),
  })),
}));

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wishlist Product 1',
    price: 10,
    images: [],
    categories: [],
    description: 'Test product 1',
    stock: 5,
    sku: 'TEST-1',
    tags: [],
  },
  {
    id: '2',
    name: 'Wishlist Product 2',
    price: 20,
    images: [],
    categories: [],
    description: 'Test product 2',
    stock: 10,
    sku: 'TEST-2',
    tags: [],
  },
];

describe('WishlistPage', () => {
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
    // Reset authStore mock
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    // Reset wishlistStore mock
    vi.mocked(wishlistStoreModule.useWishlistStore).mockReturnValue({
      wishlist: [],
      loadWishlist: vi.fn(),
  removeItem: vi.fn(),
    });
  });

  const renderWishlistPage = (initialEntries = ['/wishlist']) => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('redirects to login if user is not authenticated', () => {
    renderWishlistPage();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('displays a message if the wishlist is empty', async () => {
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    renderWishlistPage();
    await waitFor(() => {
      expect(
        screen.getByText(includesText('Tu lista de deseos está vacía'))
      ).toBeInTheDocument();
    });
  });

  it('displays a list of wishlisted products when authenticated and wishlist is not empty', async () => {
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(wishlistStoreModule.useWishlistStore).mockReturnValue({
      items: mockProducts,
      loadWishlist: vi.fn(),
  removeItem: vi.fn(),
    });
    renderWishlistPage();

    await waitFor(() => {
      expect(screen.getByText('Wishlist Product 1')).toBeInTheDocument();
      expect(screen.getByText('Wishlist Product 2')).toBeInTheDocument();
      expect(screen.getByTestId('wishlist-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('wishlist-item-2')).toBeInTheDocument();
    });
  });


  it('calls removeFromWishlist when remove button is clicked', async () => {
  const mockRemoveItem = vi.fn();
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(wishlistStoreModule.useWishlistStore).mockReturnValue({
      items: mockProducts,
      loadWishlist: vi.fn(),
  removeItem: mockRemoveItem,
    });
    renderWishlistPage();

    // Esperar a que el botón esté en el DOM de forma robusta
    const removeButton = await screen.findByTestId('remove-button-1');
    await act(async () => {
      fireEvent.click(removeButton);
    });
  await waitFor(() => expect(mockRemoveItem).toHaveBeenCalledWith('1'));
  });

  it('bulk removes selected items after confirmation', async () => {
  const mockRemoveItem = vi.fn();
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(wishlistStoreModule.useWishlistStore).mockReturnValue({
      items: mockProducts,
      loadWishlist: vi.fn(),
  removeItem: mockRemoveItem,
    });

    // Confirm dialog returns true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWishlistPage();

    // select first item
    const firstItem = await screen.findByTestId('wishlist-item-1');
    const checkbox = firstItem.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await act(async () => {
      checkbox?.click();
    });

    // click bulk remove
    const bulkRemoveBtn = await screen.findByRole('button', {
      name: /Eliminar \(1\) seleccionados/i,
    });
    await act(async () => {
      bulkRemoveBtn.click();
    });

  await waitFor(() => expect(mockRemoveItem).toHaveBeenCalledWith('1'));
  });
});
