import { describe, it, expect } from 'vitest';
import { render } from '../../test/test-utils';
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
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
});
