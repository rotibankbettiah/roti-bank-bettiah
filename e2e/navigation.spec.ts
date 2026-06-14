import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#root', { state: 'attached' });
    // Give time for data to load and page to settle
    await page.waitForTimeout(1000);
  });

  test('clicking "About" link scrolls to about section', async ({ page }) => {
    // Click the desktop nav link
    await page.locator('nav a:has-text("About")').first().click();
    await page.waitForTimeout(1000);

    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('clicking "Gallery" link scrolls to gallery section', async ({ page }) => {
    await page.locator('nav a:has-text("Gallery")').first().click();
    await page.waitForTimeout(1000);

    const gallerySection = page.locator('#gallery');
    await expect(gallerySection).toBeInViewport();
  });

  test('clicking "Achievements" link scrolls to achievements section', async ({ page }) => {
    await page.locator('nav a:has-text("Achievements")').first().click();
    await page.waitForTimeout(1000);

    const achievementsSection = page.locator('#achievements');
    await expect(achievementsSection).toBeInViewport();
  });

  test('clicking "Donate Now" link scrolls to donation section', async ({ page }) => {
    const donateBtn = page.locator('#nav-donate-btn');
    await donateBtn.click();
    await page.waitForTimeout(1000);

    const donationSection = page.locator('#donation');
    await expect(donationSection).toBeInViewport();
  });

  test('all section anchors are present in the DOM', async ({ page }) => {
    const requiredSections = [
      'gallery',
      'about',
      'achievements',
      'branches',
      'internship',
      'activities',
      'notices',
      'causes',
      'news',
      'donation',
    ];

    for (const id of requiredSections) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });

  test('mobile menu toggle opens and shows navigation links', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    const menuToggle = page.locator('#mobile-menu-toggle');
    await expect(menuToggle).toBeVisible();

    // Open mobile menu
    await menuToggle.click();
    await page.waitForTimeout(500);

    // Check that mobile nav links are visible
    const mobilePanel = page.locator('.mobile-menu-panel');
    await expect(mobilePanel).toBeVisible();

    // Verify some links are present in the mobile menu
    await expect(mobilePanel.getByText('Gallery')).toBeVisible();
    await expect(mobilePanel.getByText('About')).toBeVisible();
    await expect(mobilePanel.getByText('Donate Now')).toBeVisible();
  });

  test('clicking mobile menu link closes the menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    // Open mobile menu
    await page.locator('#mobile-menu-toggle').click();
    await page.waitForTimeout(500);

    // Click a link
    const mobilePanel = page.locator('.mobile-menu-panel');
    await mobilePanel.getByText('About').click();
    await page.waitForTimeout(1000);

    // Menu should close (panel should slide away)
    await expect(mobilePanel).toHaveClass(/translate-x-full/);
  });

  test('floating donate button appears after scrolling', async ({ page }) => {
    // Initially not visible
    const floatingBtn = page.locator('#floating-donate-btn');
    await expect(floatingBtn).not.toBeVisible();

    // Scroll down past 600px
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    await expect(floatingBtn).toBeVisible();
  });
});
