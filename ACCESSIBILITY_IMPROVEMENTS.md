# Accessibility Improvements Implementation

## Overview

Comprehensive accessibility enhancements for Pureza Naturalis V3, ensuring WCAG 2.1 AA compliance and improved user experience for all users, including those with disabilities.

## Current Accessibility Assessment

### Existing Issues

- **Keyboard Navigation**: Limited keyboard support in some components
- **Screen Reader Support**: Missing ARIA labels and semantic HTML
- **Color Contrast**: Some text may not meet contrast requirements
- **Focus Management**: Inconsistent focus indicators and management
- **Touch Targets**: Some interactive elements are too small for touch
- **Alt Text**: Missing or inadequate image descriptions

### Target Compliance

- **WCAG 2.1 AA**: Minimum accessibility standard
- **Section 508**: US government accessibility requirements
- **EN 301 549**: European accessibility standard

## Keyboard Navigation Enhancements

### Skip Links Implementation

```typescript
// SkipLink component for bypassing navigation
const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      Saltar al contenido principal
    </a>
  );
};
```

### Enhanced Focus Management

```typescript
// Focus trap utility for modals and dialogs
const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Handle escape key (close modal, etc.)
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus first element when trap activates
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [containerRef, isActive]);
};
```

### Keyboard Navigation for Complex Components

