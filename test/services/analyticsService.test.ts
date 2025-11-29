import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let AnalyticsService: any;
let providers: any;

describe('AnalyticsService', () => {
  beforeEach(async () => {
    vi.resetModules();

    // ensure test env mirrors other tests
    process.env.VITE_ENABLE_ANALYTICS = 'true';
    process.env.VITE_GA_ID = 'G-TEST';
    process.env.VITE_FB_PIXEL_ID = 'FB-TEST';
    const testEnv = (import.meta as any).env || ({} as Record<string, string>);
    testEnv.VITE_ENABLE_ANALYTICS = 'true';
    testEnv.VITE_GA_ID = 'G-TEST';
    testEnv.VITE_FB_PIXEL_ID = 'FB-TEST';

    // import providers and stub
    providers = await import('../../src/services/analyticsProviders');
    vi.spyOn(providers, 'initGoogleAnalytics').mockImplementation(() => {});
    vi.spyOn(providers, 'initFacebookPixel').mockImplementation(() => {});
    vi.spyOn(providers, 'logEventToProviders').mockImplementation(() => {});
    vi.spyOn(providers, 'logEventToBackend').mockImplementation(() =>
      Promise.resolve(undefined)
    );
    vi.spyOn(providers, 'getSessionId').mockReturnValue('session-1');

    // import the service after env + providers are ready
    AnalyticsService = (await import('../../src/services/analyticsService'))
      .default;
    // reset singleton
    AnalyticsService.__resetInstanceForTests?.();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    AnalyticsService.__resetInstanceForTests?.();
  });

  it('initializes when consent is granted and sends events', () => {
    const svc = AnalyticsService.getInstance();

    expect(svc.isEnabled()).toBe(true);

    svc.setConsent(true);

    expect(providers.initGoogleAnalytics).toHaveBeenCalled();
    expect(providers.initFacebookPixel).toHaveBeenCalled();

    svc.trackEvent({ category: 'ui', action: 'click', label: 'btn' });

    expect(providers.logEventToProviders).toHaveBeenCalled();
    expect(providers.logEventToBackend).toHaveBeenCalled();
  });

  it('trackPageView maps pageview correctly', () => {
    const svc = AnalyticsService.getInstance();
    svc.setConsent(true);

    svc.trackPageView({ path: '/home', title: 'Home', referrer: '' });

    expect(providers.logEventToProviders).toHaveBeenCalledTimes(1);
    expect(providers.logEventToBackend).toHaveBeenCalledTimes(1);

    const calledWith = providers.logEventToProviders.mock.calls[0][0];
    expect(calledWith.category).toBe('page_view');
    expect(calledWith.action).toBe('view');
    expect(calledWith.label).toBe('/home');
  });
});
// (duplicate content removed - single suite now defines the tests)
