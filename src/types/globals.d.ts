// Global type augmentations used during tests and in the browser
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

// Test helper: some test files import 'supertest' without types
// add a local ambient declaration to avoid TS7016 while keeping
// dev-dependency upgrades optional in CI.
declare module 'supertest';

export {};
