import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the React app to mount
    await page.waitForSelector('#root', { state: 'attached' });
  });

  test('page loads successfully with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Roti Bank Trust/);
  });

  test('navbar is visible', async ({ page }) => {
    const navbar = page.locator('#navbar');
    await expect(navbar).toBeVisible();
  });

  test('navbar contains brand name', async ({ page }) => {
    await expect(page.locator('#navbar')).toContainText('Roti Bank Bettiah Trust');
  });

  test('navbar contains navigation links', async ({ page }) => {
    const navLinks = ['Gallery', 'About', 'Achievements', 'Branches', 'Activities'];
    for (const link of navLinks) {
      await expect(page.locator(`nav >> text=${link}`).first()).toBeVisible();
    }
  });

  test('donate button is visible in navbar', async ({ page }) => {
    const donateBtn = page.locator('#nav-donate-btn');
    await expect(donateBtn).toBeVisible();
    await expect(donateBtn).toContainText('Donate Now');
  });

  test('gallery section exists', async ({ page }) => {
    const gallery = page.locator('#gallery');
    await expect(gallery).toBeAttached();
  });

  test('about section exists', async ({ page }) => {
    const about = page.locator('#about');
    await expect(about).toBeAttached();
  });

  test('stats section renders with stat cards', async ({ page }) => {
    const stats = page.locator('#stats');
    await expect(stats).toBeAttached();
    await expect(stats).toContainText('Our Growing Impact');
  });

  test('achievements section exists', async ({ page }) => {
    const achievements = page.locator('#achievements');
    await expect(achievements).toBeAttached();
  });

  test('donation section exists', async ({ page }) => {
    const donation = page.locator('#donation');
    await expect(donation).toBeAttached();
  });

  test('footer renders with contact information', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('+91 9473228888');
    await expect(footer).toContainText('rotibankbettiah@gmail.com');
    await expect(footer).toContainText('Kalibag Chowk');
  });

  test('footer contains copyright info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('Roti Bank Bettiah Trust');
    await expect(footer).toContainText('5071/2023');
  });

  test('no uncaught console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Filter out known benign errors (like Supabase connection in test env)
    const criticalErrors = errors.filter(
      (e) => !e.includes('supabase') && !e.includes('fetch') && !e.includes('CORS')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
