# 🔐 INSTRUCCIONES SEGURIDAD

> Guía completa de implementación de seguridad: Auth, CSRF, XSS, CSP, rate limiting  
> Stack: Express.js + JWT + bcrypt + PostgreSQL + DOMPurify

---

## 1. Autenticación con JWT

### 1.1 Configuración Backend

```typescript
// backend/src/config/auth.config.ts
export const authConfig = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d'
  },
  bcrypt: {
    saltRounds: 12
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxAttempts: 5
  }
};
```

### 1.2 Password Service

```typescript
// backend/src/services/PasswordService.ts
import bcrypt from 'bcrypt';
import { authConfig } from '@/config/auth.config';

export class PasswordService {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validateStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### 1.3 Token Service

```typescript
// backend/src/services/TokenService.ts
import jwt from 'jsonwebtoken';
import { authConfig } from '@/config/auth.config';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, authConfig.jwt.accessTokenSecret, {
      expiresIn: authConfig.jwt.accessTokenExpiry
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, authConfig.jwt.refreshTokenSecret, {
      expiresIn: authConfig.jwt.refreshTokenExpiry
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, authConfig.jwt.accessTokenSecret) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, authConfig.jwt.refreshTokenSecret) as TokenPayload;
  }

  static decode(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}
```

### 1.4 Auth Middleware

```typescript
// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '@/services/TokenService';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.substring(7);
    const payload = TokenService.verifyAccessToken(token);
    
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### 1.5 Auth Endpoints

```typescript
// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '@/controllers/AuthController';
import { rateLimitMiddleware } from '@/middleware/rateLimit.middleware';
import { validateRequest } from '@/middleware/validation.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register',
  rateLimitMiddleware,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().isLength({ min: 2, max: 100 })
  ],
  validateRequest,
  AuthController.register
);

// POST /api/auth/login
router.post('/login',
  rateLimitMiddleware,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validateRequest,
  AuthController.login
);

// POST /api/auth/refresh
router.post('/refresh',
  body('refreshToken').notEmpty(),
  validateRequest,
  AuthController.refresh
);

// POST /api/auth/logout
router.post('/logout',
  body('refreshToken').notEmpty(),
  validateRequest,
  AuthController.logout
);

export default router;
```

---

## 2. Rate Limiting

### 2.1 Middleware de Rate Limiting

```typescript
// backend/src/middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';
import { authConfig } from '@/config/auth.config';

export const rateLimitMiddleware = rateLimit({
  windowMs: authConfig.rateLimit.windowMs,
  max: authConfig.rateLimit.maxAttempts,
  message: {
    error: 'Demasiados intentos, intenta de nuevo más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiados intentos',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});
```

---

## 3. CSRF Protection

### 3.1 Backend - Generación de Token

```typescript
// backend/src/services/CSRFService.ts
import crypto from 'crypto';

interface CSRFToken {
  token: string;
  timestamp: number;
}

const tokenStore = new Map<string, CSRFToken>();
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hora

export class CSRFService {
  static generateToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    tokenStore.set(token, {
      token,
      timestamp: Date.now()
    });
    return token;
  }

  static validateToken(token: string): boolean {
    const storedToken = tokenStore.get(token);
    
    if (!storedToken) {
      return false;
    }

    const isExpired = Date.now() - storedToken.timestamp > TOKEN_EXPIRY;
    if (isExpired) {
      tokenStore.delete(token);
      return false;
    }

    // Token de un solo uso
    tokenStore.delete(token);
    return true;
  }

  static cleanExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of tokenStore.entries()) {
      if (now - data.timestamp > TOKEN_EXPIRY) {
        tokenStore.delete(token);
      }
    }
  }
}

// Limpieza periódica cada 10 minutos
setInterval(() => CSRFService.cleanExpiredTokens(), 10 * 60 * 1000);
```

### 3.2 Backend - Middleware CSRF

```typescript
// backend/src/middleware/csrf.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { CSRFService } from '@/services/CSRFService';

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Métodos seguros no requieren CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;

  if (!token) {
    return res.status(403).json({
      error: 'Token CSRF requerido'
    });
  }

  if (!CSRFService.validateToken(token)) {
    return res.status(403).json({
      error: 'Token CSRF inválido o expirado'
    });
  }

  next();
};
```

### 3.3 Backend - Endpoint para obtener token

```typescript
// backend/src/routes/csrf.routes.ts
import { Router } from 'express';
import { CSRFService } from '@/services/CSRFService';

const router = Router();

router.get('/csrf-token', (req, res) => {
  const token = CSRFService.generateToken();
  res.json({ csrfToken: token });
});

export default router;
```

### 3.4 Frontend - Hook useCSRFProtection

```typescript
// frontend/src/hooks/useCSRFProtection.ts
import { useState, useEffect } from 'react';
import api from '@/api/api';

export function useCSRFProtection() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.get('/csrf-token');
        setToken(response.data.csrfToken);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/csrf-token');
      setToken(response.data.csrfToken);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { token, isLoading, error, refreshToken };
}
```

