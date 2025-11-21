import { Locator } from '@playwright/test';

export async function clickWhenReady(el: Locator, timeout = 10000) {
  try {
    await el.waitFor({ state: 'visible', timeout });
    await el.scrollIntoViewIfNeeded();
    await el.waitFor({ state: 'attached', timeout: 2000 }).catch(() => {});
    await el.click();
  } catch (e) {
    await el.click({ force: true });
  }
}

export default { clickWhenReady };
