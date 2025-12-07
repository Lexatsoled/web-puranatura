import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
// React import removed — not needed in this setup file (avoids unused var TS error)

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

// framer-motion removed from project (tests previously mocked it here).

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

try {
  if (typeof (globalThis as any).window !== 'undefined') {
    try {
      if (typeof (globalThis as any).window.HTMLIFrameElement === 'undefined') {
        (globalThis as any).window.HTMLIFrameElement = (
          globalThis as any
        ).HTMLIFrameElement;
      }
    } catch {
      /* ignore */
    }
  }
} catch {
  /* ignore */
}

// Provide a safe, no-op global fetch for tests so Happy DOM's
// default fetch won't attempt real network connections and produce
// noisy "socket hang up" errors in CI/local runs. Individual tests
// can override this with `vi.spyOn(globalThis, 'fetch')` or set their
// own implementations as needed.
try {
  // Always stub global fetch for tests so Happy DOM doesn't attempt
  // real HTTP requests which can produce noisy socket errors in CI.
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '',
    } as any)
  ) as typeof fetch;
} catch {
  // ignore if we can't override globals in this environment
}

// Silence known noisy warnings/errors that are either expected in the
// test harness or caused by third-party libs (but keep other console
// output showing so we don't hide real problems). We match a small set
// of patterns and let everything else pass through.
(() => {
  const origWarn = console.warn.bind(console);
  const origError = console.error.bind(console);

  const warnIgnore = [
    /useNotifications usado sin NotificationProvider - usando stub/i,
  ];

  const errorIgnore = [
    /Fetch\.onError/i,
    /socket hang up/i,
    /Received `true` for a non-boolean attribute `layout`/i,
    /Unknown event handler property `onHover(Start|End)`/i,
  ];

  console.warn = (...args: any[]) => {
    try {
      const text = args.join(' ');
      if (warnIgnore.some((rx) => rx.test(text))) return;
    } catch {
      /* fall through to original */
    }
    return origWarn(...args);
  };

  console.error = (...args: any[]) => {
    try {
      const text = args.join(' ');
      if (errorIgnore.some((rx) => rx.test(text))) return;
    } catch {
      /* fall through to original */
    }
    return origError(...args);
  };
})();
