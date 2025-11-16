# Pureza Naturalis V3 🌿

[![CI](https://github.com/yourusername/pureza-naturalis-v3/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/pureza-naturalis-v3/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yourusername/pureza-naturalis-v3/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/pureza-naturalis-v3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Plataforma de comercio electrónico especializada en productos naturales y terapias alternativas**

Pureza Naturalis V3 es una aplicación web moderna construida con tecnologías de vanguardia para ofrecer una experiencia de compra excepcional de productos naturales, suplementos y terapias alternativas.

## ✨ Características Principales

- **Catálogo Virtualizado**: Navegación fluida con miles de productos usando virtualización
- **Carrito Inteligente**: Gestión avanzada del carrito con persistencia local y sincronización
- **Sistema de Favoritos**: Lista de deseos personalizable con notificaciones
- **Búsqueda y Filtros Avanzados**: Búsqueda inteligente con filtros por categoría, precio y características
- **Autenticación Segura**: Sistema de login/registro con JWT y protección CSRF
- **Sanitización de Datos**: Protección completa contra XSS y ataques de inyección
- **Optimización de Imágenes**: Compresión automática y formatos modernos (WebP, AVIF)
- **Caché Inteligente**: Estrategias de caché para máxima velocidad de carga
- **WCAG 2.1 AA Compliant**: Cumple estándares de accesibilidad completos
- **Navegación por Teclado**: Soporte completo para navegación sin mouse
- **Modo Alto Contraste**: Adaptable a diferentes necesidades visuales
- **Internacionalización**: Soporte multiidioma (ES/EN) con i18next
- **Cobertura 95%+**: Tests unitarios, integración y E2E automatizados
- **Lighthouse 95+**: Puntuaciones óptimas de rendimiento y accesibilidad
- **PWA Completa**: Instalable con service worker y offline capabilities
- **Monitoreo en Tiempo Real**: Sentry, Prometheus, Grafana y Loki integrados

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Framework UI moderno
- **TypeScript 5.7** - Tipado estático
- **Vite 6.2** - Build tool ultrarrápido
- **Zustand** - State management ligero
- **React Router 7** - Routing avanzado
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animaciones fluidas
- **React Query** - Data fetching y caching
- **React Virtuoso** - Virtualización de listas
- **Sharp** - Procesamiento de imágenes

### Backend
- **Fastify 4.28** - Framework web de alto rendimiento
- **SQLite + Drizzle ORM** - Base de datos y ORM moderno
- **Redis** - Caché y sesiones
- **JWT** - Autenticación segura
- **Pino** - Logging estructurado
- **Zod** - Validación de esquemas
- **Bcrypt** - Hashing de contraseñas
- **Rate Limiting** - Protección contra abuso
- **CSRF Protection** - Seguridad contra ataques CSRF

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerización
- **Netlify** - Frontend deployment
- **Railway** - Backend deployment
- **BunnyCDN** - CDN para assets
- **Sentry** - Error monitoring
- **Prometheus** - Métricas
- **Grafana** - Dashboards
- **Loki** - Log aggregation

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pureza-naturalis-v3.git
   cd pureza-naturalis-v3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run in development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
pureza-naturalis-v3/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Application pages
│   ├── services/                 # API services
│   ├── stores/                   # Zustand state stores
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript definitions
│   └── repositories/             # Data access layer
├── backend/                      # Backend API
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── db/                   # Database schemas/migrations
│   │   └── utils/                # Backend utilities
│   └── package.json
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── DEPLOYMENT.md             # Deployment guides
│   ├── TROUBLESHOOTING.md        # Troubleshooting guide
│   └── API.md                    # API reference
├── k6/                           # Load testing scripts
├── scripts/                      # Build and utility scripts
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## 📚 Documentation

- **[🏗️ Architecture](docs/ARCHITECTURE.md)** - System architecture and design
- **[🚀 Deployment](docs/DEPLOYMENT.md)** - Deployment guides for Netlify/Railway
- **[🔧 Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[📡 API Reference](docs/API.md)** - Complete API documentation

## 🧪 Testing

### Unit & Integration Tests
```bash
npm run test:unit
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
npm run test:e2e:ui
```

### Load Tests
```bash
npm run load-test
npm run load-test:prod
```

### Accessibility Tests
```bash
npm run lighthouse:a11y
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production with optimizations |
| `npm run build:prod` | Production build with type-checking |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type checking |
| `npm run validate` | Full validation (lint + type + format) |
| `npm run docs` | Generate TypeDoc documentation |
| `npm run docs:serve` | Serve documentation locally |
| `npm run validate:comments` | Validate JSDoc comments |
| `npm run test:unit` | Run unit tests |
| `npm run test:ui` | Tests with UI |
| `npm run test:coverage` | Tests with coverage report |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | E2E tests with UI |
| `npm run test:all` | Run all test suites |
| `npm run optimize-images` | Optimize images |
| `npm run sitemap` | Generate sitemap |
| `npm run audit:all` | Run all audits |

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policies and vulnerability reporting.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the Pureza Naturalis team

