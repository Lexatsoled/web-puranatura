import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SistemasSinergicosPage from '../SistemasSinergicosPage';
import { includesText } from '../../test/utils/text';

describe('SistemasSinergicosPage', () => {
  const renderWithRoutes = () =>
    render(
      <MemoryRouter initialEntries={['/sistemas']}>
        <Routes>
          <Route path="/sistemas" element={<SistemasSinergicosPage />} />
          <Route path="/tienda" element={<div>Tienda</div>} />
          <Route path="/producto/:id" element={<div>Producto</div>} />
        </Routes>
      </MemoryRouter>
    );

  it('renders and allows navigating to store via system CTA', () => {
    renderWithRoutes();
    // Be tolerant to encoding; assert at least one heading contains "Sistemas"
    const headings = screen.getAllByRole('heading');
    expect(headings.some(h => /Sistemas/i.test(h.textContent || ''))).toBe(true);
    const ctas = screen.getAllByRole('button', { name: /Ver Sistema Completo/i });
    fireEvent.click(ctas[0]);
    expect(screen.getByText('Tienda')).toBeInTheDocument();
  });
});
