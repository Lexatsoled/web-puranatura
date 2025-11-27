# Checklist de Pre-commit

- [ ] `npm run lint` (o lint-staged).
- [ ] `npm run type-check`.
- [ ] `npm run test:ci` (o subset afectado).
- [ ] `npm run format:check`.
- [ ] `npm run scan:security` (si toca config/secrets).
- [ ] Coverage no disminuye en módulos tocados.
- [ ] OpenAPI actualizado si se cambian contratos.
- [ ] Migraciones Prisma incluidas si se cambian esquemas.
