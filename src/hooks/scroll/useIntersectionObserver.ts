import { useRef, useEffect, useState } from 'react';
import { useStableCallback } from '../usePerformance';

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
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting && onIntersect) {
        onIntersect(entry);
      }
    },
    [onIntersect]
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);

    return () => observer.disconnect();
  }, [callback, options.threshold, options.rootMargin, options.root]);

  return { ref: targetRef, isVisible };
}
