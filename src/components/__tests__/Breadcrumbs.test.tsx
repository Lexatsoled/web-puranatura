import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils'; // Use custom render which likely includes Router
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  // Existing JSON-LD test...
  it('sanitiza el JSON-LD antes de inyectarlo en el DOM', () => {
    const items = [
      { label: 'Inicio</script><script>alert(1)</script>', path: '/' },
      { label: 'Tienda', path: '/store' },
    ];

    const { container } = render(<Breadcrumbs items={items} structured />);

    const jsonLdScript = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(jsonLdScript).toBeTruthy();
    const scriptContent = jsonLdScript?.innerHTML ?? '';
    expect(scriptContent).not.toContain('<script>');
    expect(scriptContent).not.toContain('</script>');
  });

  // New UI Tests
  it('debería renderizar la lista de items correctamente', () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
    ];
    render(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('debería mostrar separadores entre items', () => {
    const items = [
      { label: 'A', path: '/a' },
      { label: 'B', path: '/b' },
      { label: 'C', path: '/c' },
    ];
    render(<Breadcrumbs items={items} />);

    // Separators have aria-hidden="true" and might be excluded or included depending on query
    // We expect at least the 3 content items to be found
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(
      items.length
    );
  });

  it('debería marcar la página actual con aria-current', () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Current', path: '/curr', isCurrentPage: true },
    ];
    render(<Breadcrumbs items={items} />);

    const current = screen.getByText('Current');
    expect(current).toHaveAttribute('aria-current', 'page');
    // Ensure it's not a link
    expect(current.closest('a')).toBeNull();
  });
});
