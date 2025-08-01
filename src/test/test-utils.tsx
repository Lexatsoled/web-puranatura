import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

// Wrapper personalizado que incluye los providers necesarios
export function renderWithProviders(ui: ReactElement) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    ),
  });
}

// Re-exportar todo de testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
