import React from 'react';

type ImportFunction = () => Promise<{ default: React.ComponentType<unknown> }>;

export const lazyWithRetry = (importFunction: ImportFunction): React.LazyExoticComponent<React.ComponentType<unknown>> => {
  let retries = 3;
  const retry = (): Promise<{ default: React.ComponentType<unknown> }> => {
    return new Promise((resolve, reject) => {
      importFunction()
        .then(resolve)
        .catch((error: unknown) => {
          if (retries > 0) {
            retries -= 1;
            setTimeout(() => retry().then(resolve).catch(reject), 1000);
          } else {
            reject(error);
          }
        });
    });
  };
  return React.lazy(retry);
};
