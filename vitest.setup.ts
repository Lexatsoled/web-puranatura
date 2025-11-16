// Archivo de configuración para inicializar mocks y variables de entorno

// Configurar variables de entorno necesarias para las pruebas
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

// Configurar el entorno jsdom explícitamente
import { TextEncoder } from 'util';
import { vi } from 'vitest';

// jsdom requiere TextEncoder en algunos casos
global.TextEncoder = TextEncoder;

// Solución final para TextDecoder
(async () => {
  if (typeof global.TextDecoder === 'undefined') {
    const util = await import('util');
    global.TextDecoder = util.TextDecoder as unknown as {
      new (label?: string, options?: TextDecoderOptions): TextDecoder;
      prototype: TextDecoder;
    };
  }
})();

// Mockear localStorage en window, global y globalThis
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Asignar a múltiples contextos para asegurar compatibilidad
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mockear cualquier módulo necesario
vi.mock('zustand', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    setItem: vi.fn(),
  });
});

// Mockear el módulo ../sanitizer
vi.mock('../sanitizer', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    sanitizeFormValues: vi.fn((data) => {
      if (typeof data === 'object' && data !== null) {
        const result = { ...data };
        Object.keys(result).forEach(key => {
          if (typeof result[key] === 'string') {
            result[key] = `sanitized-${result[key]}`;
          }
        });
        return result;
      }
      return data;
    }),
  });
});

// Mockear zustand persist middleware
vi.mock('zustand/middleware', async () => {
  const localStorageMock = {
    getItem: (key: string) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Ignore errors in tests
      }
    },
    removeItem: (key: string) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore errors in tests
      }
    },
  };

  return {
    persist: vi.fn((config: unknown, options?: { storage?: unknown }) => {
      // If storage is provided in options, use it; otherwise use our mock
      const storage = options?.storage || localStorageMock;
      return Object.assign({}, config, { storage });
    }),
    createJSONStorage: vi.fn(() => localStorageMock),
  };
});