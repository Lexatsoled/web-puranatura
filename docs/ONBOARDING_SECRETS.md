# Onboarding de Secretos

Este documento guia a nuevos integrantes para configurar secretos locales sin exponer informacion sensible.

## Objetivos del onboarding

- Comprender la diferencia entre `.env` publico y `backend/.env` privado.
- Instalar herramientas de proteccion (husky, gitleaks).
- Obtener acceso controlado a la boveda de secretos.
- Configurar variables en local, staging y GitHub.
- Ejecutar chequeos iniciales para confirmar la instalacion.

## Paso 0: Requisitos previos

1. Cuenta corporativa @purezanaturalis.com.
2. MFA habilitado en GitHub y 1Password.
3. Lectura confirmada de docs/SECRETS_MANAGEMENT.md.
4. Laptop registrada en inventario de IT.

## Paso 1: Clonar y preparar el repo

```bash
git clone https://github.com/pureza-naturalis/pureza-naturalis-v3.git
cd pureza-naturalis-v3
npm install
npm run prepare
```

- Verificar que husky instalo hooks (`ls .husky`).
- Ejecutar `npx gitleaks version` para confirmar disponibilidad del binario.

## Paso 2: Configurar variables publicas

1. Copiar `.env` de ejemplo:
   ```bash
   cp .env .env.local
   ```
2. Editar `.env.local` solo si necesitas alterar flags de UI.
3. Nunca agregar valores sin prefijo `VITE_` en este archivo.

## Paso 3: Solicitar acceso a secretos backend

1. Abrir ticket en Jira usando la plantilla `Access / Secrets`.
2. Incluir:
   - Nombre completo y correo.
   - Proyecto en el que trabajaras.
   - Fecha de expiracion del acceso (default 90 dias).
3. Security Lead comparte boveda 1Password > `Pureza Naturalis / Backend`.
4. Descarga `backend/.env.example` para guiarte en la configuracion local.

## Paso 4: Crear tus valores locales

- Usa los comandos sugeridos:
  ```bash
  openssl rand -base64 64 # JWT_SECRET
  openssl rand -hex 32    # STRIPE_WEBHOOK_SECRET (sandbox)
  ```
- Completa `backend/.env` siguiendo comentarios del archivo example.
- Nunca reutilices valores de otro developer.

## Paso 5: Validaciones iniciales

1. Ejecutar `npm run dev` en frontend y backend (si aplica) para asegurar que las variables son tomadas correctamente.
2. Correr `npx gitleaks detect --no-git --source backend` para validar que tus archivos locales no contienen patrones sospechosos.
3. Adjuntar captura del resultado al ticket de onboarding.
4. Marcar checklist en este documento (seccion final) junto con tu mentor.

## Paso 6: Configurar CI/CD cuando aplique

- Si operaras pipelines:
  1. Solicita permiso en GitHub Environments (staging o production).
  2. Usa `gh secret set` desde un runner autorizado.
  3. Documenta el cambio en `reports/execution-YYYY-MM-DD/onboarding-log.md`.

## Paso 7: Rotacion y offboarding

- Configura recordatorio 30 dias antes de la fecha limite de acceso.
- Al salir del proyecto:
  - Revoca accesos en 1Password.
  - Borra `backend/.env` y `.env.local`.
  - Firma el checklist de salida con tu manager.

## Checklist para nuevos integrantes

| Paso | Tarea | Owner | Estado |
| --- | --- | --- | --- |
| 1 | Leer SECRETS_MANAGEMENT | Nuevo integrante | [ ] |
| 2 | Instalar dependencias y husky | Nuevo integrante | [ ] |
| 3 | Validar gitleaks local | Nuevo integrante | [ ] |
| 4 | Solicitar acceso a 1Password | Manager | [ ] |
| 5 | Completar backend/.env | Nuevo integrante | [ ] |
| 6 | Ejecutar `npm run audit:secret-history` | Nuevo integrante | [ ] |
| 7 | Registrar evidencia en ticket | Mentor | [ ] |
| 8 | Configurar recordatorio de rotacion | Mentor | [ ] |

## Plantilla de ticket

```
Tipo: Access Request
Proyecto: Pureza Naturalis V3
Recurso: Backend Secrets Vault
Owner sponsor: <manager>
Fecha de inicio: <dd/mm/aaaa>
Fecha de fin: <dd/mm/aaaa>
Justificacion: Necesito ejecutar microservicios de autenticacion en local.
```

## Contactos utiles

- Security Lead: security@purezanaturalis.com
- Mentor tecnico: asignado en Jira
- IT Support: it@purezanaturalis.com

## Registro de sesiones

| Fecha | Facilitador | Comentarios |
| --- | --- | --- |
| 2025-11-07 | Security Lead | Configuracion inicial completada |
| 2025-11-08 | Mentor Backend | Validacion de gitleaks exitosa |

## Notas finales

- Mantener este archivo actualizado cuando cambien requisitos.
- Cada onboarding debe adjuntar enlace a la evidencia en reports/execution-YYYY-MM-DD.
- Si encuentras ambiguedades, crea ticket `DOCS-SECRET` para corregirlas.
