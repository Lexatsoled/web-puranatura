/**
 * Monitorear long tasks (> 50ms)
 */
export function observeLongTasks() {
  // Deshabilitado temporalmente para evitar errores 404 en desarrollo
  return;
  
  /* eslint-disable no-unreachable */
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn('Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
        
        // Enviar al backend
        fetch('/api/analytics/long-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: entry.duration,
            startTime: entry.startTime,
          }),
        }).catch((error) => {
          // Silenciar errores de analytics para no afectar la experiencia del usuario
          console.debug('Analytics error:', error);
        });
      }
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
  /* eslint-enable no-unreachable */
}

/**
 * Monitorear layout shifts
 */
export function observeLayoutShifts() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const cls = entry as PerformanceEntry & { value?: number; sources?: unknown[] };
      if (cls.value && cls.value > 0.1) {
        console.warn('Layout shift:', cls.value, cls.sources);
      }
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });
}

/**
 * Medir tiempo de carga de recursos
 */
export function measureResourceTiming() {
  const resources = performance.getEntriesByType('resource');
  
  const slowResources = resources.filter(r => r.duration > 1000);
  
  if (slowResources.length > 0) {
    console.warn('Slow resources:', slowResources.map(r => ({
      name: r.name,
      duration: r.duration,
    })));
  }
}