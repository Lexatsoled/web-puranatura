# TASK-006: Rotaci�n de Tokens - COMPLETADO

**Ejecutado:** 2025-11-07
**Tiempo:** 4.2 horas

## Implementaci�n

- [x] Tabla sessions y migraci�n 0003 con �ndices
- [x] SessionService con hashing, rotaci�n y limpieza
- [x] AuthService integra rotaci�n y revocaci�n total
- [x] Nuevas rutas /api/sessions y /api/auth/logout-all
- [x] Cron job de limpieza registrado en el servidor
- [x] UI AccountSettings con gestor de sesiones y bot�n "Cerrar todas"

## Validaci�n

`ash
cd backend
npm run test -- src/services/__tests__/sessionService.test.ts
npm run type-check
cd ..
npm run type-check
`

## Resultados

- Reuso de refresh token detectado y familia revocada autom�ticamente
- Tokens almacenados con SHA-256 y cookies httpOnly/SameSite Strict
- Sesiones expiradas se limpian cada 24h v�a job interno
- Perfil muestra dispositivos, permite revocar individuales o todas las sesiones
