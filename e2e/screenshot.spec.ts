import { test, expect } from '@playwright/test';

test('take screenshot of the home page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000); // Wait for animations and data fetch
  await page.screenshot({ path: 'home-page-screenshot.png', fullPage: true });
});
