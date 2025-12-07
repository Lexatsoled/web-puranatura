import AnalyticsService from '../../services/analyticsService';
import {
  readConsentFromStorage,
  writeConsentToStorage,
} from '../analytics/useConsentStorage';

const STORAGE_KEY = 'puranatura-consent-analytics';

type AnalyticsInstance = ReturnType<typeof AnalyticsService.getInstance>;

export const isEnvironmentValid = (
  analyticsInstance: AnalyticsInstance
): boolean => {
  return typeof window !== 'undefined' && analyticsInstance.isEnabled();
};

export const getInitialConsent = (analyticsInstance: AnalyticsInstance) => {
  return isEnvironmentValid(analyticsInstance)
    ? readConsentFromStorage(STORAGE_KEY)
    : false;
};

export const syncConsent = (
  analyticsInstance: AnalyticsInstance,
  consent: boolean
) => {
  if (!analyticsInstance.isEnabled()) return;
  analyticsInstance.setConsent(consent);
  writeConsentToStorage(STORAGE_KEY, consent);
};
