# 🚀 Guía de Despliegue y Producción

## 📋 Tabla de Contenidos
- [Preparación para Producción](#preparación-para-producción)
- [Build y Optimización](#build-y-optimización)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [Configuración de Dominio](#configuración-de-dominio)
- [SSL y Seguridad](#ssl-y-seguridad)
- [Monitoreo y Analytics](#monitoreo-y-analytics)
- [CI/CD Automatizado](#cicd-automatizado)

---

## 🔧 Preparación para Producción

### Variables de Entorno

Crear archivo `.env.production`:

```bash
# API Configuration
VITE_API_URL=https://api.purezanaturalis.com
VITE_APP_ENV=production

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# SEO
VITE_SITE_URL=https://purezanaturalis.com
VITE_SITE_NAME=Pureza Naturalis

# Performance
VITE_CDN_URL=https://cdn.purezanaturalis.com
```

### Configuración de Seguridad

```typescript
// vite.config.production.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion']
        }
      }
    }
  }
});
```

---

## 📦 Build y Optimización

### Comando de Build

```bash
# Build completo con optimizaciones
npm run build:prod

# Verificar el build
npm run preview

# Análisis del bundle
npx vite-bundle-analyzer dist
```

### Optimizaciones Aplicadas

**📊 Bundle Splitting:**
- ✅ Vendor chunk: 183KB (React, librerías)
- ✅ Data chunk: 354KB (productos, contenido)
- ✅ UI chunk: 116KB (componentes UI)
- ✅ Pages chunk: 124KB (páginas)
- ✅ Components: 52KB (componentes base)

**🚀 Performance:**
- ✅ Code splitting automático
- ✅ Tree shaking activado
- ✅ Compresión Gzip/Brotli
- ✅ Lazy loading de imágenes

---

## ☁️ Despliegue en Vercel

### 1. Instalación CLI

```bash
npm i -g vercel
```

### 2. Configuración del Proyecto

Crear `vercel.json`:

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_APP_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_API_URL": "@api-url",
      "VITE_GOOGLE_ANALYTICS_ID": "@ga-id"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/public/sitemap.xml"
    }
  ]
}
```

### 3. Deploy

```bash
# Primer deploy
vercel

# Deploy a producción
vercel --prod

# Deploy con variables de entorno
vercel --prod --env VITE_API_URL=https://api.purezanaturalis.com
```

### 4. Configuración de Dominio

```bash
# Agregar dominio personalizado
vercel domains add purezanaturalis.com
vercel domains add www.purezanaturalis.com

# Configurar alias
vercel alias https://proyecto-xyz.vercel.app purezanaturalis.com
```

---

## 🌐 Despliegue en Netlify

### 1. Configuración Build

Crear `netlify.toml`:

```toml
[build]
  base = "."
  command = "npm run build:prod"
  publish = "dist"

[build.environment]
  VITE_APP_ENV = "production"
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/home"
  to = "/"
  status = 301

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

### 2. Deploy via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login y configuración
netlify login
netlify init

# Deploy de prueba
netlify deploy

# Deploy a producción
netlify deploy --prod
```

### 3. Deploy via Git

1. Conectar repositorio en Netlify Dashboard
2. Configurar build settings:
   - **Build command:** `npm run build:prod`
   - **Publish directory:** `dist`
   - **Node version:** `20`

---

## 🔗 Configuración de Dominio

### DNS Configuration

```bash
# Tipo A Records
@ → 76.76.19.61 (Vercel)
www → 76.76.19.61

# Tipo CNAME Records (Netlify)
www → proyecto-xyz.netlify.app
```

### SSL Certificate

**Vercel:**
- ✅ SSL automático via Let's Encrypt
- ✅ Renovación automática
- ✅ HTTP/2 y HTTP/3 habilitado

**Netlify:**
- ✅ SSL automático incluido
- ✅ HTTPS redirect automático
- ✅ Custom certificates supportados

---

## 🔒 SSL y Seguridad

### Security Headers

```typescript
// vercel.json security headers
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.purezanaturalis.com"
        }
      ]
    }
  ]
}
```

### Environment Variables Security

```bash
# Vercel Environment Variables
vercel env add VITE_API_URL production
vercel env add VITE_GOOGLE_ANALYTICS_ID production

# Netlify Environment Variables
netlify env:set VITE_API_URL "https://api.purezanaturalis.com"
netlify env:set VITE_GOOGLE_ANALYTICS_ID "G-XXXXXXXXXX"
```

---

## 📊 Monitoreo y Analytics

### Google Analytics 4

```typescript
// analytics.ts
import { gtag } from 'ga-gtag';

export const initGA = () => {
  gtag('config', process.env.VITE_GOOGLE_ANALYTICS_ID, {
    page_title: document.title,
    page_location: window.location.href
  });
};

export const trackEvent = (action: string, category: string) => {
  gtag('event', action, {
    event_category: category,
    event_label: window.location.pathname
  });
};
```

### Performance Monitoring

```bash
# Lighthouse CI
npm install -g @lhci/cli

# Configuración lighthouse
lhci autorun --upload.target=temporary-public-storage
```

### Error Tracking

```typescript
// Sentry configuration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV
});
```

---

## 🔄 CI/CD Automatizado

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:ci
      - run: npm run build:prod

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build:prod
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Auto-Deployment

**Vercel:**
- ✅ Git integration automático
- ✅ Preview deployments en PRs
- ✅ Production deploy en merge a main

**Netlify:**
- ✅ Deploy automático desde Git
- ✅ Branch previews
- ✅ Deploy notifications

---

## 🔍 Testing en Producción

### Smoke Tests

```bash
# Testing post-deploy
npx playwright test --config=playwright.config.production.ts

# Performance testing
npx lighthouse https://purezanaturalis.com --view
```

### Monitoring Checklist

- [ ] ✅ SSL Certificate válido
- [ ] ✅ DNS propagation completa
- [ ] ✅ Analytics funcionando
- [ ] ✅ Forms submissions working
- [ ] ✅ Cart functionality
- [ ] ✅ Performance scores >90
- [ ] ✅ SEO meta tags correctas
- [ ] ✅ Sitemap accessible
- [ ] ✅ Robots.txt configurado

---

## 🆘 Troubleshooting

### Errores Comunes

**Build Failures:**
```bash
# Limpiar cache
npm run validate
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

**DNS Issues:**
```bash
# Verificar propagación DNS
nslookup purezanaturalis.com
dig purezanaturalis.com
```

**SSL Problems:**
```bash
# Verificar SSL
openssl s_client -connect purezanaturalis.com:443
```

### Performance Issues

```bash
# Análisis de bundle
npx vite-bundle-analyzer dist

# Lighthouse audit
npx lighthouse https://purezanaturalis.com --output=html
```

---

## 📚 Recursos de Despliegue

- **📖 Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **📖 Netlify Docs:** [https://docs.netlify.com](https://docs.netlify.com)
- **📖 Vite Deploy:** [https://vitejs.dev/guide/static-deploy.html](https://vitejs.dev/guide/static-deploy.html)
- **📖 Performance:** [https://web.dev/performance](https://web.dev/performance)

---

*🚀 **Deploy Status:** Production Ready*  
*📅 **Última actualización:** 2024-10-07*  
*👨‍💻 **DevOps:** dev@purezanaturalis.com*