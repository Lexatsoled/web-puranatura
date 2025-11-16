import { chromium } from 'playwright';
import fs from 'fs';

// Allow overriding the maximum pages via env var or CLI arg for full crawls
const MAX_PAGES = parseInt(process.env.MAX_PAGES || process.argv[2] || '10', 10) || 10;
// Allow overriding the root URL via env var or CLI arg (useful to target /tienda)
const ROOT = process.env.ROOT || process.argv[3] || 'http://localhost:3000';

function parseSrcSet(srcset) {
  if (!srcset) return [];
  // naive split by comma then trim - good for most cases; mark candidates that look suspicious
  const parts = srcset.split(',').map(p => p.trim()).filter(Boolean);
  return parts.map(p => {
    // last token after space is descriptor if matches \d+w or \d+x
    const lastSpace = p.lastIndexOf(' ');
    let url = p;
    let desc = '';
    if (lastSpace > 0) {
      url = p.slice(0, lastSpace).trim();
      desc = p.slice(lastSpace + 1).trim();
    }
    return { raw: p, url, desc };
  });
}

async function checkUrl(url) {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (head.ok) return { status: head.status, ok: true };
    // fallback to GET
    const get = await fetch(url, { method: 'GET' });
    return { status: get.status, ok: get.ok };
  } catch (err) {
    return { error: String(err) };
  }
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Starting crawl from', ROOT);

  // BFS crawl to discover product pages and category/listing pages
  const visited = new Set();
  const toVisit = [ROOT];
  const foundProductLinks = new Set();

  while (toVisit.length > 0 && visited.size < MAX_PAGES) {
    const current = toVisit.shift();
    if (!current || visited.has(current)) continue;
    try {
      console.log('Crawling', current);
      await page.goto(current, { waitUntil: 'networkidle', timeout: 20000 });
      visited.add(current);

      // grab all anchors
      const anchors = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.href).filter(Boolean));

      for (const href of anchors) {
        try {
          const url = new URL(href, current);
          // only same-origin
          if (url.origin !== new URL(ROOT).origin) continue;
          const path = url.pathname;
          if (path.includes('/producto') || path.includes('/product')) {
            foundProductLinks.add(url.href);
          } else {
            // add listing/category pages to queue to discover more product links
            if (!visited.has(url.href) && !toVisit.includes(url.href)) toVisit.push(url.href);
          }
        } catch {
          // ignore malformed hrefs
        }
      }
    } catch (err) {
      console.error('Error crawling', current, String(err));
      visited.add(current);
    }
  }

  const unique = Array.from(foundProductLinks).slice(0, MAX_PAGES);
  console.log('Discovered product links:', unique.length);

  const report = [];

  for (const link of unique) {
    console.log('\n--- Visiting', link);
    const p = await context.newPage();
    const consoleMessages = [];
    p.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    p.on('pageerror', err => consoleMessages.push({ type: 'pageerror', text: err.message }));

    try {
      const resp = await p.goto(link, { waitUntil: 'networkidle', timeout: 20000 });
      console.log('HTTP status', resp && resp.status());

      // wait a touch
      await p.waitForTimeout(500);

      const imgs = await p.evaluate(() => {
        const results = [];
        // img tags
        document.querySelectorAll('img').forEach(img => {
          results.push({ tag: 'img', src: img.getAttribute('src'), srcset: img.getAttribute('srcset'), outer: img.outerHTML });
        });
        // source tags inside picture
        document.querySelectorAll('source').forEach(s => {
          results.push({ tag: 'source', src: s.getAttribute('src'), srcset: s.getAttribute('srcset'), outer: s.outerHTML });
        });
        return results;
      });

      const imageReports = [];
      for (const im of imgs) {
        const entry = { ...im, candidates: [] };
        // check src
        if (im.src) {
          const abs = new URL(im.src, link).href;
          const check = await checkUrl(abs);
          entry.candidates.push({ raw: im.src, url: abs, descriptor: null, check });
          if (im.src.includes(' ') || im.src.includes(',')) entry.src_malformed = true;
        }
        if (im.srcset) {
          const parsed = parseSrcSet(im.srcset);
          for (const c of parsed) {
            let abs;
            try { abs = new URL(c.url, link).href } catch { abs = c.url }
            const issues = [];
            if (!/^(\d+w|\d+x)$/.test(c.desc)) issues.push('missing_or_invalid_descriptor');
            if (c.url.includes(' ')) issues.push('contains_space');
            if (c.url.includes(',')) issues.push('contains_comma');
            const check = await checkUrl(abs);
            entry.candidates.push({ raw: c.raw, url: abs, descriptor: c.desc || null, issues, check });
          }
        }
        imageReports.push(entry);
      }

      // filter console messages for srcset warnings
      const srcsetWarnings = consoleMessages.filter(m => /srcset|Failed parsing 'srcset'|parsing 'srcset'/.test(m.text));

      report.push({ page: link, status: resp && resp.status(), srcsetWarnings, images: imageReports });
    } catch (err) {
      console.error('Error visiting', link, String(err));
      report.push({ page: link, error: String(err) });
    } finally {
      await p.close();
    }
  }

  await browser.close();

  const out = './tmp_products_images_report.json';
  fs.writeFileSync(out, JSON.stringify(report, null, 2), 'utf8');
  console.log('\nReport written to', out);
  // print summary
  for (const r of report) {
    console.log('\nPage:', r.page);
    if (r.error) { console.log('  Error:', r.error); continue; }
    console.log('  Status:', r.status);
    console.log('  srcsetWarnings:', r.srcsetWarnings.length);
    for (const img of r.images) {
      console.log('  Image tag:', img.tag, 'src:', img.src, 'srcset:', img.srcset);
      for (const c of img.candidates) {
        const ok = c.check && c.check.ok ? 'OK' : (c.check && c.check.status ? `STATUS ${c.check.status}` : `ERR ${c.check && c.check.error}`);
        console.log('    Candidate:', c.raw, '->', c.url, 'desc:', c.descriptor, 'issues:', (c.issues||[]).join(','), ok);
      }
    }
  }
})();