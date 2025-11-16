# Mobile Experience Enhancements

## Touch Interactions Optimization

### Touch Target Guidelines

- **Minimum Size**: All interactive elements must be at least 44px × 44px (44px is the minimum recommended touch target size by Apple's Human Interface Guidelines)
- **Spacing**: Touch targets should have adequate spacing between them to prevent accidental touches
- **Visual Feedback**: Provide immediate visual feedback on touch (highlight, scale, or color change)

### Touch Gesture Support

```typescript
interface TouchGestureConfig {
  swipeThreshold: number;
  longPressDelay: number;
  doubleTapDelay: number;
  pinchZoomEnabled: boolean;
}

const defaultTouchConfig: TouchGestureConfig = {
  swipeThreshold: 50, // pixels
  longPressDelay: 500, // milliseconds
  doubleTapDelay: 300, // milliseconds
  pinchZoomEnabled: true,
};
```

### Swipe Gestures Implementation

```typescript
// Product gallery swipe
const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
```

### Long Press Menus

```typescript
const useLongPress = (callback: () => void, delay: number = 500) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<Element>();

  const start = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      target.current = event.target as Element;
      timeout.current = setTimeout(() => {
        callback();
        setLongPressTriggered(true);
      }, delay);
    },
    [callback, delay]
  );

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    setLongPressTriggered(false);
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    longPressTriggered,
  };
};
```

## Responsive Design Improvements

### Fluid Typography Scale

```css
/* Fluid typography that scales with viewport */
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.3vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.4vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.2rem + 0.5vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.4rem + 0.6vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.8rem + 0.7vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 2.1rem + 0.8vw, 3rem);
}

/* Container queries for component-based responsive design */
.product-card {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .product-card .product-title {
    font-size: var(--text-lg);
  }
}

@container (min-width: 400px) {
  .product-card .product-title {
    font-size: var(--text-xl);
  }
}
```

### Mobile-First Layout Patterns

```css
/* Mobile-first grid system */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Touch-Friendly Navigation

```typescript
// Bottom navigation for mobile
const MobileNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'store', label: 'Tienda', icon: 'store' },
    { id: 'cart', label: 'Carrito', icon: 'cart' },
    { id: 'profile', label: 'Perfil', icon: 'profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
              activeTab === item.id ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            <Icon name={item.icon} size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
```

## Pull-to-Refresh Functionality

### Implementation

```typescript
const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (refreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    // Only allow pull down from top
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance * 0.5, 80)); // Dampen and limit
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !refreshing) {
      // Threshold for refresh
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  return {
    containerRef,
    pullDistance,
    refreshing,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
```

## Performance Optimizations for Mobile

### Critical CSS Loading

```html
<!-- Load critical CSS first -->
<link
  rel="preload"
  href="/css/critical-mobile.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="/css/critical-mobile.css" /></noscript>

<!-- Load non-critical CSS asynchronously -->
<link
  rel="preload"
  href="/css/non-critical.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

### Image Optimization Pipeline

```typescript
// Responsive image component with mobile optimization
interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  priority = false,
  className
}) => {
  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths.map(width => `${baseSrc}?w=${width} ${width}w`).join(', ');
  };

  return (
    <img
      src={`${src}?w=640`}
      srcSet={generateSrcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : loading}
      decoding="async"
      className={className}
    />
  );
};
```

### Virtual Scrolling for Product Lists

```typescript
interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

const VirtualizedList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualizedListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## Mobile-Specific Components

### Bottom Sheet Modal

```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 1]
}) => {
  const [currentSnap, setCurrentSnap] = useState(0);

  // Touch gesture handling for snap points
  // Implementation details...

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: `${(1 - snapPoints[currentSnap]) * 100}%` }}
          exit={{ y: '100%' }}
          className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50"
          style={{ maxHeight: '90vh' }}
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />

          {/* Content */}
          <div className="px-6 pb-6">
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### Mobile Search Interface

```typescript
const MobileSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      {/* Collapsed state */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-12 bg-gray-100 rounded-lg flex items-center px-4"
        >
          <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
          <span className="text-gray-500">Buscar productos...</span>
        </button>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-10"
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="flex items-center px-4 h-12">
              <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="flex-1 outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-3 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Search suggestions */}
            {query && (
              <div className="border-t border-gray-100 max-h-60 overflow-y-auto">
                {/* Search results */}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
```

## Accessibility Enhancements for Mobile

### Touch Target Accessibility

```css
/* Ensure all touch targets meet accessibility guidelines */
button,
a,
input[type='button'],
input[type='submit'],
input[type='reset'] {
  min-width: 44px;
  min-height: 44px;
}

/* Focus indicators for keyboard navigation */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
```

### Screen Reader Support

```typescript
// Announce dynamic content changes
const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  announcement.textContent = message;

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
```

## Testing Strategy

### Mobile Device Testing

- **Device Coverage**: Test on iOS Safari, Chrome Mobile, Samsung Internet
- **Screen Sizes**: 320px to 428px width (mobile), 768px to 1024px (tablet)
- **Touch Gestures**: Swipe, pinch, long press, double tap
- **Network Conditions**: 3G, 4G, offline simulation

### Performance Benchmarks

- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <3 seconds
- **Total Blocking Time**: <200ms
- **Cumulative Layout Shift**: <0.1

### User Experience Metrics

- **Touch target success rate**: >95%
- **Gesture recognition accuracy**: >98%
- **Form completion rate**: >80%
- **Page load satisfaction**: >4.5/5
