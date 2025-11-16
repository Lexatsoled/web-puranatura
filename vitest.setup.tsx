import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import * as ProductRepository from './src/services/ProductRepository';
// Instancia i18n usada para tests
import i18nTestInstance from './src/test/test-i18n';

// Extender expect con matchers de jest-dom
expect.extend(matchers);

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// Mock de ResizeObserver para tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de IntersectionObserver para tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de matchMedia para tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock global para react-lazy-load-image-component (con forwardRef para evitar warnings de ref)
vi.mock('react-lazy-load-image-component', async () => {
  const React = await import('react');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LazyLoadImage = React.forwardRef<any, any>((props, ref) =>
    React.createElement('img', { ...props, ref })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackWindowScroll = (Component: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.forwardRef<any, any>((props, ref) => React.createElement(Component, { ...props, ref }));
  return { LazyLoadImage, trackWindowScroll };
});

// Mock de react-i18next para que use nuestra instancia de test-i18n en todos los tests.
// Esto asegura que componentes que usan useTranslation() reciban las traducciones mínimas.
vi.mock('react-i18next', async () => {
  const reactI18next = await import('react-i18next');
  return {
    ...reactI18next,
    useTranslation: () => ({
      t: (key: string, opts?: Record<string, unknown>) => {
        // intentar resolver la clave en los recursos de test, sino devolver la clave
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = (i18nTestInstance as any).getResourceBundle?.('es', 'translation') || {};
        const raw = res[key] ?? key;
        if (opts && typeof raw === 'string') {
          return raw.replace(/{{(\w+)}}/g, (_m, p1) => String((opts as any)[p1] ?? ''));
        }
        return raw;
      },
      i18n: i18nTestInstance,
    }),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock global para framer-motion (genérico y con AnimatePresence)
vi.mock('framer-motion', async () => {
  const React = await import('react');

  // Proxy para soportar motion.div, motion.span, motion.button, etc.
  const motion = new Proxy({}, {
    get: (_target, prop: string) => {
      // Componente con forwardRef que preserva la etiqueta y filtra props de animación
      return React.forwardRef<HTMLElement, { children?: React.ReactNode; [key: string]: unknown }>(({ children, ...props }, ref) => {
        const filtered: Record<string, unknown> = {};
        for (const k of Object.keys(props)) {
          if (!['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants', 'layout'].includes(k)) {
            filtered[k] = (props as Record<string, unknown>)[k];
          }
        }
        return React.createElement(prop, { ...filtered, ref }, children as React.ReactNode);
      });
    },
  });

  // AnimatePresence como passthrough
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnimatePresence = ({ children }: any) => React.createElement(React.Fragment, null, children);

  return { __esModule: true, motion, AnimatePresence };
});
// Fijar zona horaria para estabilizar fechas en tests
// Debe ejecutarse antes de cualquier uso de Date
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).process = (globalThis as any).process || {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).process.env = { ...(globalThis as any).process.env, TZ: 'UTC' };

// Mock global de localStorage para el entorno de tests (vitest/jsdom)
// Implementación ligera con funciones que pueden ser espiadas si es necesario
(() => {
  let store: Record<string, string> = {};
  const localStorageMock = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
  try {
    Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, configurable: true });
  } catch {
    // En algunos entornos la propiedad ya está definida; asignar directamente en ese caso
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).localStorage = localStorageMock;
  }
})();

// Exponer ProductRepository globalmente para tests que lo referencian sin import
// (algunos tests antiguos asumen la existencia de este símbolo global)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Construir un objeto mock del ProductRepository con funciones vi.fn
// en lugar de mutar el namespace de módulos (que es de solo lectura en ESM).
const __productRepoMock: Record<string, unknown> = {};
Object.keys(ProductRepository).forEach((key) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (ProductRepository as any)[key];
  if (typeof value === 'function') {
    // Crear una función mock por defecto que los tests puedan espiar o sobreescribir
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (__productRepoMock as any)[key] = vi.fn();
  } else {
    (__productRepoMock as any)[key] = value;
  }
});

// Exponer el mock en globalThis para que los tests antiguos lo consuman
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ProductRepository = __productRepoMock;
