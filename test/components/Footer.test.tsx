import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../src/components/Footer';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Footer Component', () => {
  it('renders footer correctly', () => {
    const { container } = render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('contains copyright information', () => {
    const { getByText } = render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(getByText(/© 2024 Pureza Naturalis/)).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    const { getByText } = render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(getByText('Tienda')).toBeInTheDocument();
    expect(getByText('Blog')).toBeInTheDocument();
    expect(getByText('Servicios')).toBeInTheDocument();
  });
});