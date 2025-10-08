import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { CartProvider } from '../../src/contexts/CartContext';
import { WishlistProvider } from '../../src/contexts/WishlistContext';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import ProductCard from '../../src/components/ProductCard';
import { Product } from '../../src/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  description: 'Test description',
  categories: ['Test Category'],
  images: [{ full: '/test-image.jpg', thumbnail: '/test-image-thumb.jpg', alt: 'Test Product' }],
  stock: 10,
  sku: 'TEST-001',
  tags: ['tag1'],
  rating: 4.5,
  reviewCount: 10,
  isNew: false,
  isBestSeller: false,
  compareAtPrice: 39.99
};

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(
      <AllProviders>
        <ProductCard product={mockProduct} />
      </AllProviders>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
  });

  it('displays organic and vegan badges', () => {
    render(
      <AllProviders>
        <ProductCard product={mockProduct} />
      </AllProviders>
    );

    expect(screen.getByText('Orgánico')).toBeInTheDocument();
    expect(screen.getByText('Vegano')).toBeInTheDocument();
  });

  it('shows rating and reviews', () => {
    render(
      <AllProviders>
        <ProductCard product={mockProduct} />
      </AllProviders>
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10 reseñas)')).toBeInTheDocument();
  });
});