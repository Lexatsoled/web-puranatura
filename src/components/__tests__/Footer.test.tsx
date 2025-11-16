import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';
import { vi } from 'vitest';

describe('Footer', () => {
  it('renders footer correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('contains copyright information', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText('© 2025 Pureza Naturalis. Todos los derechos reservados.')).toBeInTheDocument();
  });

  it('contains social media links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
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
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText('Tu santuario de bienestar y salud natural. Conectando con la esencia de la naturaleza para una vida plena.')).toBeInTheDocument();
  });
});
