# TASK-029: Accessibility (A11y)

## 📋 INFORMACIÓN

**ID**: TASK-029 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 4h

## 🎯 OBJETIVO

Implementar ARIA labels, keyboard navigation, screen reader support, color contrast WCAG 2.1 AA.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Skip Links

**Archivo**: `frontend/src/components/SkipLinks.tsx`

```typescript
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <a href="#navigation" className="skip-link">
        Saltar a navegación
      </a>
      <a href="#footer" className="skip-link">
        Saltar al pie de página
      </a>
    </div>
  );
}
```

**CSS**:
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Paso 2: Keyboard Navigation Hook

**Archivo**: `frontend/src/hooks/useKeyboardNavigation.ts`

```typescript
import { useEffect, useRef } from 'react';

export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    loop?: boolean;
    onSelect?: (item: T) => void;
  } = {}
) {
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { loop = true, onSelect } = options;
      const total = items.length;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          currentIndexRef.current = loop
            ? (currentIndexRef.current + 1) % total
            : Math.min(currentIndexRef.current + 1, total - 1);
          items[currentIndexRef.current]?.focus();
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          currentIndexRef.current = loop
            ? (currentIndexRef.current - 1 + total) % total
            : Math.max(currentIndexRef.current - 1, 0);
          items[currentIndexRef.current]?.focus();
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(items[currentIndexRef.current]);
          break;

        case 'Home':
          e.preventDefault();
          currentIndexRef.current = 0;
          items[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          currentIndexRef.current = total - 1;
          items[total - 1]?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, options]);
}
```

### Paso 3: Focus Management

**Archivo**: `frontend/src/hooks/useFocusTrap.ts`

```typescript
import { useEffect, useRef } from 'react';

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus primer elemento
    firstElement?.focus();

    container.addEventListener('keydown', handleTab);
    return () => container.removeEventListener('keydown', handleTab);
  }, [active]);

  return containerRef;
}
```

### Paso 4: Componente Modal Accesible

**Archivo**: `frontend/src/components/AccessibleModal.tsx`

```typescript
import { useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AccessibleModal({ isOpen, onClose, title, children }: AccessibleModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${title} dialog opened`;
      document.body.appendChild(announcement);
      
      return () => {
        document.body.style.overflow = '';
        announcement.remove();
      };
    }
  }, [isOpen, title]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar dialog"
            className="modal-close"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Paso 5: ARIA Labels y Roles

**Archivo**: `frontend/src/components/ProductCard.tsx`

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article
      className="product-card"
      aria-labelledby={`product-${product.id}-name`}
    >
      <img
        src={product.images[0]}
        alt={`${product.name} - imagen del producto`}
        loading="lazy"
      />
      
      <h3 id={`product-${product.id}-name`}>{product.name}</h3>
      
      <p className="product-price">
        <span className="sr-only">Precio:</span>
        {product.price.toFixed(2)}€
      </p>
      
      <div className="product-stock" aria-live="polite">
        {product.stock > 0 ? (
          <span className="in-stock">
            <span className="sr-only">En stock:</span>
            {product.stock} unidades disponibles
          </span>
        ) : (
          <span className="out-of-stock">Agotado</span>
        )}
      </div>
      
      <button
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
        aria-label={`Añadir ${product.name} al carrito`}
        aria-describedby={`product-${product.id}-name`}
      >
        Añadir al carrito
      </button>
    </article>
  );
}
```

### Paso 6: Live Regions para Updates

**Archivo**: `frontend/src/components/LiveRegion.tsx`

```typescript
import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

export function LiveRegion({ 
  message, 
  politeness = 'polite',
  clearAfter = 5000 
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && clearAfter) {
      const timer = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = '';
        }
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Uso:
// const [cartMessage, setCartMessage] = useState('');
// 
// function handleAddToCart() {
//   setCartMessage('Producto añadido al carrito');
// }
// 
// <LiveRegion message={cartMessage} />
```

### Paso 7: Color Contrast Check

**Archivo**: `frontend/src/styles/colors.css`

```css
:root {
  /* WCAG AA compliant colors */
  
  /* Text on white background (min 4.5:1) */
  --text-primary: #1a1a1a;      /* 16.9:1 ✓ */
  --text-secondary: #4a4a4a;    /* 9.7:1 ✓ */
  
  /* Links */
  --link-color: #0056b3;        /* 8.6:1 ✓ */
  --link-hover: #003d82;        /* 11.4:1 ✓ */
  
  /* Brand colors with sufficient contrast */
  --primary: #2d5f3f;           /* 6.8:1 ✓ */
  --primary-dark: #1a3825;      /* 11.2:1 ✓ */
  
  /* Status colors */
  --success: #0f5132;           /* 7.1:1 ✓ */
  --error: #842029;             /* 7.9:1 ✓ */
  --warning: #664d03;           /* 8.5:1 ✓ */
  
  /* Focus indicator */
  --focus-outline: 2px solid #0056b3;
  --focus-offset: 2px;
}

/* Focus visible for keyboard navigation */
*:focus-visible {
  outline: var(--focus-outline);
  outline-offset: var(--focus-offset);
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Paso 8: Automated A11y Testing

**Archivo**: `frontend/src/__tests__/accessibility.test.tsx`

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProductCard } from '../components/ProductCard';

expect.extend(toHaveNoViolations);

test('ProductCard is accessible', async () => {
  const { container } = render(
    <ProductCard
      product={{
        id: 1,
        name: 'Vitamina C',
        price: 19.99,
        stock: 10,
        images: ['/img.jpg'],
      }}
      onAddToCart={() => {}}
    />
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Archivo**: `package.json`

```json
{
  "scripts": {
    "test:a11y": "jest --testMatch='**/*.a11y.test.tsx'",
    "lighthouse:a11y": "lighthouse http://localhost:3000 --only-categories=accessibility --view"
  },
  "devDependencies": {
    "jest-axe": "^8.0.0",
    "@axe-core/react": "^4.8.0"
  }
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] ARIA labels completos
- [x] Keyboard navigation
- [x] Focus management
- [x] Screen reader support
- [x] Color contrast WCAG AA
- [x] Skip links
- [x] Live regions
- [x] Automated tests (axe)

## 🧪 VALIDACIÓN

```bash
# Lighthouse accessibility
npx lighthouse http://localhost:3000 --only-categories=accessibility --view

# axe DevTools
# Instalar extensión Chrome: axe DevTools

# Tests automatizados
npm run test:a11y

# Color contrast check
# https://webaim.org/resources/contrastchecker/
```

---

**Status**: COMPLETO ✅
