# TASK-030: Internacionalización (i18n)

## 📋 INFORMACIÓN

**ID**: TASK-030 | **Fase**: 3 | **Prioridad**: MEDIA | **Estimación**: 3h

## 🎯 OBJETIVO

Implementar soporte multi-idioma (ES/EN) con react-i18next, formateo de fechas y monedas.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Instalar Dependencias

```bash
npm install --save i18next react-i18next i18next-browser-languagedetector
npm install --save date-fns
```

### Paso 2: Configuración i18n

**Archivo**: `frontend/src/i18n/config.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './locales/es.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### Paso 3: Archivos de Traducción

**Archivo**: `frontend/src/i18n/locales/es.json`

```json
{
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito",
    "cancel": "Cancelar",
    "save": "Guardar",
    "delete": "Eliminar",
    "edit": "Editar",
    "search": "Buscar"
  },
  "nav": {
    "home": "Inicio",
    "products": "Productos",
    "about": "Acerca de",
    "contact": "Contacto",
    "cart": "Carrito",
    "profile": "Perfil",
    "login": "Iniciar sesión",
    "logout": "Cerrar sesión"
  },
  "products": {
    "title": "Productos",
    "category": "Categoría",
    "price": "Precio",
    "stock": "Stock",
    "addToCart": "Añadir al carrito",
    "outOfStock": "Agotado",
    "inStock": "{{count}} disponibles",
    "filters": {
      "all": "Todos",
      "vitaminas": "Vitaminas",
      "minerales": "Minerales",
      "suplementos": "Suplementos",
      "hierbas": "Hierbas",
      "aceites": "Aceites"
    },
    "sort": {
      "default": "Por defecto",
      "priceLowHigh": "Precio: menor a mayor",
      "priceHighLow": "Precio: mayor a menor",
      "nameAZ": "Nombre: A-Z"
    }
  },
  "cart": {
    "title": "Carrito de compra",
    "empty": "Tu carrito está vacío",
    "total": "Total",
    "subtotal": "Subtotal",
    "shipping": "Envío",
    "freeShipping": "Envío gratis",
    "checkout": "Proceder al pago",
    "itemAdded": "Producto añadido al carrito",
    "itemRemoved": "Producto eliminado del carrito",
    "quantity": "Cantidad"
  },
  "auth": {
    "login": "Iniciar sesión",
    "register": "Registrarse",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "confirmPassword": "Confirmar contraseña",
    "name": "Nombre",
    "loginSuccess": "Sesión iniciada correctamente",
    "registerSuccess": "Cuenta creada correctamente",
    "loginError": "Error al iniciar sesión",
    "emailRequired": "El correo es obligatorio",
    "passwordRequired": "La contraseña es obligatoria"
  },
  "errors": {
    "notFound": "Página no encontrada",
    "serverError": "Error del servidor",
    "networkError": "Error de conexión",
    "unauthorized": "No autorizado",
    "forbidden": "Acceso denegado"
  }
}
```

**Archivo**: `frontend/src/i18n/locales/en.json`

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search"
  },
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "contact": "Contact",
    "cart": "Cart",
    "profile": "Profile",
    "login": "Log in",
    "logout": "Log out"
  },
  "products": {
    "title": "Products",
    "category": "Category",
    "price": "Price",
    "stock": "Stock",
    "addToCart": "Add to cart",
    "outOfStock": "Out of stock",
    "inStock": "{{count}} available",
    "filters": {
      "all": "All",
      "vitaminas": "Vitamins",
      "minerales": "Minerals",
      "suplementos": "Supplements",
      "hierbas": "Herbs",
      "aceites": "Oils"
    },
    "sort": {
      "default": "Default",
      "priceLowHigh": "Price: Low to High",
      "priceHighLow": "Price: High to Low",
      "nameAZ": "Name: A-Z"
    }
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "total": "Total",
    "subtotal": "Subtotal",
    "shipping": "Shipping",
    "freeShipping": "Free shipping",
    "checkout": "Checkout",
    "itemAdded": "Item added to cart",
    "itemRemoved": "Item removed from cart",
    "quantity": "Quantity"
  },
  "auth": {
    "login": "Log in",
    "register": "Register",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "name": "Name",
    "loginSuccess": "Logged in successfully",
    "registerSuccess": "Account created successfully",
    "loginError": "Login failed",
    "emailRequired": "Email is required",
    "passwordRequired": "Password is required"
  },
  "errors": {
    "notFound": "Page not found",
    "serverError": "Server error",
    "networkError": "Connection error",
    "unauthorized": "Unauthorized",
    "forbidden": "Access denied"
  }
}
```

