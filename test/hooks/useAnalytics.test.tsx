import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { AnalyticsEvent } from '../../src/types/analytics';

type TestImportMeta = ImportMeta & {
  env: Record<string, string | undefined>;
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={['/inicio?page=1']}>{children}</MemoryRouter>
);

let useAnalytics: (typeof import('../../src/hooks/useAnalytics'))['useAnalytics'];
let analyticsProviders: typeof import('../../src/services/analyticsProviders');

describe('useAnalytics', () => {
  let logEventToProvidersSpy: any;
  let logEventToBackendSpy: any;
  let getSessionIdSpy: any;
  // initGoogleAnalytics/initFacebookPixel spies are not asserted in this suite

  beforeEach(async () => {
    vi.resetModules();
    process.env.VITE_ENABLE_ANALYTICS = 'true';
    process.env.VITE_GA_ID = 'G-TEST';
    process.env.VITE_FB_PIXEL_ID = 'FB-TEST';
    const testEnv = (import.meta as TestImportMeta).env;
    testEnv.VITE_ENABLE_ANALYTICS = 'true';
    testEnv.VITE_GA_ID = 'G-TEST';
    testEnv.VITE_FB_PIXEL_ID = 'FB-TEST';

    analyticsProviders = await import('../../src/services/analyticsProviders');
    const analyticsModule = await import('../../src/hooks/useAnalytics');
    useAnalytics = analyticsModule.useAnalytics;

    window.localStorage?.clear?.();
    document.title = 'Inicio PuraNatura';
    Object.defineProperty(document, 'referrer', {
      configurable: true,
      value: 'https://referrer.puranatura.test/',
    });
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)
    ) as typeof fetch;

    logEventToProvidersSpy = vi
      .spyOn(analyticsProviders, 'logEventToProviders')
      .mockImplementation(() => {});
    logEventToBackendSpy = vi
      .spyOn(analyticsProviders, 'logEventToBackend')
      .mockResolvedValue(undefined);
    getSessionIdSpy = vi
      .spyOn(analyticsProviders, 'getSessionId')
      .mockReturnValue('session-123');
    vi.spyOn(analyticsProviders, 'initGoogleAnalytics').mockImplementation(
      () => {}
    );
    vi.spyOn(analyticsProviders, 'initFacebookPixel').mockImplementation(
      () => {}
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('guarda el consentimiento en localStorage y actualiza el estado del hook', async () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    expect(result.current.consentGranted).toBe(false);

    act(() => {
      result.current.setConsent(true);
    });

    await waitFor(() => expect(result.current.consentGranted).toBe(true));
    await waitFor(() =>
      expect(window.localStorage.getItem('puranatura-consent-analytics')).toBe(
        'granted'
      )
    );

    act(() => {
      result.current.setConsent(false);
    });

    await waitFor(() => expect(result.current.consentGranted).toBe(false));
    await waitFor(() =>
      expect(window.localStorage.getItem('puranatura-consent-analytics')).toBe(
        'denied'
      )
    );
  });

  it('trackEvent delega a los proveedores y al backend luego de otorgar el consentimiento', async () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.setConsent(true);
    });

    await waitFor(() => expect(result.current.consentGranted).toBe(true));

    const event: Omit<AnalyticsEvent, 'timestamp'> = {
      category: 'cart',
      action: 'add_to_cart',
      label: 'Inicio Terapia',
    };

    act(() => {
      result.current.trackEvent(event);
    });

    expect(logEventToProvidersSpy).toHaveBeenCalledWith(
      expect.objectContaining(event)
    );
    expect(logEventToBackendSpy).toHaveBeenCalledWith(
      expect.objectContaining(event),
      'session-123'
    );
    expect(getSessionIdSpy).toHaveBeenCalled();
  });

  it('trackPageView se dispara con los datos de ruta y título cuando hay consentimiento', async () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.setConsent(true);
    });

    await waitFor(() => expect(result.current.consentGranted).toBe(true));

    const pageViewCall = logEventToProvidersSpy.mock.calls.find(
      ([event]: any) => (event as AnalyticsEvent).category === 'page_view'
    );

    expect(pageViewCall).toBeDefined();
    expect(pageViewCall?.[0]).toEqual(
      expect.objectContaining({
        category: 'page_view',
        label: '/inicio?page=1',
        metadata: expect.objectContaining({
          page_title: 'Inicio PuraNatura',
          page_location: '/inicio?page=1',
          page_referrer: 'https://referrer.puranatura.test/',
        }),
      })
    );
  });
});
