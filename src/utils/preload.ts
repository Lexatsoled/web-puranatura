export const preloadOnHover = (importFunction: () => void) => {
  return (event: MouseEvent | FocusEvent) => {
    if (event.type === 'mouseover' || event.type === 'focus') {
      importFunction();
    }
  };
};

export const preloadAfterDelay = (importFunction: () => void, delay = 3000) => {
  setTimeout(() => {
    importFunction();
  }, delay);
};

export const preloadOnIdle = (importFunction: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      importFunction();
    });
  } else {
    importFunction();
  }
};