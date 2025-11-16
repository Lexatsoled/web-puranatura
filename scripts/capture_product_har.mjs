import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const root = process.cwd();
const url = process.argv[2] || 'http://localhost:3000/tienda/producto/461';
const outDir = path.resolve(root, 'tmp_product_har');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// name output files based on URL path / product id
const safeName = url.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
const harPath = path.join(outDir, `${safeName}.har`);
const consolePath = path.join(outDir, `${safeName}_console.json`);
const screenshotPath = path.join(outDir, `${safeName}.png`);

console.log('Starting Playwright HAR capture for', url);

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ recordHar: { path: harPath } });
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    try {
      logs.push({ type: msg.type(), text: msg.text(), location: msg.location() });
    } catch (e) {
      logs.push({ type: 'console-error', text: String(e) });
    }
  });
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message, stack: err.stack }));
  page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure()?.errorText }));

  let resp = null;
  try {
    resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Main response status:', resp && resp.status());
  } catch (e) {
    console.error('Navigation error:', e && e.message ? e.message : String(e));
    logs.push({ type: 'navigation-error', error: String(e) });
  }

  // give the page a moment to finish any client-side work
  await page.waitForTimeout(2000);

  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (e) {
    console.error('Screenshot error:', String(e));
    logs.push({ type: 'screenshot-error', error: String(e) });
  }

  await fs.promises.writeFile(consolePath, JSON.stringify(logs, null, 2));

  // closing context will flush the HAR to disk
  await context.close();
  await browser.close();

  console.log('HAR written to', harPath);
  console.log('Console log written to', consolePath);
  console.log('Screenshot written to', screenshotPath);
} catch (err) {
  console.error('Fatal error while capturing HAR:', err);
  process.exitCode = 2;
}
