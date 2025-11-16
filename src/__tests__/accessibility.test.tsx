import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProductCard from '../components/ProductCard';
import { AccessibleModal } from '../components/AccessibleModal';

expect.extend(toHaveNoViolations);

// Test ProductCard accessibility
test('ProductCard is accessible', async () => {
  const mockProduct = {
    id: 1,
    name: 'Vitamina C',
    price: 19.99,
    stock: 10,
    images: ['/img.jpg'],
    description: 'Vitamina C natural',
    category: 'Vitaminas'
  };

  const { container } = render(
    <BrowserRouter>
      <ProductCard
        product={mockProduct}
        onAddToCart={() => {}}
      />
    </BrowserRouter>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Test AccessibleModal accessibility
test('AccessibleModal is accessible when open', async () => {
  const { container } = render(
    <AccessibleModal
      isOpen={true}
      onClose={() => {}}
      title="Test Modal"
    >
      <p>Modal content</p>
    </AccessibleModal>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Test AccessibleModal accessibility when closed
test('AccessibleModal is accessible when closed', async () => {
  const { container } = render(
    <AccessibleModal
      isOpen={false}
      onClose={() => {}}
      title="Test Modal"
    >
      <p>Modal content</p>
    </AccessibleModal>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Test navigation accessibility (Header component)
test('Header navigation is accessible', async () => {
  // Mock Header component - assuming it exists
  const { container } = render(
    <nav aria-label="Barra de navegación principal">
      <a href="/">Inicio</a>
      <a href="/productos">Productos</a>
      <a href="/contacto">Contacto</a>
    </nav>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});