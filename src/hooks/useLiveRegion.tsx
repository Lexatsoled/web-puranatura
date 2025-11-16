import React from 'react';
import LiveRegion from '@/components/A11y/LiveRegion';

export function useLiveRegion() {
  const [message, setMessage] = React.useState('');
  const [priority, setPriority] = React.useState<'polite' | 'assertive'>(
    'polite'
  );

  const announce = React.useCallback(
    (text: string, urgent: boolean = false) => {
      setPriority(urgent ? 'assertive' : 'polite');
      setMessage(text);
      setTimeout(() => setMessage(''), 5000);
    },
    []
  );

  const LiveRegionComponent: React.FC = () => (
    <LiveRegion message={message} priority={priority} />
  );

  return { announce, LiveRegionComponent };
}

export default useLiveRegion;

