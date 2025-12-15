import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import BreadcrumbStructuredData from '../BreadcrumbStructuredData';

describe('BreadcrumbStructuredData', () => {
  it('should render script tag with sanitized JSON content', () => {
    const data = {
      '@context': 'https://schema.org',
      name: 'Test <script>',
    };

    const { container } = render(<BreadcrumbStructuredData data={data} />);
    const script = container.querySelector('script');

    expect(script).toBeDefined();
    expect(script?.getAttribute('type')).toBe('application/ld+json');
    expect(script?.innerHTML).toContain('"name":"Test \\u003cscript\\u003e"');
    expect(script?.innerHTML).not.toContain('<script>');
  });
});
