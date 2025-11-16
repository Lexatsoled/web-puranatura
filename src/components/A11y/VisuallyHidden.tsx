/**
 * Visually Hidden Component
 * Oculta contenido visualmente pero mantiene accesible para screen readers
 * WCAG 2.1 - Técnica C7
 */

import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: React.ElementType;
  focusable?: boolean;
}

const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  as = 'span',
  focusable = false,
}) => {
  const Component = as;

  return (
    <Component className="sr-only" {...(focusable ? { tabIndex: 0 } : {})}>
      {children}
    </Component>
  );
};

export default VisuallyHidden;

// Exportar también como clase CSS para uso directo
export const visuallyHiddenStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only-focusable:focus,
  .sr-only-focusable:active {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;
