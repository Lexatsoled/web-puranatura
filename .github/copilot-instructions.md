# AI Coding Assistant Instructions for Pureza Naturalis V3

## 🏗️ Architecture Overview

**Pureza Naturalis V3** is a React 19 + TypeScript e-commerce platform for natural products and therapies. Key architectural patterns:

### Service Layer Pattern
- **Location**: `src/services/` - Business logic coordination
- **Example**: `ProductService` validates cart operations, coordinates with `ProductRepository`
- **Usage**: Always use services for business logic, never call repositories directly from components

### State Management (Zustand)
- **Location**: `src/store/` - Global state with persistence
- **Pattern**: Stores use `persist` middleware + `immer` for immutable updates
- **Example**: `cartStore` handles cart operations with automatic localStorage persistence

### Data Flow
```
Component → Service (validation/business logic) → Repository (data access) → Store (state updates)
```

### Key Directories
- `src/services/` - Business logic services (ProductService, AuthService, etc.)
- `src/repositories/` - Data access layer
- `src/store/` - Zustand global state stores
- `src/contexts/` - React contexts for cross-cutting concerns
- `src/hooks/` - Custom hooks for reusable logic
- `src/components/` - Reusable UI components
- `src/pages/` - Route-level page components
- `tools/` - Product auditing and maintenance scripts

## 🔧 Critical Developer Workflows

### Build & Development
```bash
npm run dev              # Development server
npm run build:prod       # Production build with type-checking
npm run validate         # Full validation (lint + types + format)
npm run optimize-images  # Image optimization before build
```

### Pre-commit Validation
- **Husky hooks** run `npm run validate:pr` automatically
- Includes: encoding checks, BOM stripping, linting, type-checking, tests
- **Skip with**: `SKIP_VALIDATE_PR=1 git push` (use sparingly)

### Product Auditing (Critical for Data Quality)
```bash
npm run audit:all        # Complete audit suite
npm run audit:text       # Encoding/mojibake detection
npm run audit:links      # PubMed/DOI link validation
npm run audit:components # Product component validation
```

### Testing Strategy
```bash
npm run test:ci          # Unit tests (CI)
npm run test:e2e         # End-to-end tests
npm run test:coverage    # Coverage report
```

## 📝 Project-Specific Conventions

### Documentation Standards
- **JSDoc comments in Spanish** for all public functions
- **Format**: Detailed purpose, logic, inputs/outputs, dependencies, side effects
- **Example**:
```typescript
/**
 * Calcula el precio con descuento si el producto tiene precio comparativo
 * Propósito: Proporcionar información de descuentos para mostrar en la UI
 * Lógica: Compara precio actual con precio comparativo
 * Entradas: product (Product) - El producto a evaluar
 * Salidas: Objeto con precios original/final, porcentaje y flag hasDiscount
 */
```

### Validation & Sanitization
- **Input sanitization** required for all user inputs (DOMPurify)
- **Product validation** via `ProductService.validateProductForCart()`
- **SQL injection prevention** through parameterized queries only

### Accessibility Requirements
- **WCAG 2.1 AA compliance** mandatory
- **Keyboard navigation** support in all components
- **Screen reader support** with proper ARIA labels
- **Focus management** for modals and dynamic content

### Error Handling
- **Error boundaries** wrap all route components
- **Graceful degradation** - never crash on data errors
- **User-friendly error messages** in Spanish

### Performance Patterns
- **Lazy loading** for all pages and heavy components
- **Image optimization** with responsive formats
- **Virtual scrolling** for product grids
- **Bundle analysis** with `vite-bundle-analyzer`

## 🔗 Integration Points

### External Services
- **Sentry** for error tracking (environment-based DSN)
- **Google Gemini AI** for product analysis (`VITE_GEMINI_API_KEY`)
- **Piping Rock API** for product data synchronization

### PWA Features
- **Service Worker** for offline functionality
- **Background sync** for failed requests
- **Push notifications** (optional)
- **App manifest** with proper metadata

### Build Optimizations
- **Image optimization** pipeline with Sharp
- **Critical CSS** inlining for above-the-fold content
- **Font subsetting** and self-hosting
- **Bundle splitting** by route

## 🚨 Critical Patterns to Follow

### State Management
```typescript
// ✅ Correct: Use service for business logic
const handleAddToCart = (product: Product) => {
  const validation = ProductService.validateProductForCart(product.id, quantity);
  if (validation.valid) {
    cartStore.getState().addToCart(product, quantity);
  }
};
```

### Error Boundaries
```tsx
// ✅ Always wrap routes with error boundaries
<Route
  path="/product/:id"
  element={
    <ErrorBoundary componentName="ProductPage">
      <ProductPage />
    </ErrorBoundary>
  }
/>
```

### Product Data Handling
- **Never modify product data directly** - use audit scripts
- **Validate all product operations** through ProductService
- **Check encoding issues** with `npm run audit:text`
- **Verify scientific references** with `npm run audit:links`

### Component Patterns
- **Accessibility-first**: Include ARIA labels, keyboard support
- **Performance-conscious**: Use lazy loading, memoization
- **Error-resilient**: Graceful fallbacks for missing data
- **Type-safe**: Strict TypeScript with proper interfaces

## 🧪 Testing Patterns

### Unit Tests
- **Vitest** for component and utility testing
- **Testing Library** for user-centric assertions
- **Mock Service Worker** for API mocking
- **95%+ coverage** target

### E2E Tests
- **Playwright** for critical user journeys
- **Accessibility testing** integrated
- **Performance assertions** included

## 📋 Quality Gates

### Pre-deployment Checks
- [ ] `npm run validate:pr` passes
- [ ] `npm run audit:all` clean
- [ ] `npm run test:ci` passes
- [ ] Lighthouse score >95
- [ ] Bundle size within limits
- [ ] Accessibility audit passes

### Code Review Checklist
- [ ] JSDoc comments in Spanish
- [ ] Error boundaries implemented
- [ ] Accessibility compliance
- [ ] Input validation/sanitization
- [ ] Performance considerations
- [ ] Tests added/updated

Remember: This codebase prioritizes **data quality**, **accessibility**, and **performance**. Always validate changes against the audit suite and ensure WCAG compliance.</content>
<parameter name="filePath">c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\.github\copilot-instructions.md