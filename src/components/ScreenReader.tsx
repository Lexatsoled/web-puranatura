/**
 * Screen Reader Support Component for WCAG 2.1 AA Compliance
 * Provides live regions and announcements for dynamic content updates
 */

import React from 'react';

interface ScreenReaderProps {
  children: React.ReactNode;
  announce?: string;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  live?: boolean;
}

export const ScreenReader: React.FC<ScreenReaderProps> = ({
  children,
  announce,
  priority = 'polite',
  atomic = false,
  live = true,
}) => {
  const liveRegionProps = live
    ? {
        'aria-live': priority,
        'aria-atomic': atomic,
      }
    : {};

  return (
    <div
      className="sr-only"
      {...liveRegionProps}
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {announce || children}
    </div>
  );
};

// Live region for dynamic content updates
export const LiveRegion: React.FC<{
  message: string;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}> = ({ message, priority = 'polite', atomic = false }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className="sr-only"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {message}
    </div>
  );
};

// Helpers movidos a hooks/utils dedicados
/* removed internal hook */

/* removed local focus utilities */

export default ScreenReader;
