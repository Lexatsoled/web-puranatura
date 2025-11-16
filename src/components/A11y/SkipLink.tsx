/**
 * Skip Link Component
 * Permite a usuarios de teclado/screen reader saltar directamente al contenido principal
 * WCAG 2.1 - Criterio 2.4.1 (Bypass Blocks) - Nivel A
 */

import React from 'react';
import './SkipLink.css';

const SkipLink: React.FC = () => {
  const handleSkip = (
    e:
      | React.MouseEvent<HTMLAnchorElement>
      | React.KeyboardEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // Hacer el elemento enfocable temporalmente si no lo es
      const originalTabIndex = mainContent.getAttribute('tabindex');
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();

      // Scroll suave al contenido
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Restaurar tabindex original
      setTimeout(() => {
        if (originalTabIndex) {
          mainContent.setAttribute('tabindex', originalTabIndex);
        } else {
          mainContent.removeAttribute('tabindex');
        }
      }, 100);
    }
  };

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSkip(e);
        }
      }}
    >
      Saltar al contenido principal
    </a>
  );
};

export default SkipLink;
