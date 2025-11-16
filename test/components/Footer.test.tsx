import { render, screen } from '@testing-library/react';
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
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('© 2025 Pureza Naturalis. Todos los derechos reservados.')).toBeInTheDocument();
  });

  it('contains social media links', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    // Buscar el nodo <address> por role 'group' y nombre 'Contacto'
    const address = screen.getByRole('group', { name: 'Contacto' });
    expect(address).toHaveTextContent(/Calle de la Salud 123.*Santo Domingo/);
    expect(address).toHaveTextContent(/Email:/);
    expect(address).toHaveTextContent(/info@puranatura\.do/);
    expect(address).toHaveTextContent(/Tel:/);
    expect(address).toHaveTextContent(/\(809\) 555-1234/);
  });

  it('displays company description', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    expect(screen.getByText('Tu santuario de bienestar y salud natural. Conectando con la esencia de la naturaleza para una vida plena.')).toBeInTheDocument();
  });
});
