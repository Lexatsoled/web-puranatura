import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import BlogPostPage from '../BlogPostPage';
import { includesText } from '../../test/utils/text';

vi.mock('../../data/blog', () => ({
  blogPosts: [
    {
      id: 'abc',
      title: 'Post ABC',
      summary: 'Sum ABC',
      content: '<h2>Contenido</h2><p>Hola</p>',
      author: 'Aut',
      date: '2025-01-01',
      imageUrl: 'https://picsum.photos/id/10/800/400',
      tags: [],
      slug: 'abc',
      readTime: 5,
      category: 'Cat',
    },
    {
      id: 'xyz',
      title: 'Post XYZ',
      summary: 'Sum XYZ',
      content: '<p>Otro</p>',
      author: 'Aut',
      date: '2025-01-02',
      imageUrl: 'https://picsum.photos/id/11/800/400',
      tags: [],
      slug: 'xyz',
      readTime: 4,
      category: 'Cat',
    },
  ],
}));

describe('BlogPostPage', () => {
  const renderWithRoute = (initialEntries: string[]) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/blog" element={<div>Blog Index</div>} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders loading then post when found', async () => {
    renderWithRoute(['/blog/abc']);
    expect(await screen.findByRole('heading', { name: /Post ABC/i })).toBeInTheDocument();
    expect(screen.getByText(includesText('Volver al Blog'))).toBeInTheDocument();
  });

  it('navigates to /blog if not found', async () => {
    renderWithRoute(['/blog/not-exists']);
    await waitFor(() => {
      expect(screen.getByText('Blog Index')).toBeInTheDocument();
    });
  });
});
