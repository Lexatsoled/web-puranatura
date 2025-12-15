import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import BlogPostModal from '../BlogPostModal';
import type { BlogPost } from '../../../types/blog';

// Mock useFocusTrap hook
vi.mock('../../../hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));

describe('BlogPostModal - XSS Security', () => {
  const createMockPost = (content: string): BlogPost => ({
    id: '1',
    title: 'Test Post',
    content,
    excerpt: 'Test excerpt',
    imageUrl: '/test-image.jpg',
    date: '2024-01-01',
    author: 'Test Author',
    readTime: 5,
    slug: 'test-post',
    category: 'Test',
  });

  it('should render safe HTML content', () => {
    const post = createMockPost('<p>Safe <strong>content</strong></p>');
    render(<BlogPostModal isOpen={true} onClose={() => {}} post={post} />);

    expect(screen.getByText(/Safe/)).toBeInTheDocument();
    expect(screen.getByText(/content/)).toBeInTheDocument();
  });

  it('should strip script tags from content', () => {
    const post = createMockPost(
      '<p>Normal text</p><script>alert("XSS")</script>'
    );
    const { container } = render(
      <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
    );

    const modalContent = within(container).getByRole('dialog');
    expect(modalContent.innerHTML).not.toContain('<script>');
    expect(modalContent.innerHTML).not.toContain('alert(');
  });

  it('should remove onclick handlers', () => {
    const post = createMockPost(
      '<a href="#" onclick="alert(\'XSS\')">Click me</a>'
    );
    const { container } = render(
      <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
    );

    const modalContent = within(container).getByRole('dialog');
    expect(modalContent.innerHTML).not.toContain('onclick');
  });

  it('should remove onerror handlers from images', () => {
    const post = createMockPost(
      '<img src="invalid" onerror="alert(\'XSS\')" />'
    );
    const { container } = render(
      <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
    );

    const modalContent = within(container).getByRole('dialog');
    expect(modalContent.innerHTML).not.toContain('onerror');
  });

  it('should remove iframe tags', () => {
    const post = createMockPost(
      '<p>Content</p><iframe src="https://evil.com"></iframe>'
    );
    const { container } = render(
      <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
    );

    const modalContent = within(container).getByRole('dialog');
    expect(modalContent.innerHTML).not.toContain('<iframe');
    expect(modalContent.innerHTML).not.toContain('evil.com');
  });

  it('should handle javascript: protocol in links', () => {
    const post = createMockPost(
      '<a href="javascript:alert(\'XSS\')">Malicious Link</a>'
    );
    const { container } = render(
      <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
    );

    const modalContent = within(container).getByRole('dialog');
    expect(modalContent.innerHTML).not.toContain('javascript:');
  });

  it('should allow safe HTML list structures', () => {
    const post = createMockPost('<ul><li>Item 1</li><li>Item 2</li></ul>');
    render(<BlogPostModal isOpen={true} onClose={() => {}} post={post} />);

    expect(screen.getByText(/Item 1/)).toBeInTheDocument();
    expect(screen.getByText(/Item 2/)).toBeInTheDocument();
  });

  it('should allow safe links with https', () => {
    const post = createMockPost('<a href="https://example.com">Safe Link</a>');
    render(<BlogPostModal isOpen={true} onClose={() => {}} post={post} />);

    const link = screen.getByText('Safe Link').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should not render when post is null', () => {
    const { container } = render(
      <BlogPostModal isOpen={true} onClose={() => {}} post={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should not render when isOpen is false', () => {
    const post = createMockPost('<p>Content</p>');
    const { container } = render(
      <BlogPostModal isOpen={false} onClose={() => {}} post={post} />
    );
    expect(container.firstChild).toBeNull();
  });

  describe('Complex XSS Attacks', () => {
    it('should block SVG-based XSS', () => {
      const post = createMockPost(
        '<svg onload="alert(\'XSS\')"><circle /></svg>'
      );
      const { container } = render(
        <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
      );

      const modalContent = within(container).getByRole('dialog');
      expect(modalContent.innerHTML).not.toContain('onload');
      expect(modalContent.innerHTML).not.toContain('alert');
    });

    it('should block nested script attempts', () => {
      const post = createMockPost(
        '<p><scr<script>ipt>alert("XSS")</scr</script>ipt></p>'
      );
      const { container } = render(
        <BlogPostModal isOpen={true} onClose={() => {}} post={post} />
      );

      const modalContent = within(container).getByRole('dialog');
      expect(modalContent.innerHTML).not.toContain('<script>');
    });

    it('should block form action XSS', () => {
      const post = createMockPost(
        '<form action="javascript:alert(1)"><input type="submit"></form>'
      );
      const { container } = render(<BlogPostModal isOpen={true} onClose={() => {}} post={post} />);

      const modalContent = within(container).getByRole('dialog');
      expect(modalContent.innerHTML).not.toContain('javascript:');
      // Form tag should be stripped entirely
      expect(modalContent.innerHTML).not.toContain('<form');
    });
  });
});
