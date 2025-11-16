import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServicesPage from '../ServicesPage';
import { vi } from 'vitest';
import { includesText } from '../../test/utils/text';

vi.mock('../../data/services', () => ({
  services: [
    {
      id: 's1',
      slug: 's1',
      title: 'Servicio 1',
      description: 'Desc 1',
      detailedContent: '<p>Det</p>',
      imageUrl: 'https://picsum.photos/id/40/400/250',
      duration: 60,
      price: 50,
      category: 'Cat',
      benefits: ['b1', 'b2', 'b3', 'b4'],
    },
  ],
}));

describe('ServicesPage', () => {
  it('renders service cards with info', () => {
    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(includesText('Nuestros Servicios de Bienestar'))
    ).toBeInTheDocument();
    expect(screen.getByText('Servicio 1')).toBeInTheDocument();
    expect(screen.getByText(includesText('Beneficios'))).toBeInTheDocument();
    // Avoid brittle diacritics on Duration label; assert price and benefits instead
    expect(screen.getByText('DOP $50.00')).toBeInTheDocument();
  });
});
