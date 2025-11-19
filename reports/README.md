# Auditoría de Productos – Pureza-Naturalis-V3

Este directorio contiene los artefactos de auditoría y fusión entre la web antigua (`web-puranatura---terapias-naturales`) y la nueva (`Pureza-Naturalis-V3`).

- `product_audit.csv`: Matriz comparativa por producto con presencia/ausencia de secciones y si se fusionaron desde la web antigua.
- `product_changes.log`: Cambios aplicados automáticamente (por ejemplo, renombres basados en imágenes y campos rellenos).
- `missing_sections.csv`: Subconjunto de productos que aún tienen alguna sección incompleta en la nueva web.

## Resumen actual

- Productos totales (nueva web): 71
- Secciones completas (aprox.):
  - detailedDescription, mechanismOfAction, benefitsDescription, healthIssues, components, dosage, administrationMethod, faqs: 49 productos
  - scientificReferences: 26 productos
- Productos con alguna sección faltante: 50 (ver `missing_sections.csv`)

## Notas de implementación

- Se fusionaron campos faltantes desde la web antigua donde hubo coincidencia por nombre o id.
- Se normalizaron nombres de productos para que coincidan con el nombre base de las imágenes (se eliminaron sufijos como Anverso/Reverso/Etiqueta, tolerando separadores `-`, `_` y espacio).
- Se generó copia de seguridad de `src/data/products/all-products.ts` en `src/data/products/all-products.ts.bak`.

## Próximos pasos sugeridos

1. Completar `scientificReferences` para los productos pendientes (priorizar top ventas/categorías clave). Formato: título, autores, revista, año, DOI/PMID/URL, tipo de estudio, tamaño muestral (si aplica), hallazgos clave y resumen.
2. Verificar que “Componentes” coincidan con la etiqueta del reverso de cada imagen; ajustar cantidades y excipientes cuando falten.
3. Revisar de nuevo nombres e imágenes; si alguna imagen no corresponde, reemplazar asset o renombrar producto según corresponda.
4. Pasar corrector ortográfico y revisión de estilo para unificar tono y redacción.
5. Ejecutar el build y pruebas locales para validar que no se rompa la carga diferida de `all-products.ts`.

## Ejecución del auditor

- Script: `tools/product_audit_merge.cjs`
- Uso: `node tools/product_audit_merge.cjs`
- Salidas: este directorio y actualización de `src/data/products/all-products.ts`.
