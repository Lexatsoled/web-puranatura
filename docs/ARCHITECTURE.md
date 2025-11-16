# Arquitectura del Sistema

## System Overview

Pureza Naturalis V3 es una plataforma de comercio electrónico especializada en productos naturales y terapias alternativas. La arquitectura sigue principios de microservicios con separación clara entre frontend y backend, implementando mejores prácticas de seguridad, rendimiento y escalabilidad.

El sistema está diseñado para manejar alto tráfico con optimizaciones de frontend (PWA, virtualización, CDN), backend robusto (Fastify, SQLite, Redis) y monitoreo completo (Sentry, Prometheus, Grafana).

## High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             Client Layer                                        │
│  (React SPA + PWA + Service Worker + IndexedDB)                                │
└─────────────────┬───────────────────────────────────────────────────────────────┘
                  │ HTTPS/JSON + JWT
                  │
┌─────────────────▼───────────────────────────────────────────────────────────────┐
│                             API Gateway Layer                                   │
│  (Fastify Server + Rate Limiting + CSRF Protection + CORS)                     │
└─────────────────┬───────────────────────────────────────────────────────────────┘
                  │
    ┌─────────────▼─────────────┐    ┌─────────────────────────────────────────────┐
    │     CDN Layer             │    │            Database Layer                   │
    │  (BunnyCDN - Static       │    │  (SQLite + Drizzle ORM + Redis Cache)      │
    │   Assets, Images, Cache)  │    │                                             │
    └─────────────┬─────────────┘    └─────────────────────────────────────────────┘
                  │
                  │
    ┌─────────────▼─────────────┐
    │     Monitoring Layer      │
    │  (Sentry + Prometheus +   │
    │   Grafana + Loki)         │
    └───────────────────────────┘
