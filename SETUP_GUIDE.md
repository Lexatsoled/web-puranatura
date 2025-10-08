# 📋 Manual de Instalación y Configuración
*Pureza Naturalis - Plataforma de Terapias Naturales*

## 🚀 Instalación Rápida

### Prerrequisitos
- **Node.js** v18.0+ (recomendado v20+)
- **npm** v9.0+ o **yarn** v3.0+
- **Git** 2.30+

### 1. Clonar Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd web-puranatura---terapias-naturales
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configuración de Entorno
```bash
# Crear archivo de variables de entorno
cp .env.example .env.local

# Editar variables necesarias
nano .env.local
```

### 4. Iniciar Desarrollo
```bash
npm run dev
```

🌐 **La aplicación estará disponible en:** `http://localhost:5173`

---

## ⚙️ Scripts Disponibles

| Script | Descripción | Uso |
|--------|-------------|-----|
| `dev` | Servidor de desarrollo | `npm run dev` |
| `build` | Build de producción | `npm run build` |
| `build:prod` | Build optimizado | `npm run build:prod` |
| `preview` | Preview build | `npm run preview` |
| `test` | Tests con Vitest | `npm run test` |
| `test:ui` | Tests con interfaz | `npm run test:ui` |
| `test:coverage` | Cobertura de tests | `npm run test:coverage` |
| `lint` | Análisis de código | `npm run lint` |
| `lint:fix` | Corregir errores ESLint | `npm run lint:fix` |
| `format` | Formatear código | `npm run format` |
| `type-check` | Verificar tipos TypeScript | `npm run type-check` |
| `validate` | Validación completa | `npm run validate` |

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
├── components/          # Componentes React reutilizables
├── contexts/           # Context providers (Auth, Cart, etc.)
├── data/              # Datos estáticos (productos, servicios)
├── hooks/             # Custom React hooks
├── pages/             # Páginas de la aplicación
├── src/               # Código fuente principal
│   ├── types/         # Definiciones TypeScript
│   └── store/         # Estado global (Zustand)
├── test/              # Tests y utilidades de testing
├── public/            # Assets estáticos
└── scripts/           # Scripts de utilidades
```

### Stack Tecnológico
- **⚛️ Frontend:** React 19 + TypeScript
- **🎨 Styling:** Tailwind CSS
- **📦 Bundler:** Vite 6.x
- **🛣️ Router:** React Router v7
- **🔄 Estado:** Zustand + Context API
- **🧪 Testing:** Vitest + React Testing Library
- **📊 Performance:** Bundle splitting + Code splitting
- **🔍 SEO:** Meta tags + Structured data + Sitemap

---

## 🚀 Optimizaciones Implementadas

### Performance
- ✅ **Bundle Splitting:** Chunks optimizados por tipo
- ✅ **Code Splitting:** Carga lazy de componentes
- ✅ **Image Optimization:** Formatos WebP + lazy loading
- ✅ **Tree Shaking:** Eliminación de código no usado

### SEO
- ✅ **Meta Tags:** Open Graph + Twitter Cards
- ✅ **Structured Data:** Schema.org
- ✅ **Sitemap:** XML generado automáticamente
- ✅ **PWA:** Manifest + Service Worker ready

### Accesibilidad
- ✅ **ARIA Labels:** Componentes accesibles
- ✅ **Keyboard Navigation:** Navegación completa por teclado
- ✅ **Contrast Ratios:** Colores con contraste adecuado
- ✅ **Screen Readers:** Compatibilidad completa

---

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```bash
# .env.local
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Pureza Naturalis
VITE_APP_VERSION=1.0.0
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### ESLint + Prettier
```bash
# Configurar automáticamente
npm run lint:fix
npm run format
```

### TypeScript
```bash
# Verificar tipos
npm run type-check
```

---

## 📱 Responsive Design

### Breakpoints
- **📱 Mobile:** 320px - 768px
- **📋 Tablet:** 768px - 1024px  
- **🖥️ Desktop:** 1024px+
- **🖥️ Large:** 1440px+

### Testing Responsive
```bash
# Preview en múltiples dispositivos
npm run preview
# Acceder desde: http://0.0.0.0:3000
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests básicos
npm run test

# Tests con interfaz
npm run test:ui

# Cobertura de tests
npm run test:coverage
```

### Estructura de Tests
```
test/
├── components/        # Tests de componentes
├── hooks/            # Tests de custom hooks
├── integration/      # Tests de integración
└── __mocks__/        # Mocks para testing
```

---

## 🚀 Despliegue

### Build de Producción
```bash
npm run build:prod
```

### Verificar Build
```bash
npm run preview
```

### Deploy en Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy en Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

---

## 🔍 Monitoreo y Analytics

### Performance Monitoring
- **Lighthouse:** Auditorías automáticas
- **Core Web Vitals:** Métricas optimizadas
- **Bundle Analyzer:** Análisis de tamaño

### Analytics Setup
```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID');
```

---

## 🆘 Troubleshooting

### Problemas Comunes

#### Error de Dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error de TypeScript
```bash
npm run type-check
```

#### Error de Build
```bash
npm run validate
npm run build
```

#### Error de Tests
```bash
npm run test -- --no-cache
```

---

## 📚 Recursos Adicionales

- **🔗 React:** [https://react.dev](https://react.dev)
- **🔗 TypeScript:** [https://typescriptlang.org](https://typescriptlang.org)
- **🔗 Tailwind CSS:** [https://tailwindcss.com](https://tailwindcss.com)
- **🔗 Vite:** [https://vitejs.dev](https://vitejs.dev)
- **🔗 Vitest:** [https://vitest.dev](https://vitest.dev)

---

## 👥 Contribución

### Workflow
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m "feat: nueva funcionalidad"`
4. Push a rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **ESLint:** Seguir configuración del proyecto
- **Prettier:** Formateo automático
- **TypeScript:** Tipado estricto
- **Tests:** Cobertura mínima 80%

---

*📧 **Soporte:** info@purezanaturalis.com*  
*🌐 **Web:** https://purezanaturalis.com*  
*📱 **Contacto:** +1-809-000-0000*