import React, { lazy } from 'react';

/**
 * Lazy loaded heavy components with retry logic
 * Uses React.lazy() with dynamic imports
 */

// Wrapper with retry logic for failed imports
function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }
            setTimeout(() => {
              console.log(`Retrying import... (${retriesLeft} attempts left)`);
              attemptImport(retriesLeft - 1);
            }, 1000);
          });
      };
      attemptImport(3);
    });
  });
}

// Lazy loaded components (not critical for initial load)
export const HeavyChart = lazyWithRetry(() => import('./HeavyChart') as Promise<{ default: React.ComponentType<unknown> }>);
export const VideoPlayer = lazyWithRetry(() => import('./VideoPlayer') as Promise<{ default: React.ComponentType<unknown> }>);
export const RichTextEditor = lazyWithRetry(() => import('./RichTextEditor') as Promise<{ default: React.ComponentType<unknown> }>);
export const ProductGallery = lazyWithRetry(() => import('./ProductGallery') as Promise<{ default: React.ComponentType<unknown> }>);
