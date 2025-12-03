import { useRef, useEffect, useCallback } from 'react';

interface UseScrollPositionOptions {
  throttleMs?: number;
}

export function useScrollPosition(
  effect: (position: { x: number; y: number }) => void,
  deps: any[] = [],
  options: UseScrollPositionOptions = {}
) {
  const { throttleMs = 16 } = options;
  const frame = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  const callback = useCallback(() => {
    const currentPos = {
      x: window.pageXOffset,
      y: window.pageYOffset,
    };

    if (
      currentPos.x !== lastPos.current.x ||
      currentPos.y !== lastPos.current.y
    ) {
      effect(currentPos);
      lastPos.current = currentPos;
    }

    frame.current = 0;
  }, [effect]);

  useEffect(() => {
    const handleScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(callback);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [callback, throttleMs, ...deps]);
}
