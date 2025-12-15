const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');

async function debugDOM() {
  const preview = spawn('npm', ['run', 'preview', '--', '--port', '5173'], {
    shell: true,
    stdio: 'ignore',
  });
  await new Promise((r) => setTimeout(r, 5000));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5173');
    const content = await page.content();
    console.log(content);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
    preview.kill();
    // Force kill if needed on windows
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', preview.pid, '/f', '/t']);
    }
  }
}
debugDOM();
