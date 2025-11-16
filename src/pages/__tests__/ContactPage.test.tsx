import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from '../ContactPage';

describe('ContactPage', () => {
  it('renders contact information', () => {
    render(
      <BrowserRouter>
        <ContactPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Hablemos sobre tu bienestar')).toBeInTheDocument();
    expect(screen.getByText('Tel: +1 849 243 4010')).toBeInTheDocument();
    expect(screen.getByText('Email: lexatsoled@gmail.com')).toBeInTheDocument();
    // Dos ocurrencias de Cotuí en la página; aceptar cualquiera
    expect(screen.getAllByText(/Cotu/i).length).toBeGreaterThan(0);
  });

  it('renders the contact form', () => {
    render(
      <BrowserRouter>
        <ContactPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ayudarte/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar Mensaje' })).toBeInTheDocument();
  });

  it('validates the contact form', () => {
    render(
      <BrowserRouter>
        <ContactPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: 'Enviar Mensaje' });
    fireEvent.click(submitButton);

    expect(screen.getByLabelText(/Nombre completo/i)).toBeRequired();
    expect(screen.getByLabelText(/Correo/i)).toBeRequired();
    expect(screen.getByLabelText(/ayudarte/i)).toBeRequired();
  });

  it('submits the form with valid data', async () => {
    render(
      <BrowserRouter>
        <ContactPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/ayudarte/i), {
      target: { value: 'Test message' },
    });

    const submitButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const success = screen.getByText((t) =>
        !!t &&
        t
          .toString()
          .normalize('NFD')
          .replace(/[\u0300-\u036f\u00A1]/g, '')
          .includes('Gracias por tu mensaje')
      );
      expect(success).toBeInTheDocument();
    });
  });
});
