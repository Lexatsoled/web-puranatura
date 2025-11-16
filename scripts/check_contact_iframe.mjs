import { chromium } from 'playwright';

const routes = ['/contact','/contacto','/contact-us','/contactanos'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  for (const route of routes) {
    const page = await context.newPage();
    const url = `http://localhost:3000${route}`;
    console.log('\n=== Checking', url, '===');
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    page.on('pageerror', (err) => {
      consoleMessages.push({ type: 'pageerror', text: err.message });
    });

    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      console.log('HTTP status:', resp && resp.status());

      // wait a bit for any dynamic iframe insertion
      await page.waitForTimeout(1000);

      const iframes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('iframe')).map((f) => ({ src: f.getAttribute('src'), id: f.id || null, class: f.className || null }));
      });

      console.log('iframes found:', iframes.length);
      for (const f of iframes) console.log('iframe:', f);

      if (consoleMessages.length) {
        console.log('\n-- Console messages captured --');
        for (const m of consoleMessages) console.log(m.type + ':', m.text);
      } else {
        console.log('-- No console messages captured --');
      }
    } catch (err) {
      console.error('Error visiting', url, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
})();