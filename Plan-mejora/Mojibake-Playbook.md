# Playbook: Mojibake (detección, reparación y prevención)

Objetivo: encontrar y corregir caracteres dañados/encoding mixto (p. ej. cp1252 vs UTF-8) y prevenir que reaparezcan.

## Detección

- Búsqueda rápida de artefactos comunes:
  - `rg "Ã|Â|�|¿�|â€™|â€œ|â€"` src pages components backend Plan-mejora`
  - `rg "[^\x00-\x7F]" src pages components backend Plan-mejora` para caracteres no ASCII (revisar caso a caso).
- Revisar archivos marcados con encoding distinto a UTF-8 (usar `file` o editores con reporte de encoding).
- Si hay JSON/YAML/TS/TSX con mojibake, priorizar su corrección (pueden romper builds).

## Reparación

- Identificar el encoding original (suele ser cp1252 o ISO-8859-1) y convertir a UTF-8:
  - Ejemplo (Unix): `iconv -f cp1252 -t utf-8 input.ext > output.ext` (en Windows, usar WSL o editores que permitan conversión).
- Sustituir caracteres dañados manualmente si el origen es incierto (buscar la palabra original).
- Validar compilación/lint después de la conversión.

## Prevención

- Forzar UTF-8 en `.editorconfig` (charset = utf-8) para todos los archivos de texto.
- Asegurar que Prettier/ESLint se ejecuten en CI (ya configurado) para normalizar.
- Evitar copiar/pegar desde fuentes con cp1252 sin conversión previa.
- Añadir un check ligero opcional:
  - Script simple: `rg "[^\x00-\x7F]" src pages components backend` y fallar solo para extensiones de código (.ts/.tsx/.js/.json/.md/.yaml/.yml).
  - Puede añadirse como job opcional en CI si se desea.

## Checklist mínimo

- [ ] Ejecutar búsqueda de mojibake en código.
- [ ] Convertir archivos afectados a UTF-8.
- [ ] Confirmar que lint/test siguen pasando.
- [ ] (Opcional) Añadir check de no-ASCII a CI para extensiones de código.
