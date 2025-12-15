# Contributing to PuraNatura

¡Gracias por tu interés en contribuir! Este documento describe el proceso de desarrollo y las mejores prácticas.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (para tests de integración)
- Redis 7+ (para rate limiting)

### Setup

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd web-puranatura---terapias-naturales

# 2. Instalar dependencias
npm install

# 3. Configurar pre-commit hooks
npm run prepare

# 4. Ejecutar desarrollo
npm run dev
```

---

## 📋 Code Quality Standards

### Pre-commit Hooks

Los pre-commit hooks se ejecutan automáticamente antes de cada commit:

- ✅ **ESLint** auto-fix en archivos staged
- ✅ **Prettier** formateo automático
- ✅ **TypeScript** type checking

Si hay errores, **el commit será bloqueado** hasta que se corrijan.

### Manual Checks

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Format
npm run format

# Validate all
npm run validate
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in UI mode
npm run test:ui
```

### Accessibility

```bash
# Run a11y scan
npm run a11y
```

---

## 🔁 CI Pipeline

### Automated Checks

Cada push/PR ejecuta automáticamente:

1. **ESLint** (sin warnings)
2. **TypeScript** type check
3. **Vitest** unit tests + coverage
4. **Build** verification
5. **Accessibility** scan (opcional)

**El PR no se puede mergear si el CI falla.**

### CI Scripts

```bash
# Run full CI locally
npm run ci

# Individual checks
npm run ci:lint
npm run ci:typecheck
npm run ci:test
npm run ci:build
```

---

## 📝 Commit Guidelines

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `refactor`: Código refactorizado
- `perf`: Mejoras de rendimiento
- `test`: Tests añadidos/actualizados
- `docs`: Documentación
- `chore`: Tareas de mantenimiento
- `style`: Cambios de formato (no afectan código)

### Ejemplos

```bash
git commit -m "feat(auth): add JWT refresh tokens"
git commit -m "fix(cart): resolve quantity update bug"
git commit -m "perf(images): lazy load product thumbnails"
```

---

## 🏗️ Project Structure

```
├── .github/
│   └── workflows/      # CI/CD pipelines
├── backend/            # Express API
├── src/
│   ├── components/     # React components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand stores
│   ├── utils/          # Utilities
│   └── types/          # TypeScript types
├── scripts/            # Build/automation scripts
└── test/               # Test files
```

---

## 🔒 Security

### Secret Management

- ❌ **NUNCA** comitear secrets en código
- ✅ Usar variables de entorno
- ✅ Documentar en `.env.example`

### XSS Prevention

- ✅ Usar `sanitizeHTML()` para user input
- ✅ Evitar `dangerouslySetInnerHTML` sin sanitización
- ✅ Validar URLs con `sanitizeUrl()`

---

## 🐛 Debugging

### Development

```bash
# Frontend only
npx vite

# Backend only
cd backend && npm run dev

# Both (concurrently)
npm run dev
```

### Common Issues

**Port conflict:**

```bash
# Kill process on port 3000
npx kill-port 3000
```

**Stale cache:**

```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 Resources

- **Architecture:** [README.md](../README.md)
- **Security:** [Phase 2 Walkthrough](../.gemini/antigravity/brain/a2f25486-4ae9-4ecc-bcc6-090b21670158/phase-2-walkthrough.md)
- **Performance:** [Phase 3 Results](../.gemini/antigravity/brain/a2f25486-4ae9-4ecc-bcc6-090b21670158/phase-3-final-results.md)

---

## ✅ Checklist

Antes de crear un PR:

- [ ] Pre-commit hooks pasan sin errores
- [ ] Tests pasan localmente (`npm test`)
- [ ] CI pipeline pasa en GitHub Actions
- [ ] Código formateado correctamente
- [ ] Sin warnings de ESLint/TypeScript
- [ ] Cambios documentados (si aplica)

---

**¿Preguntas?** Abre un issue o contacta al equipo.
