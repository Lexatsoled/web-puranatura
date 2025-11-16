import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TestimonialsPage from '../TestimonialsPage';
import { vi } from 'vitest';

vi.mock('../../data/testimonials', () => ({
  testimonials: [
    { id: '1', name: 'Ana', text: 'Excelente atención', rating: 5, date: '2024-01-01' },
    { id: '2', name: 'Luis', text: 'Muy recomendado', rating: 4, date: '2024-02-01' },
  ],
}));

describe('TestimonialsPage', () => {
  it('renders testimonials list', () => {
    render(
      <MemoryRouter>
        <TestimonialsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Luis')).toBeInTheDocument();
    expect(screen.getByText(/Excelente atención/i)).toBeInTheDocument();
  });
});