```

## Component Architecture

### Frontend Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Frontend Layer                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Routing   │  │   State     │  │ Performance │  │  Security   │            │
│  │ (React      │  │ Management │  │ Monitoring │  │   Layer     │            │
│  │  Router)    │  │ (Zustand)  │  │ (Web Vitals)│  │ (Sanitize)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Components  │  │   Services  │  │   Hooks     │  │  Utils      │            │
│  │ (Reusable   │  │   (API)     │  │ (Custom)    │  │ (Helpers)   │            │
│  │   UI)       │  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                             │
│  │   PWA       │  │   i18n      │  │   Testing   │                             │
│  │ (Service    │  │ (Multi-    │  │   Suite     │                             │
│  │  Worker)    │  │  language) │  │ (Vitest)    │                             │
│  └─────────────┘  └─────────────┘  └─────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Backend Layer                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Routes    │  │  Services   │  │ Database    │  │  Security   │            │
│  │ (REST API)  │  │ (Business   │  │ (Drizzle    │  │ (JWT/Auth)  │            │
│  │             │  │  Logic)     │  │   ORM)      │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Validation  │  │   Cache     │  │   Logging   │  │   Monitoring│            │
│  │   (Zod)     │  │   (Redis)   │  │   (Pino)    │  │ (Prometheus)│            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                             │
│  │   Queue     │  │ Background  │  │   Health    │                             │
│  │ (Bull)      │  │   Jobs      │  │   Checks    │                             │
│  └─────────────┘  └─────────────┘  └─────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Backend Layered Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             Presentation Layer                                  │
│  (Fastify Routes + Middleware + Validation)                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ▼                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                          Service Layer                                      │
│  │  (Business Logic + Data Processing + External APIs)                        │
│  └─────────────────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────────────────────┤
│  ▼                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                          Data Access Layer                                  │
│  │  (Repositories + ORM + Cache + Database Connections)                       │
│  └─────────────────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────────────────────┤
│  ▼                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                          Infrastructure Layer                               │
│  │  (Database + Redis + File System + External Services)                      │
│  └─────────────────────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Database Schema

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Database Schema                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │     users       │    │    products     │    │    categories   │            │
│  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤            │
│  │ id (PK)         │    │ id (PK)         │    │ id (PK)         │            │
│  │ email (UQ)      │    │ name            │    │ name            │            │
│  │ password_hash   │    │ description     │    │ description     │            │
│  │ created_at      │    │ price           │    │ created_at      │            │
│  │ updated_at      │    │ category_id (FK)│    │ updated_at      │            │
│  │                 │    │ stock_quantity  │    └─────────────────┘            │
│  │                 │    │ image_url       │                                  │
│  │                 │    │ created_at      │    ┌─────────────────┐            │
│  │                 │    │ updated_at      │    │   order_items   │            │
│  └─────────────────┘    └─────────────────┘    ├─────────────────┤            │
│                                                │ id (PK)         │            │
│  ┌─────────────────┐                           │ order_id (FK)    │            │
│  │    orders       │                           │ product_id (FK)  │            │
│  ├─────────────────┤                           │ quantity         │            │
│  │ id (PK)         │                           │ unit_price       │            │
│  │ user_id (FK)    │                           │ created_at       │            │
│  │ status          │                           └─────────────────┘            │
│  │ total_amount    │                                                         │
│  │ shipping_address│                                                         │
│  │ created_at      │                                                         │
│  │ updated_at      │                                                         │
│  └─────────────────┘                                                         │
│                                                                                │
│  Relationships:                                                               │
│  users.id ────► orders.user_id                                                │
│  categories.id ────► products.category_id                                     │
│  orders.id ────► order_items.order_id                                         │
│  products.id ────► order_items.product_id                                     │
│                                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Defense in Depth Strategy

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Security Layers                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                    Network Security                                         │
│  │  (HTTPS, HSTS, CSP, CORS, Rate Limiting, DDoS Protection)                   │
│  └─────────────────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────────────────────┤
│  ▼                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                   Application Security                                      │
│  │  (Input Validation, XSS Prevention, CSRF Protection, JWT Auth)             │
│  └─────────────────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────────────────────┤
│  ▼                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                   Data Security                                             │
│  │  (Encryption at Rest, SQL Injection Prevention, PII Redaction)             │
│  └─────────────────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────────────────────┤
│  ▼                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐
│  │                   Monitoring & Response                                     │
│  │  (Security Logging, Intrusion Detection, Incident Response)                │
│  └─────────────────────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Security Components

- **Authentication**: JWT tokens con refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: AES-256 encryption para datos sensibles
- **API Security**: Rate limiting, CSRF protection, input sanitization
- **Monitoring**: Security event logging y alerting

## Deployment Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Deployment Architecture                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   GitHub        │    │   CI/CD         │    │   Production    │            │
│  │   Repository    │───►│   Pipeline      │───►│   Environment   │            │
│  │                 │    │ (GitHub Actions)│    │                 │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│          │                     │                        │                     │
│          │                     │                        │                     │
│          ▼                     ▼                        ▼                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Frontend      │    │   Backend       │    │   Database      │            │
│  │   (Netlify)     │    │   (Railway)     │    │   (Railway)      │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   CDN           │    │   Monitoring    │    │   Backup        │            │
│  │   (BunnyCDN)    │    │   (Sentry)      │    │   (Automated)    │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Deployment Strategy

- **Frontend**: Netlify con build automático y CDN global
- **Backend**: Railway con auto-scaling y database integrada
- **Database**: SQLite en Railway con backups automáticos
- **CDN**: BunnyCDN para assets estáticos e imágenes
- **CI/CD**: GitHub Actions con validaciones automáticas

## Monitoring Stack

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Monitoring Architecture                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Application   │    │   System        │    │   Business      │            │
│  │   Metrics       │    │   Metrics       │    │   Metrics       │            │
│  │ (Sentry)        │    │ (Prometheus)    │    │ (Custom)        │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│          │                     │                        │                     │
│          ▼                     ▼                        ▼                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Logs          │    │   Alerts        │    │   Dashboards    │            │
│  │   (Loki)        │    │   (Alertmanager)│    │   (Grafana)     │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Frontend      │    │   Backend       │    │   Database      │            │
│  │   Monitoring    │    │   Monitoring    │    │   Monitoring    │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Monitoring Components

- **Error Tracking**: Sentry para frontend y backend
- **Metrics**: Prometheus para system y application metrics
- **Logging**: Pino con Loki para log aggregation
- **Visualization**: Grafana dashboards
- **Alerting**: Alertmanager para notificaciones
- **Uptime**: External monitoring services

### Key Metrics Monitored

- **Performance**: Response times, throughput, error rates
- **System**: CPU, memory, disk usage, network I/O
- **Business**: User sessions, conversion rates, revenue
- **Security**: Failed login attempts, suspicious activities
- **Availability**: Uptime, health check status
 
 