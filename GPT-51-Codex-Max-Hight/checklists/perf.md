# Checklist de Performance

- [ ] Bundle inicial <600kB; report Vite adjunto en PR.
- [ ] Lazy load aplicado a modales, catálogo legacy, gráficos.
- [ ] Imágenes optimizadas (webp/jpg), `loading="lazy"`, tamaños fijos; optimize-images ejecutado.
- [ ] Cache/ETag en GET /products; cliente maneja 304.
- [ ] Debounce/batching en búsquedas/filtros; evitar renders excesivos.
- [ ] k6 smoke/stress ejecutado; thresholds P95/errores dentro de budget.
- [ ] LHCI (desktop/mobile) con LCP/CLS/INP dentro de objetivos; contrastes ok.
- [ ] Dependencias pesadas revisadas (lodash/recharts/framer-motion) y tree-shaking aplicada.
