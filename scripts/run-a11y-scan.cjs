const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function runAudit() {
  // Check if dev server is already running on 3000
  const testUrl = 'http://localhost:3000';

  console.log(`Testing accessibility at ${testUrl}...`);
  console.log('Make sure dev server is running (npm run dev)');

  // Give more time for server readiness
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Launching Browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`Navigating to ${testUrl}...`);
    await page.goto(testUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for hydration/content load with increased timeout
    try {
      await page.waitForSelector('main', { timeout: 15000 });
      await page.waitForSelector('h1', { timeout: 15000 });
      console.log('Content loaded successfully');
    } catch {
      console.warn('Content did not fully load, proceeding anyway...');
    }

    console.log('Running axe-core scan...');
    const results = await new AxeBuilder({ page }).analyze();

    // Create reports dir
    const reportPath = path.resolve('reports/a11y-report.json');
    if (!fs.existsSync('reports')) fs.mkdirSync('reports');

    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`Report saved to ${reportPath}`);
    console.log(`Violations found: ${results.violations.length}`);

    // Summary
    results.violations.forEach((v) => {
      console.log(`\n[${v.impact}] ${v.help}`);
      v.nodes.forEach((n) => {
        console.log(`  Target: ${n.target}`);
        console.log(`  HTML: ${n.html}`);
        console.log(`  Failure: ${n.failureSummary}`);
      });
    });

    if (results.violations.length > 0) {
      console.error('Accessibility violations found! Failing build.');
      process.exitCode = 1;
    }
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

runAudit();
