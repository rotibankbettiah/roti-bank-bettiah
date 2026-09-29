import { test, expect } from '@playwright/test';

test.describe('Responsiveness and Mobile Layout', () => {
  const viewports = [
    { name: 'Mobile 320px', width: 320, height: 568 },
    { name: 'Mobile 360px', width: 360, height: 740 },
    { name: 'Mobile 375px', width: 375, height: 667 },
    { name: 'Mobile 390px', width: 390, height: 844 },
    { name: 'Tablet 768px', width: 768, height: 1024 },
    { name: 'Laptop 1024px', width: 1024, height: 768 },
  ];

  for (const vp of viewports) {
    test(`no horizontal overflow on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForSelector('#root', { state: 'attached' });
      await page.waitForTimeout(1000);

      // Scroll through entire page to trigger any scroll reveals or lazy renders
      await page.evaluate(async () => {
        const distance = 400;
        const totalHeight = document.body.scrollHeight;
        for (let y = 0; y < totalHeight; y += distance) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
      });

      const overflowInfo = await page.evaluate(() => {
        const winWidth = window.innerWidth;
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;

        // Find elements with right edge > winWidth + 1
        const badElements = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 2) {
            badElements.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              class: (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : '',
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              winWidth,
            });
          }
        }

        return {
          winWidth,
          docWidth,
          bodyWidth,
          hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
          badElements: badElements.slice(0, 15),
        };
      });

      console.log(`[${vp.name}] scrollWidth: ${overflowInfo.docWidth}, innerWidth: ${overflowInfo.winWidth}, badElements:`, overflowInfo.badElements);
      expect(overflowInfo.hasOverflow, `Page has horizontal overflow on ${vp.name}: docWidth=${overflowInfo.docWidth} vs winWidth=${overflowInfo.winWidth}`).toBe(false);
    });
  }

  test('mobile menu functions properly on 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#mobile-menu-toggle', { timeout: 10000 });

    const toggle = page.locator('#mobile-menu-toggle');
    await expect(toggle).toBeVisible();

    await toggle.click();
    await page.waitForTimeout(400);

    const panel = page.locator('.mobile-menu-panel');
    await expect(panel).toBeVisible();

    // Check panel does not exceed viewport width
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375);
    }
  });

  test('chatbot panel fits mobile viewport when opened', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#chatbot-fab-btn', { timeout: 10000 });

    const chatFab = page.locator('#chatbot-fab-btn');
    await expect(chatFab).toBeVisible();
    await chatFab.click();
    await page.waitForTimeout(400);

    const chatPanel = page.locator('#chatbot-form').locator('..');
    const box = await chatPanel.boundingBox();
    console.log('Chatbot panel bounding box on 375px:', box);
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375);
      expect(box.x + box.width).toBeLessThanOrEqual(375 + 5);
    }
  });
});
