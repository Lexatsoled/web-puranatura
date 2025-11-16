#!/usr/bin/env node
/*
  force_repair_encoding.cjs
  Fuerza una reparación latin1->utf8 en archivos de texto cuando detecta mojibake (Ã, �).
  Uso: node scripts/force_repair_encoding.cjs <file1> <file2> ...
*/
const fs = require('fs');
const path = require('path');

function score(text) {
  const bad = (text.match(/[�]/g) || []).length + (text.match(/Ã./g) || []).length;
  const goodAccents = (text.match(/[áéíóúñÁÉÍÓÚÑüÜ]/g) || []).length;
  return { bad, goodAccents };
}

function repairOnce(s) {
  try {
    return Buffer.from(s, 'latin1').toString('utf8');
  } catch {
    return s;
  }
}

function bestRepair(original) {
  const candidates = [original];
  let cur = original;
  for (let i = 0; i < 2; i++) {
    cur = repairOnce(cur);
    candidates.push(cur);
  }
  // pick candidate with minimal bad and maximal goodAccents
  let best = candidates[0];
  let bestScore = score(best);
  for (const c of candidates.slice(1)) {
    const sc = score(c);
    const isBetter = sc.bad < bestScore.bad || (sc.bad === bestScore.bad && sc.goodAccents > bestScore.goodAccents);
    if (isBetter) {
      best = c;
      bestScore = sc;
    }
  }
  return { text: best, score: bestScore };
}

function processFile(file) {
  try {
    const buf = fs.readFileSync(file);
    const utf8Dec = buf.toString('utf8');
    const lat1Dec = buf.toString('latin1');

    const candidates = [];
    candidates.push({ text: utf8Dec, label: 'utf8-decode', score: score(utf8Dec) });
    candidates.push({ text: lat1Dec, label: 'latin1-decode', score: score(lat1Dec) });

    // Try repairs on both
    const rep1 = bestRepair(utf8Dec);
    candidates.push({ text: rep1.text, label: 'utf8+repair', score: rep1.score });
    const rep2 = bestRepair(lat1Dec);
    candidates.push({ text: rep2.text, label: 'latin1+repair', score: rep2.score });

    // pick best
    let best = candidates[0];
    for (const c of candidates.slice(1)) {
      const isBetter = c.score.bad < best.score.bad || (c.score.bad === best.score.bad && c.score.goodAccents > best.score.goodAccents);
      if (isBetter) best = c;
    }
    const current = candidates[0];
    const improved = best.text !== current.text;
    if (improved) {
      fs.writeFileSync(file, best.text, 'utf8');
      console.log(`Repaired: ${path.relative(process.cwd(), file)} via ${best.label} (bad ${current.score.bad}->${best.score.bad}, accents ${current.score.goodAccents}->${best.score.goodAccents})`);
    } else {
      console.log(`No improvement: ${path.relative(process.cwd(), file)} (bad ${current.score.bad}, accents ${current.score.goodAccents})`);
    }
  } catch (e) {
    console.error('Error processing', file, e.message);
  }
}

const args = process.argv.slice(2);
const targets = args.length ? args : ['README.md', 'CONTRIBUTING.md'];
for (const t of targets) {
  if (fs.existsSync(t)) processFile(path.resolve(t));
}
console.log('Encoding force-repair done.');
