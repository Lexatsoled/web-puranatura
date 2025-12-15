const fs = require('fs');
const path = require('path');
const playwright = require('playwright');

async function runAxe(url, outFile) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  // Inject axe from CDN
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js',
  });

  const result = await page.evaluate(async () => {
    return await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2aa', 'section508'] },
    });
  });

  await browser.close();

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log('Axe report saved to', outFile);
}

const url = process.argv[2] || 'http://localhost:5173';
const out = process.argv[3] || 'reports/axe-report.json';

runAxe(url, out).catch((err) => {
  console.error(err);
  process.exit(1);
});
