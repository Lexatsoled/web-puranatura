import fs from 'fs/promises';
import path from 'path';

const REPORT = process.env.REPORT || './tmp_products_images_report.json';
const OUT_CSV = process.env.OUT_CSV || './tmp_products_images_issues.csv';
const OUT_MAP = process.env.OUT_MAP || './tmp_assets_rename_map.json';
const OUT_PREVIEW = process.env.OUT_PREVIEW || './tmp_assets_rename_preview.md';

function normalizeFilename(filename) {
  // decode percent-encoding
  try { filename = decodeURIComponent(filename); } catch {}
  // split dir + base
  const dir = path.posix.dirname(filename);
  const base = path.posix.basename(filename);
  // lower, replace spaces, parentheses, commas, multiple separators
  let name = base.toLowerCase();
  name = name.replace(/\s+/g, '-');
  name = name.replace(/[(),]+/g, '');
  // replace consecutive non-alphanumeric (except dot and dash) with dash
  name = name.replace(/[^a-z0-9.-]+/g, '-');
  name = name.replace(/-+/g, '-');
  name = name.replace(/^-|-$/g, '');
  return path.posix.join(dir === '.' ? '' : dir, name);
}

async function main() {
  const raw = await fs.readFile(REPORT, 'utf8');
  const report = JSON.parse(raw);

  const csvLines = ['page,img_outer,candidate_raw,candidate_url,descriptor,issues,status'];
  const renameMap = {}; // original -> normalized

  for (const page of report) {
    const p = page.page;
    for (const img of page.images || []) {
      for (const c of img.candidates || []) {
        const status = c.check && (c.check.ok ? 'OK' : `STATUS_${c.check.status||'ERR'}`) || (c.check && c.check.error ? `ERR_${c.check.error}` : 'UNKNOWN');
        const issues = (c.issues||[]).join('|') || (img.src_malformed ? 'src_malformed' : '');
        csvLines.push(
          `"${p}","${(img.outer||'').replace(/"/g,'""')}","${(c.raw||'').replace(/"/g,'""')}","${(c.url||'').replace(/"/g,'""')}","${(c.descriptor||'').replace(/"/g,'""')}","${issues}","${status}"
        `);

        // propose rename if raw url or src contains spaces, parentheses or commas
        try {
          const u = new URL(c.url);
          const origPath = u.pathname; // begins with /
          if (/[\s(),]/.test(origPath)) {
            const decoded = decodeURIComponent(origPath);
            const normalized = normalizeFilename(decoded);
            if (decoded !== normalized) {
              renameMap[decoded] = normalized;
            }
          }
        } catch {
          // ignore malformed urls
        }
      }
    }
  }

  await fs.writeFile(OUT_CSV, csvLines.join('\n'), 'utf8');
  await fs.writeFile(OUT_MAP, JSON.stringify(renameMap, null, 2), 'utf8');

  // create a human preview markdown
  const preview = ['# Assets rename preview (dry-run)', '', `Generated from ${REPORT}`, '', '## Rename map', ''];
        for (const [k,v] of Object.entries(renameMap)) {
          preview.push('- `' + k + '` -> `' + v + '`');
  }
  if (Object.keys(renameMap).length === 0) preview.push('No renames proposed.');

  await fs.writeFile(OUT_PREVIEW, preview.join('\n'), 'utf8');

  console.log('Wrote:', OUT_CSV, OUT_MAP, OUT_PREVIEW);
}

main().catch(err => { console.error(err); process.exit(1); });