### 3.5 Frontend - Axios Interceptor

```typescript
// frontend/src/api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Almacenar token CSRF
let csrfToken: string | null = null;

export const setCSRFToken = (token: string) => {
  csrfToken = token;
};

// Interceptor para agregar CSRF token
api.interceptors.request.use((config) => {
  // Agregar CSRF token a métodos que lo requieren
  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase() || '')) {
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }

  // Agregar JWT token
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no se ha reintentado ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 4. XSS Prevention

### 4.1 Sanitización con DOMPurify

```typescript
// frontend/src/utils/sanitizer.ts
import DOMPurify from 'dompurify';

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripIgnoreTag?: boolean;
}

export const sanitizeHTML = (
  dirty: string,
  options: SanitizeOptions = {}
): string => {
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: options.allowedTags || ['p', 'b', 'i', 'em', 'strong', 'a', 'br'],
    ALLOWED_ATTR: options.allowedAttributes || { a: ['href', 'title'] },
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true
  };

  return DOMPurify.sanitize(dirty, config);
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
```

### 4.2 Componente SafeHTML

```typescript
// frontend/src/components/common/SafeHTML.tsx
import { memo } from 'react';
import { sanitizeHTML } from '@/utils/sanitizer';

interface SafeHTMLProps {
  html: string;
  allowedTags?: string[];
  className?: string;
}

export const SafeHTML = memo<SafeHTMLProps>(({ 
  html, 
  allowedTags,
  className = '' 
}) => {
  const sanitized = sanitizeHTML(html, { allowedTags });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
});

SafeHTML.displayName = 'SafeHTML';
```

---

## 5. Content Security Policy (CSP)

### 5.1 Configuración CSP Middleware

```typescript
// backend/src/middleware/security.middleware.ts
import helmet from 'helmet';
import { Express } from 'express';

export const configureSecurity = (app: Express) => {
  // Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Solo para desarrollo
          "https://cdn.jsdelivr.net"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:"
        ],
        connectSrc: [
          "'self'",
          process.env.API_URL || "http://localhost:3000"
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    })
  );

  // Otros headers de seguridad
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }));
};
```

---

## 6. Audit Logging

### 6.1 Servicio de Auditoría

```typescript
// backend/src/services/AuditService.ts
import { db } from '@/config/database';

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  FAILED_LOGIN = 'FAILED_LOGIN'
}

interface AuditLog {
  userId: string | null;
  action: AuditAction;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

export class AuditService {
  static async log(data: AuditLog): Promise<void> {
    try {
      await db.query(
        `INSERT INTO auth_audit_log 
         (user_id, action, ip_address, user_agent, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [
          data.userId,
          data.action,
          data.ipAddress,
          data.userAgent,
          JSON.stringify(data.details || {})
        ]
      );
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }

  static async getFailedAttempts(
    identifier: string,
    since: Date
  ): Promise<number> {
    const result = await db.query(
      `SELECT COUNT(*) as count
       FROM auth_audit_log
       WHERE (user_id = $1 OR details->>'email' = $1)
       AND action = $2
       AND created_at > $3`,
      [identifier, AuditAction.FAILED_LOGIN, since]
    );

    return parseInt(result.rows[0].count, 10);
  }
}
```

---

## 7. Variables de Entorno

### 7.1 Backend .env

```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=puranatura_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars

# CORS
CORS_ORIGIN=http://localhost:5173

# API URL
API_URL=http://localhost:3000
```

### 7.2 Frontend .env

```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

---

## 8. Checklist de Seguridad

### 8.1 Autenticación

- [ ] Contraseñas hasheadas con bcrypt (cost 12)
- [ ] JWT con expiración corta (15 minutos)
- [ ] Refresh tokens almacenados en DB
- [ ] Tokens revocables al logout
- [ ] Rate limiting en endpoints de auth (5 intentos / 15 min)
- [ ] Validación de fuerza de contraseña
- [ ] Audit logging de intentos de login

### 8.2 CSRF

- [ ] Tokens CSRF en todas las mutaciones
- [ ] Validación de tokens en backend
- [ ] Tokens de un solo uso
- [ ] Expiración de tokens (1 hora)
- [ ] Limpieza periódica de tokens

### 8.3 XSS

- [ ] Sanitización con DOMPurify
- [ ] Escape de contenido user-generated
- [ ] CSP headers configurados
- [ ] No usar dangerouslySetInnerHTML sin sanitizar
- [ ] Validación de input en backend

### 8.4 Headers de Seguridad

- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Strict-Transport-Security (HSTS)
- [ ] X-XSS-Protection

### 8.5 Variables de Entorno

- [ ] Secrets en .env (no en código)
- [ ] .env en .gitignore
- [ ] Variables validadas al inicio
- [ ] Diferentes valores dev/prod

---

**Estado**: ✅ Guía de Seguridad Completa
