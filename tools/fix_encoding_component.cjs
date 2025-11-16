#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(
  __dirname,
  '../src/components/ScientificReferences.tsx'
);

function main() {
  let txt = fs.readFileSync(FILE, 'utf8');
  const before = txt;
  // Reemplazos directos de mojibake comunes en este archivo
  txt = txt.replace(/Referencias Cientficas/g, 'Referencias Científicas');
  txt = txt.replace(
    /Las referencias cientficas para este producto estǭn siendo recopiladas y serǭn aadidas pronto\./g,
    'Las referencias científicas para este producto están siendo recopiladas y serán añadidas pronto.'
  );
  txt = txt.replace(
    /Estudios cientficos que respaldan la informacin de este producto\. Haz clic en cada referencia para mǭs detalles\./g,
    'Estudios científicos que respaldan la información de este producto. Haz clic en cada referencia para más detalles.'
  );
  txt = txt.replace(/\uFFFD\x02/g, '•'); // eslint-disable-line no-control-regex
  txt = txt.replace(/\uFFFD\x02\x02/g, '•'); // eslint-disable-line no-control-regex
  txt = txt.replace(/\uFFFD/g, '•');
  // autores separador
  txt = txt.replace(
    /<span className="font-medium">\{ref\.authors\}<\/span> [^<]* \{ref\.journal\}/g,
    '<span className="font-medium">{ref.authors}</span> • {ref.journal}'
  );

  if (txt !== before) {
    fs.writeFileSync(FILE, txt, 'utf8');
    console.log('ScientificReferences.tsx normalizado.');
  } else {
    console.log('No se detectaron patrones de mojibake para reemplazar.');
  }
}

if (require.main === module) main();
