export const readConsentFromStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key) === 'granted';
  } catch {
    return false;
  }
};

export const writeConsentToStorage = (key: string, granted: boolean) => {
  try {
    window.localStorage.setItem(key, granted ? 'granted' : 'denied');
  } catch {
    // ignore storage errors
  }
};
