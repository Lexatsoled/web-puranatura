import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductDetails from '../ProductDetails';
import { Product } from '../../types/product';
import * as cartStoreModule from '../../store/cartStore';
import * as wishlistStoreModule from '../../store/wishlistStore';
import * as productHelpersModule from '../../services/productHelpers';
import * as quantitySelectorModule from '../QuantitySelector';
import * as productImageGalleryModule from '../ProductImageGallery';
import { includesText } from '../../test/utils/text';

// Mock ProductService
vi.mock('../../services/ProductService', () => ({
  ProductService: {
    formatPrice: vi.fn((price) => `$${price.toFixed(2)}`),
    calculateUnitPrice: vi.fn(() => null),
    calculateDiscountedPrice: vi.fn((product) => ({
      originalPrice: product.price,
      finalPrice: product.price,
      discountPercentage: 0,
      hasDiscount: false,
    })),
    validateProductForCart: vi.fn(() => ({ valid: true })),
  },
}));

// Mock productHelpers
vi.mock('../../services/productHelpers', () => ({
  formatPrice: vi.fn((price) => `${price.toFixed(2).replace('.', ',')} €`),
  calculateUnitPrice: vi.fn(() => null),
  calculateDiscountedPrice: vi.fn((product) => ({
    originalPrice: product.price,
    finalPrice: product.price,
    discount: 0,
    hasDiscount: false,
  })),
  validateProduct: vi.fn(() => ({ isValid: true })),
  validateProductForCart: vi.fn(() => ({ isValid: true })),
}));

// Mock Cart Store
vi.mock('../../store/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    addToCart: vi.fn(),
    getItemQuantity: vi.fn(() => 0),
    cart: { items: [], total: 0, count: 0 },
    isOpen: false,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    toggleCart: vi.fn(),
    setCartOpen: vi.fn(),
    hasItems: vi.fn(() => false),
  })),
}));

// Mock Wishlist Store
vi.mock('../../store/wishlistStore', () => ({
  useWishlistStore: vi.fn(() => ({
    toggleItem: vi.fn(),
    isInWishlist: vi.fn(() => false),
  })),
}));

// Mock QuantitySelector
vi.mock('../QuantitySelector', () => ({
  __esModule: true,
  default: vi.fn(({ initialValue, onChange, min, max }) => (
    <input
      data-testid="mock-quantity-selector"
      type="number"
      value={initialValue}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
    />
  )),
}));

// Mock ProductImageGallery
vi.mock('../ProductImageGallery', () => ({
  __esModule: true,
  default: vi.fn(({ images }) => (
    <div data-testid="mock-image-gallery">
      {images.map((img) => (
        <img key={img.full} src={img.full} alt={img.alt} />
      ))}
    </div>
  )),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a detailed description of the test product.',
  price: 100.0,
  categories: ['category-1'],
  images: [
    { full: 'image1-full.jpg', thumbnail: 'image1-thumb.jpg', alt: 'Test Product Image 1' },
    { full: 'image2-full.jpg', thumbnail: 'image2-thumb.jpg', alt: 'Test Product Image 2' },
  ],
  stock: 5,
  sku: 'TP-001',
  tags: ['tag1', 'tag2'],
  scientificReferences: [],
  benefits: ['Benefit 1', 'Benefit 2'],
  ingredients: ['Ingredient A', 'Ingredient B'],
  usage: 'Take one daily.',
  warnings: 'Consult doctor.',
  compareAtPrice: 120.0,
};

describe('ProductDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cartStoreModule.useCartStore).mockReturnValue({
      addToCart: vi.fn(),
      getItemQuantity: vi.fn(() => 0),
      cart: { items: [], total: 0, count: 0 },
      isOpen: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      toggleCart: vi.fn(),
      setCartOpen: vi.fn(),
      hasItems: vi.fn(() => false),
    });
    vi.mocked(wishlistStoreModule.useWishlistStore).mockReturnValue({
      toggleItem: vi.fn(),
      isInWishlist: vi.fn(() => false),
    });
    vi.mocked(productHelpersModule.formatPrice).mockImplementation(
      (price) => `${price.toFixed(2).replace('.', ',')} €`
    );
    vi.mocked(productHelpersModule.calculateDiscountedPrice).mockImplementation(
      (product) => ({
        originalPrice: product.price,
        finalPrice: product.price,
        discount: 0,
        hasDiscount: false,
      })
    );
    vi.mocked(quantitySelectorModule.default).mockImplementation(({ initialValue, onChange }) => (
      <input
        data-testid="mock-quantity-selector"
        type="number"
        value={initialValue}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    ));
    vi.mocked(productImageGalleryModule.default).mockImplementation(({ images }) => (
      <div data-testid="mock-image-gallery">
        {images.map((img) => (
          <img key={img.full} src={img.full} alt={img.alt} />
        ))}
      </div>
    ));
  });

  const renderProductDetails = (product: Product) => {
    render(
      <BrowserRouter>
        <ProductDetails product={product} />
      </BrowserRouter>
    );
  };

  it('renders product name, description, and price', () => {
    renderProductDetails(mockProduct);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.price.toFixed(2).replace('.', ',')} €`)).toBeInTheDocument();
  });

  it('displays product images using the mocked gallery', () => {
    renderProductDetails(mockProduct);
    expect(screen.getByTestId('mock-image-gallery')).toBeInTheDocument();
    expect(screen.getAllByAltText('Test Product Image 1').length).toBeGreaterThan(0);
  });

  it('renders quantity selector', () => {
    renderProductDetails(mockProduct);
    const quantityInput = screen.getByTestId('mock-quantity-selector');
    expect(quantityInput).toBeInTheDocument();
  });

  it('calls addToCart with correct product and quantity when button is clicked', () => {
    const { addToCart } = cartStoreModule.useCartStore();
    renderProductDetails(mockProduct);
    const quantityInput = screen.getByTestId('mock-quantity-selector');
    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.click(
      screen.getByRole('button', { name: includesText('Añadir al carrito') })
    );
    expect(addToCart).toHaveBeenCalledWith(mockProduct, 2);
  });

  it('renders wishlist button', () => {
    renderProductDetails(mockProduct);
    expect(
      screen.getByRole('button', { name: includesText('Añadir a lista de deseos') })
    ).toBeInTheDocument();
  });

  it('displays discounted price if available', () => {
    vi.mocked(productHelpersModule.calculateDiscountedPrice).mockImplementation(
      (product) => ({
        originalPrice: 120.0,
        finalPrice: 100.0,
        discount: 16,
        hasDiscount: true,
      })
    );
    renderProductDetails(mockProduct);
    expect(screen.getByText('120,00 €')).toBeInTheDocument(); // Original price
    expect(screen.getByText('100,00 €')).toBeInTheDocument(); // Final price
    expect(screen.getByText('16% OFF')).toBeInTheDocument();
  });

  it('disables add to cart button if product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderProductDetails(outOfStockProduct);
    expect(screen.getByRole('button', { name: /agotado/i })).toBeDisabled();
  });
});

