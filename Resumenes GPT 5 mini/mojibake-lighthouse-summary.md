# Resumen: Mojibake y Auditoría Lighthouse

Fecha: 2025-11-15

Este documento resume los hallazgos, acciones realizadas y recomendaciones sobre los problemas de codificación (mojibake) y la configuración/estrategia de Lighthouse en el proyecto.

**Contexto rápido**
- Subproyecto afectado: `web-puranatura---terapias-naturales`.
- Problema observado: numerosos archivos contienen texto con mojibake (secuencias como `├í`, `├│`, `Ô`, `Ã`, etc.), lo que indica una lectura previa con encoding incorrecto (probablemente bytes en Latin-1/Windows-1252 interpretados como UTF-8 o, en ocasiones, doble-encoded).
- Existe un script en el repositorio para intentar arreglar esto automáticamente: `web-puranatura---terapias-naturales/scripts/fix-encoding.js`.

**Qué hice hasta ahora**
- Ejecuté `web-puranatura---terapias-naturales/scripts/fix-encoding.js` desde la raíz del workspace. El script implementa una estrategia conservadora: detecta patrones sospechosos y aplica un intento de re-decodificación `latin1 -> utf8` solo si la reparación reduce claramente la ocurrencia de patrones mojibake.
- Resultado: el script devolvió `Encoding normalization completed.` pero siguen existiendo archivos con mojibake leve/visible (por ejemplo `same-details.txt` y `temp_storepage_backup.txt`). Esto sugiere que el script no reescribió esos ficheros porque no cumplían el umbral conservador de mejora o requieren una reparación más agresiva/manual.

**Archivos con mojibake detectados (ejemplos)**
- `web-puranatura---terapias-naturales/same-details.txt` (muchas cadenas con `├í`, `├│`, `├▒`, etc.)
- `web-puranatura---terapias-naturales/temp_storepage_backup.txt`
- Otros `.md` en la misma carpeta donde se usan caracteres box-drawing (podrían ser intencionales o mal renderizados según encoding).

**Por qué ocurre**
- Frecuentemente aparece cuando un fichero originalmente en UTF-8 se abrió/guardó en Latin-1/Windows-1252 (o viceversa), o cuando hubo doble codificación. La reparación estándar es re-interpretar los bytes con el encoding correcto (p. ej. leer como latin1 y volver a codificar a UTF-8) y evaluar si el resultado tiene más caracteres acentuados correctos y menos secuencias mojibake.

**Opciones de corrección propuestas**

- Opción A (recomendada para avance rápido, con seguridad):
  - Ejecutar una pasada automática forzada que:
    - haga backup de cada fichero detectado (archivo `.bak` junto al original),
    - fuerce la recodificación `latin1 -> utf8` en los ficheros sospechosos,
    - reescriba los ficheros solo cuando la reparación mejore claramente el conteo de acentos y reduzca patrones mojibake.
  - Ventaja: cubre muchos archivos de forma eficiente y deja backups para revertir si algo sale mal.
  - Riesgo: cambios en archivos grandes que conviene revisar antes de commitear.

- Opción B (corrección manual dirigida):
  - Corregir manualmente los ficheros prioritarios uno a uno (por ejemplo `same-details.txt` y `temp_storepage_backup.txt`).
  - Ventaja: control total sobre cada cambio; ideal si prefieres revisar antes de guardar.
  - Inconveniente: más lento si hay muchos archivos afectados.

Si quieres que ejecute la Opción A, puedo crear y ejecutar un pequeño script `force-fix-encoding.js` que:

1. Cree un backup `*.bak` antes de cada modificación.
2. Reinterprete el contenido como Latin-1 y lo convierta a UTF-8.
3. Compare métricas simples (conteo de patrones `Ã`, `Â`, `├` etc. y conteo de caracteres acentuados) y reemplace el archivo original solo cuando la métrica indique mejora.

Comando sugerido (ejecutable desde la raíz del repo si confirmas Opción A):

```powershell
node web-puranatura---terapias-naturales\scripts\force-fix-encoding.js
```

---

**Estado y recomendaciones sobre Lighthouse**

- Archivo de configuración CI: `./.lighthouserc.json` presente y configurado. Entre otros, ejecuta `npm run preview` y lanza auditorías.
- Valores actuales documentados en `metrics-dashboard.md`:
  - Performance: 72 (objetivo >90)
  - Accessibility: 88 (objetivo >95)
  - SEO: 85 (objetivo >95)

Acciones de alto impacto para mejorar Lighthouse (priorizadas):

1. Imágenes: convertir a WebP/AVIF donde aplique, entregar dimensiones en HTML/JS y usar `loading=lazy` para imágenes no críticas.
2. Fuentes: usar `font-display: swap`, `preload` de fuentes críticas y `preconnect` al host de fuentes.
3. JS crítico: reducir ejecución en el hilo principal, code-splitting y diferir scripts no esenciales.
4. Caching / HTTP: asegurar `cache-control`, habilitar compresión `br`/`gzip` y servir por HTTP/2 o HTTP/3 si es posible (reduce TTFB y mejora LCP).
5. CLS: reservar espacio para imágenes/iframes, evitar inserciones DOM inesperadas y usar placeholders con tamaño fijo.
6. Service Worker / PWA: ya hay indicios de PWA en el roadmap; finalizar configuración de `manifest.webmanifest` y `sw.js` mejora puntuación PWA y cache.

Comandos sugeridos para obtener un reporte local de Lighthouse:

```powershell
npm run build
npm run preview   # sirve en http://localhost:4173 según .lighthouserc.json
npx lighthouse http://localhost:4173 --output html --output-path=reports/lighthouse-report.html --only-categories=performance,accessibility,seo,pwa

# alternativa: usar LHCI autorun que respeta .lighthouserc.json
npx @lhci/cli@0.11.0 autorun --config=.lighthouserc.json
```

---

**Flujo de trabajo sugerido (pasos siguientes)**

1. Confirmas Opción A (automática con backups) o B (manual). Yo ejecutaré la corrección elegida y te devolveré la lista de archivos modificados y la ubicación de los backups.
2. Ejecutar Lighthouse local y adjuntar el reporte HTML en `reports/`.
3. Implementar correcciones quick-win (optimizar imágenes, preload fonts, font-display), volver a ejecutar Lighthouse y verificar mejora.
4. Re-ejecutar la suite E2E completa de Playwright para todos los proyectos.

---

Si quieres que proceda ya con la Opción A, lo ejecuto ahora y te muestro la lista de ficheros que cambien y los backups (`.bak`). Si prefieres la Opción B, dime qué ficheros quieres que corrija manualmente primero.

Documento generado por la sesión de revisión E2E y análisis, guardado en:

`/Resumenes GPT 5 mini/mojibake-lighthouse-summary.md`
