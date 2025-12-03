import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import React from 'react';

// extend vitest expect with jest-dom matchers
expect.extend(matchers as any);

type TestImportMeta = ImportMeta & {
  env: Record<string, string | undefined>;
};

const testEnv = (import.meta as TestImportMeta).env;
if (testEnv) {
  testEnv.VITE_ENABLE_ANALYTICS = testEnv.VITE_ENABLE_ANALYTICS ?? 'true';
  testEnv.VITE_GA_ID = testEnv.VITE_GA_ID ?? 'G-TEST';
  testEnv.VITE_FB_PIXEL_ID = testEnv.VITE_FB_PIXEL_ID ?? 'FB-TEST';
}

// Mock framer-motion to avoid animation side effects in tests which
// can lead to unhandled errors in the JSDOM environment. Tests don't
// need motion behaviour — only structure and accessibility.
try {
  vi.mock('framer-motion', () => ({
    // Proxy any motion.<tag> usage to a plain React element of that tag
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => (props: any) =>
          React.createElement(String(prop), props, props?.children),
      }
    ),
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  }));
} catch {
  // If mocking isn't available in a particular runner, ignore.
}

// Provide reliable localStorage mock regardless of environment flags
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (typeof window !== 'undefined') {
  try {
    // If localStorage is not available, or missing critical methods, provide a stable shim.
    // *Always* replace localStorage with a controlled, test-friendly shim so
    // tests can rely on predictable behavior even when a --localstorage-file
    // flag or env modifies the default implementation.
    const instance = new LocalStorageMock() as any;
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      enumerable: true,
      value: instance,
    });
    // Ensure clear/getItem/setItem/removeItem are functional
    const storage = (window as any).localStorage;
    if (
      typeof storage.getItem !== 'function' ||
      typeof storage.setItem !== 'function'
    ) {
      const instance = new LocalStorageMock() as any;
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        enumerable: true,
        value: instance,
      });
    } else if (typeof storage.clear !== 'function') {
      // Not overriding window.localStorage entirely (so mocking Storage.prototype works).
      (window as any).localStorage.clear = function (this: any) {
        // basic clear using keys
        const keys = Object.keys(this._store || {});
        for (const k of keys) delete this._store[k];
      } as any;
    }
  } catch {
    // Ignorar si no se puede sobrescribir (entorno test no soporta overrides)
  }
}

// Some DOM runner environments (e.g. minimal Happy DOM setups) don't
// provide certain built-in element constructors like HTMLIFrameElement.
// react-dom's internal getActiveElementDeep does an `instanceof` check
// against window.HTMLIFrameElement which will throw if the RHS is
// undefined. Add a small, safe shim to avoid "Right-hand side of
// 'instanceof' is not an object" errors in tests.
try {
  if (typeof (globalThis as any).HTMLIFrameElement === 'undefined') {
    (globalThis as any).HTMLIFrameElement = class HTMLIFrameElement {};
  }
} catch {
  // ignore — test environment may disallow global mutation
}