```typescript
// Enhanced carousel with keyboard support
const AccessibleCarousel: React.FC<CarouselProps> = ({ items, ...props }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setActiveIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setActiveIndex(prev => Math.min(items.length - 1, prev + 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
    }
  };

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-label="Carrusel de productos"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Carousel content */}
      <div aria-live="polite" aria-atomic="true">
        {items[activeIndex]}
      </div>

      {/* Navigation buttons */}
      <button
        aria-label="Producto anterior"
        disabled={activeIndex === 0}
        onClick={() => setActiveIndex(prev => prev - 1)}
      >
        Anterior
      </button>

      <button
        aria-label="Producto siguiente"
        disabled={activeIndex === items.length - 1}
        onClick={() => setActiveIndex(prev => prev + 1)}
      >
        Siguiente
      </button>

      {/* Indicators */}
      <div role="tablist" aria-label="Seleccionar producto">
        {items.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`product-${index}`}
            onClick={() => setActiveIndex(index)}
          >
            Producto {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Screen Reader Support

### ARIA Labels and Descriptions

```typescript
// Enhanced button with proper ARIA support
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  loading,
  disabled,
  ...props
}) => {
  const buttonId = useId();
  const loadingId = `${buttonId}-loading`;

  return (
    <>
      <button
        {...props}
        aria-label={ariaLabel}
        aria-describedby={loading ? loadingId : ariaDescribedBy}
        aria-disabled={disabled || loading}
        disabled={disabled || loading}
      >
        {children}
      </button>

      {loading && (
        <div id={loadingId} className="sr-only">
          Cargando, por favor espere
        </div>
      )}
    </>
  );
};
```

### Live Regions for Dynamic Content

```typescript
// Live region for announcements
const LiveRegion: React.FC<{ message: string; priority?: 'polite' | 'assertive' }> = ({
  message,
  priority = 'polite'
}) => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (message) {
      setAnnouncements(prev => [...prev, message]);

      // Clear old announcements after screen readers have processed them
      const timer = setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcements[announcements.length - 1]}
    </div>
  );
};
```

### Semantic HTML Structure

```typescript
// Product card with proper semantic structure
const AccessibleProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article
      className="product-card"
      itemScope
      itemType="https://schema.org/Product"
    >
      <header>
        <h3 itemProp="name">{product.name}</h3>
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span itemProp="price" content={product.price.toString()}>
            ${product.price}
          </span>
        </div>
      </header>

      <img
        itemProp="image"
        src={product.image}
        alt={product.name}
        loading="lazy"
      />

      <p itemProp="description">{product.description}</p>

      <footer>
        <button
          aria-label={`Agregar ${product.name} al carrito`}
          onClick={() => addToCart(product)}
        >
          Agregar al carrito
        </button>
      </footer>
    </article>
  );
};
```

## Color and Contrast Improvements

### High Contrast Color Palette

```css
/* High contrast color variables */
:root {
  --color-text-primary: #000000;
  --color-text-secondary: #333333;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f8f9fa;

  /* High contrast mode */
  @media (prefers-contrast: high) {
    --color-text-primary: #000000;
    --color-text-secondary: #000000;
    --color-background-primary: #ffffff;
    --color-background-secondary: #ffffff;
    --color-border: #000000;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### Focus Indicators

```css
/* Enhanced focus indicators */
.focus-visible:focus-visible {
  outline: 3px solid #22c55e;
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast focus */
@media (prefers-contrast: high) {
  .focus-visible:focus-visible {
    outline: 3px solid #000000;
    outline-offset: 2px;
  }
}

/* Windows high contrast mode */
@media screen and (-ms-high-contrast: active) {
  .focus-visible:focus-visible {
    outline: 2px dotted #ffffff;
  }
}
```

## Touch and Mobile Accessibility

### Touch Target Size Optimization

```css
/* Minimum touch target sizes */
button,
a,
input[type='button'],
input[type='submit'],
input[type='reset'],
[role='button'],
select,
textarea,
input {
  min-width: 44px;
  min-height: 44px;
}

/* Exception for inline elements */
.inline-button {
  min-width: auto;
  min-height: auto;
  padding: 8px 12px;
}

/* Touch feedback */
@media (hover: none) and (pointer: coarse) {
  button:active,
  a:active,
  [role='button']:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}
```

### Gesture Support

```typescript
// Accessible swipe gestures with screen reader announcements
const useAccessibleSwipe = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  announce: (message: string) => void
) => {
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

    if (isLeftSwipe) {
      onSwipeLeft();
      announce('Deslizó hacia la izquierda');
    }
    if (isRightSwipe) {
      onSwipeRight();
      announce('Deslizó hacia la derecha');
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
```

## Form Accessibility

### Enhanced Form Components

```typescript
interface AccessibleFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  error,
  required,
  helperText,
  children
}) => {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const describedBy = [
    error ? errorId : undefined,
    helperText ? helperId : undefined
  ].filter(Boolean).join(' ');

  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && (
          <span className="required-indicator" aria-label="requerido">
            *
          </span>
        )}
      </label>

      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        required
      })}

      {helperText && !error && (
        <div id={helperId} className="form-helper">
          {helperText}
        </div>
      )}

      {error && (
        <div id={errorId} className="form-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};
```

### Form Validation Announcements

```typescript
const useFormValidation = () => {
  const [announcer, setAnnouncer] = useState<string>('');

  const announceError = (fieldName: string, error: string) => {
    setAnnouncer(`${fieldName}: ${error}`);
  };

  const announceSuccess = (message: string) => {
    setAnnouncer(message);
  };

  return {
    announcer,
    announceError,
    announceSuccess,
    LiveRegion: () => (
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcer}
      </div>
    )
  };
};
```

## Image and Media Accessibility

### Alt Text Management

```typescript
interface AccessibleImageProps extends React.ImgHTMLAttributes<HTMLImage> {
  alt: string;
  caption?: string;
  decorative?: boolean;
  priority?: boolean;
}

const AccessibleImage: React.FC<AccessibleImageProps> = ({
  alt,
  caption,
  decorative = false,
  priority = false,
  className = '',
  ...props
}) => {
  // If decorative, hide from screen readers
  const imgAlt = decorative ? '' : alt;
  const ariaHidden = decorative;

  return (
    <figure className={className}>
      <img
        {...props}
        alt={imgAlt}
        aria-hidden={ariaHidden}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {caption && (
        <figcaption className="sr-only">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
```

### Video Accessibility

```typescript
interface AccessibleVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  captions?: string;
  transcript?: string;
  title: string;
}

const AccessibleVideo: React.FC<AccessibleVideoProps> = ({
  captions,
  transcript,
  title,
  children,
  ...props
}) => {
  return (
    <figure>
      <video
        {...props}
        title={title}
        aria-describedby={transcript ? 'video-transcript' : undefined}
      >
        {captions && (
          <track
            kind="captions"
            src={captions}
            srcLang="es"
            label="Español"
            default
          />
        )}
        {children}
      </video>

      {transcript && (
        <details id="video-transcript">
          <summary>Transcripción del video</summary>
          <div dangerouslySetInnerHTML={{ __html: transcript }} />
        </details>
      )}
    </figure>
  );
};
```

## Testing and Validation

### Accessibility Testing Utilities

```typescript
// Color contrast checker
const checkColorContrast = (
  foreground: string,
  background: string
): boolean => {
  // Implementation of WCAG contrast ratio calculation
  const getLuminance = (color: string): number => {
    // Convert hex to RGB, then to relative luminance
    // Implementation details...
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const contrast =
    (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return contrast >= 4.5; // WCAG AA normal text
};

// Keyboard navigation tester
const testKeyboardNavigation = (container: HTMLElement): boolean => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  // Check if all focusable elements are reachable via Tab
  // Implementation details...

  return true;
};

// Screen reader content tester
const testScreenReaderContent = (
  element: HTMLElement
): {
  hasAriaLabel: boolean;
  hasAltText: boolean;
  hasSemanticStructure: boolean;
} => {
  // Implementation details...
};
```

### Automated Testing Integration

```typescript
// Jest accessibility tests
describe('Accessibility Tests', () => {
  it('should have sufficient color contrast', () => {
    // Test color combinations
  });

  it('should support keyboard navigation', () => {
    // Test tab order and keyboard interactions
  });

  it('should have proper ARIA labels', () => {
    // Test screen reader support
  });

  it('should meet touch target requirements', () => {
    // Test minimum touch target sizes
  });
});
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Add skip links and basic keyboard navigation
- [ ] Implement proper semantic HTML structure
- [ ] Add ARIA labels to existing components
- [ ] Create accessibility utility functions

### Phase 2: Component Enhancement (Week 3-4)

- [ ] Update all form components with accessibility features
- [ ] Enhance modal and dialog accessibility
- [ ] Add focus management to complex components
- [ ] Implement live regions for dynamic content

### Phase 3: Advanced Features (Week 5-6)

- [ ] Add screen reader optimizations
- [ ] Implement high contrast mode support
- [ ] Create accessible media components
- [ ] Add gesture accessibility features

### Phase 4: Testing and Validation (Week 7-8)

- [ ] Comprehensive accessibility testing
- [ ] WCAG compliance audit
- [ ] Cross-screen reader testing
- [ ] User testing with assistive technologies

## Success Metrics

### Technical Metrics

- **WCAG Compliance Score**: Target 100% AA compliance
- **Keyboard Navigation Coverage**: 100% of interactive elements
- **Screen Reader Compatibility**: Support for NVDA, JAWS, VoiceOver
- **Color Contrast Ratio**: Minimum 4.5:1 for normal text

### User Experience Metrics

- **Accessibility User Satisfaction**: >4.5/5 rating
- **Task Completion Rate**: No significant difference for users with disabilities
- **Error Rate Reduction**: Decrease in user errors due to accessibility issues
- **Support Ticket Reduction**: Fewer accessibility-related support requests

### Business Impact

- **Legal Compliance**: Meet accessibility regulations
- **Market Reach**: Expand to users with disabilities (15-20% of population)
- **Brand Reputation**: Demonstrate commitment to inclusivity
- **SEO Benefits**: Improved search engine accessibility scoring
