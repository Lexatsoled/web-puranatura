import { useRef, useEffect, useState, useCallback } from 'react';
import { useStableCallback } from './useStable';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
  onIntersect?: (entry: IntersectionObserverEntry) => void
) {
  const targetRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callback = useStableCallback(
    ((entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting && onIntersect) {
        onIntersect(entry);
      }
    }) as (...args: unknown[]) => unknown,
    [onIntersect]
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);

    return () => observer.disconnect();
  }, [callback, options]);

  return { ref: targetRef, isVisible };
}

interface UseScrollPositionOptions {
  throttleMs?: number;
}

export function useScrollPosition(
  effect: (position: { x: number; y: number }) => void,
  deps: React.DependencyList = [],
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
  }, [callback, throttleMs, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setDirection(currentScroll > lastScroll.current ? 'down' : 'up');
      lastScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}
