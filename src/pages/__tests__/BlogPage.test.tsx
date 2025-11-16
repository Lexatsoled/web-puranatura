import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogPage from '../BlogPage';
import { vi } from 'vitest';
import { includesText } from '../../test/utils/text';

vi.mock('../../data/blog', () => ({
  blogPosts: [
    {
      id: 'post-1',
      title: 'Título de Prueba 1',
      summary: 'Resumen 1',
      content: '<p>Contenido</p>',
      author: 'Autor',
      date: '2025-01-01',
      imageUrl: 'https://picsum.photos/id/10/400/250',
      tags: ['tag'],
      slug: 'post-1',
      readTime: 3,
      category: 'Cat1',
    },
    {
      id: 'post-2',
      title: 'Título de Prueba 2',
      summary: 'Resumen 2',
      content: '<p>Contenido</p>',
      author: 'Autor',
      date: '2025-01-02',
      imageUrl: 'https://picsum.photos/id/20/400/250',
      tags: ['tag2'],
      slug: 'post-2',
      readTime: 4,
      category: 'Cat2',
    },
  ],
}));

describe('BlogPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <Routes>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<div>Detalle Post</div>} />
        </Routes>
      </MemoryRouter>
    );

  it('renders heading and post cards', () => {
    renderPage();
    expect(screen.getByText(includesText('Nuestro Blog de Bienestar'))).toBeInTheDocument();
    expect(screen.getByText('Título de Prueba 1')).toBeInTheDocument();
    expect(screen.getByText('Título de Prueba 2')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Leer/i }).length).toBeGreaterThan(0);
  });
});

