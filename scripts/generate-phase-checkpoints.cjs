const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const sourcePath = path.join(ROOT, 'GPT-51-Codex-Max-Hight', 'CheckList.md');
const targetPath = path.join(ROOT, 'docs', 'phase-checkpoints.md');

function buildStub(sourceContent) {
  const now = new Date().toISOString().split('T')[0];
  return `## Estado de fases — índice y punto de entrada canonical

Este documento ahora actúa como un stub/index de compatibilidad en \
\`docs/\` que apunta a la fuente de verdad canonica del plan maestro.

La documentación y el seguimiento detallado de fases se mantiene en:

  - \`GPT-51-Codex-Max-Hight/CheckList.md\` (FUENTE DE VERDAD — checklist maestro, evidencia y pasos por fase)

¿Por qué este cambio?
  - Evitamos duplicidad y drift entre documentos.
  - Conservamos un punto de entrada en \`docs/\` para herramientas o lectores que navegan esa carpeta.

Uso recomendado:
  - Para trabajo operativo y actualizaciones del plan maestro, edita únicamente \`GPT-51-Codex-Max-Hight/CheckList.md\`.
  - Si encuentras referencias externas apuntando a \`docs/phase-checkpoints.md\`, permanecen válidas pero redirigidas a la fuente canonical.

Última actualización: ${now} — actualizado desde CheckList.md (automático).

_Contenido fuente (primera sección de CheckList.md resumida):_

---

${extractSummary(sourceContent)}
`;
}

function extractSummary(source) {
  if (!source) return '';
  const lines = source.split(/\r?\n/).slice(0, 40);
  // Keep only first non-empty block to avoid huge dump
  const trimmed = lines.join('\n').trim();
  const preview = trimmed.split('\n\n')[0];
  return preview;
}

function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error(
      'ERROR: no encuentro GPT-51-Codex-Max-Hight/CheckList.md — no puedo regenerar el stub.'
    );
    process.exit(1);
  }

  const src = fs.readFileSync(sourcePath, 'utf8');
  const newContent = buildStub(src);

  let current = '';
  if (fs.existsSync(targetPath)) {
    current = fs.readFileSync(targetPath, 'utf8');
  }

  if (current.trim() === newContent.trim()) {
    console.log(
      'No hay cambios en docs/phase-checkpoints.md — ya está sincronizado.'
    );
    process.exit(0);
  }

  // Ensure target dir exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, newContent, 'utf8');
  console.log(
    'docs/phase-checkpoints.md actualizado correctamente (generado desde CheckList.md).'
  );
  process.exit(0);
}

main();
