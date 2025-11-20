import { describe, it, expect, vi } from 'vitest';
import { render } from '../../test/test-utils';
import BlogPostModal from '../../../components/BlogPostModal';

const basePost = {
  title: 'Sanidad del contenido',
  summary: 'Resumen breve',
  imageUrl: '/img/test.jpg',
};

describe('BlogPostModal', () => {
  it('limpia atributos inseguros antes de renderizar', () => {
    const maliciousContent =
      '<img src="x" onerror="alert(`hack`)" /><script>alert("hack")</script><p>Seguro</p>';
    const { container, getByText } = render(
      <BlogPostModal
        isOpen
        post={{
          ...basePost,
          content: maliciousContent,
        }}
        onClose={vi.fn()}
      />
    );

    expect(getByText('Seguro')).toBeInTheDocument();
    const renderedHtml = container.querySelector('.text-gray-700');
    expect(renderedHtml?.innerHTML).not.toContain('script');
    expect(renderedHtml?.innerHTML).not.toContain('onerror');
  });
});
