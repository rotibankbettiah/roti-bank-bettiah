import { test, expect } from '@playwright/test';

test('capture console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', exception => {
    errors.push(exception.message);
  });

  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3000);
  
  console.log('--- BROWSER ERRORS ---');
  errors.forEach(e => console.log(e));
  console.log('----------------------');
});
