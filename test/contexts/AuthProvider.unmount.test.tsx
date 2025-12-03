import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { vi, beforeEach, afterEach, test, expect } from 'vitest';

// Mock the api used by AuthProvider (useApi hook)
let resolveValue: (v?: any) => void;
const loginPromise = new Promise((res) => {
  resolveValue = res;
});

const mockApi = {
  post: vi.fn(() => loginPromise),
  get: vi.fn(() => loginPromise),
};

vi.mock('../../src/utils/api', () => ({
  useApi: () => mockApi,
}));

import { AuthProvider, useAuth } from '../../contexts/AuthContext';

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  // cleanup any pending timers/promises if necessary
});

test('login does not try to update state after unmount', async () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  function TriggerLogin() {
    const auth = useAuth();
    useEffect(() => {
      // call login and then unmount immediately
      void auth.login('foo@example.com', 'password');
    }, [auth]);
    return null;
  }

  const r = render(
    <AuthProvider>
      <TriggerLogin />
    </AuthProvider>
  );

  // unmount before the mocked API resolves
  r.unmount();

  // resolve the pending login promise
  resolveValue?.({
    user: { id: '1', email: 'foo@example.com', firstName: 'F', lastName: 'L' },
  });

  // give microtasks a chance to run
  await Promise.resolve();

  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

test('initial loadSession does not update state after unmount', async () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  function Consumer() {
    // just use context to force provider mount behavior
    useAuth();
    return null;
  }

  const r = render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  // unmount immediately — loadSession (get) will resolve later
  r.unmount();

  // resolve the pending get promise
  resolveValue?.({
    user: { id: '2', email: 'me@example.com', firstName: 'X', lastName: 'Y' },
  });

  await Promise.resolve();

  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});
