import { useEffect, useRef, MutableRefObject } from 'react';

export const useScreenReaderAnnouncement = () => {
  const announceRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => {
    if (!announceRef.current) {
      announceRef.current = document.createElement('div');
      announceRef.current.setAttribute('aria-live', 'polite');
      announceRef.current.setAttribute('aria-atomic', 'true');
      announceRef.current.className = 'sr-only';
      announceRef.current.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announceRef.current);
    }

    return () => {
      if (announceRef.current && announceRef.current.parentNode) {
        announceRef.current.parentNode.removeChild(announceRef.current);
      }
    };
  }, []);

  const announce = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      setTimeout(() => {
        if (announceRef.current) announceRef.current.textContent = '';
      }, 1000);
    }
  };

  return { announce };
};

export default useScreenReaderAnnouncement;

