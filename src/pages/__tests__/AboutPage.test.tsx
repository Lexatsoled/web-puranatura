import { render, screen } from '@testing-library/react';
import AboutPage from '../AboutPage';
import { MemoryRouter } from 'react-router-dom';
import { includesText } from '../../test/utils/text';

describe('AboutPage', () => {
  it('renders headings and key text', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByText(includesText('Sobre Pureza Naturalis'))).toBeInTheDocument();
    // Disambiguate by matching the specific subheading text
    expect(screen.getByRole('heading', { name: /Nuestra Filosof/i })).toBeInTheDocument();
    expect(screen.getByText(includesText('Nuestra Historia y Valores'))).toBeInTheDocument();
  });
});
