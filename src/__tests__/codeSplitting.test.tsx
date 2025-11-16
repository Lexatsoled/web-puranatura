import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SuspenseBoundary from '@/components/SuspenseBoundary';
import { preloadOnHover, preloadAfterDelay, preloadOnIdle } from '@/utils/preload';

describe('SuspenseBoundary', () => {
  it('renders fallback while loading', () => {
    const LazyComponent = React.lazy(() => new Promise(() => {}));

    render(
      <SuspenseBoundary fallback={<div>Loading...</div>}>
        <LazyComponent />
      </SuspenseBoundary>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('Preload functions', () => {
  it('preloadOnHover executes correctly', () => {
    const mockImport = vi.fn();
    preloadOnHover(mockImport)({ type: 'mouseover' } as MouseEvent);
    expect(mockImport).toHaveBeenCalled();
  });

  it('preloadAfterDelay executes correctly', () => {
    const mockImport = vi.fn();
    vi.useFakeTimers();
    preloadAfterDelay(mockImport, 1000);
    vi.runAllTimers();
    expect(mockImport).toHaveBeenCalled();
  });

  it('preloadOnIdle executes correctly', () => {
    const mockImport = vi.fn();
    preloadOnIdle(mockImport);
    expect(mockImport).toHaveBeenCalled();
  });
});