### Paso 4: Hook para Formateo

**Archivo**: `frontend/src/hooks/useFormatting.ts`

```typescript
import { useTranslation } from 'react-i18next';
import { format as formatDateFns } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const locales = { es, en: enUS };

export function useFormatting() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language as 'es' | 'en';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currentLocale === 'es' ? 'EUR' : 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string, format: string = 'PPP'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDateFns(dateObj, format, {
      locale: locales[currentLocale],
    });
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(currentLocale).format(num);
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(currentLocale, { numeric: 'auto' });

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return rtf.format(-diffMins, 'minute');
      }
      return rtf.format(-diffHours, 'hour');
    }
    
    if (diffDays < 7) {
      return rtf.format(-diffDays, 'day');
    }
    
    return formatDate(date);
  };

  return {
    formatCurrency,
    formatDate,
    formatNumber,
    formatRelativeTime,
  };
}
```

### Paso 5: Language Switcher

**Archivo**: `frontend/src/components/LanguageSwitcher.tsx`

```typescript
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="sr-only">
        Seleccionar idioma
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        aria-label="Cambiar idioma"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Paso 6: Usar Traducciones

**Archivo**: `frontend/src/components/ProductCard.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../hooks/useFormatting';

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatting();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">{formatCurrency(product.price)}</p>
      
      <p className="stock">
        {product.stock > 0 
          ? t('products.inStock', { count: product.stock })
          : t('products.outOfStock')
        }
      </p>
      
      <button disabled={product.stock === 0}>
        {t('products.addToCart')}
      </button>
    </div>
  );
}
```

### Paso 7: Integrar en App

**Archivo**: `frontend/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './i18n/config';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Paso 8: Backend i18n para Emails

**Archivo**: `backend/src/i18n/index.ts`

```typescript
import i18next from 'i18next';

await i18next.init({
  lng: 'es',
  fallbackLng: 'es',
  resources: {
    es: {
      translation: {
        email: {
          orderConfirmation: {
            subject: 'Confirmación de pedido #{{orderId}}',
            greeting: 'Hola {{name}},',
            body: 'Gracias por tu pedido. Total: {{total}}',
          },
        },
      },
    },
    en: {
      translation: {
        email: {
          orderConfirmation: {
            subject: 'Order confirmation #{{orderId}}',
            greeting: 'Hello {{name}},',
            body: 'Thank you for your order. Total: {{total}}',
          },
        },
      },
    },
  },
});

export function t(key: string, options?: any) {
  return i18next.t(key, options);
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Soporte ES/EN
- [x] Language switcher
- [x] Formateo de moneda
- [x] Formateo de fechas
- [x] Detección automática idioma
- [x] Persistencia en localStorage
- [x] Backend i18n para emails

## 🧪 VALIDACIÓN

```bash
# Verificar traducciones
npm run build

# Test language switching
# Cambiar idioma en UI y verificar que todo se traduce

# Verificar formateo
console.log(formatCurrency(19.99)) // ES: 19,99 € | EN: $19.99
console.log(formatDate(new Date())) // ES: 7 nov 2025 | EN: Nov 7, 2025
```

---

**Status**: COMPLETO ✅
