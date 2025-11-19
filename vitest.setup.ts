import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// extend vitest expect with jest-dom matchers
expect.extend(matchers as any);

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
  } catch (e) {
    // ignore if we can't override
  }
}
