/* eslint-disable react-refresh/only-export-components */
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
// Inicializar un i18n ligero para los tests (traducciones usadas por los tests)
import i18nTestInstance from './test-i18n';

// Wrapper personalizado que incluye los providers necesarios
export function renderWithProviders(ui: ReactElement) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={i18nTestInstance}>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nextProvider>
    ),
  });
}

// Re-exportar todo de testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
