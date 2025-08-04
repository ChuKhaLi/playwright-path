import { test, expect } from '../fixtures/platform.fixture';

// This test will run on both Desktop Chrome and Mobile Safari,
// as defined in playwright.config.ts.
test.describe('Main Navigation', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('should allow navigation to the Profile page', async ({ homePage, page }) => {
    // The homePage.goToProfilePage() method handles the difference
    // between clicking the hamburger menu on mobile and the direct link on desktop.
    await homePage.goToProfilePage();

    // The assertion is the same for both platforms.
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('h1')).toHaveText('User Profile');
  });

  test('should only show hamburger menu on mobile', async ({ homePage, isMobile }) => {
    // This test demonstrates how to check for platform-specific elements.
    if (isMobile) {
      await expect(homePage.hamburgerMenuButton).toBeVisible();
    } else {
      await expect(homePage.hamburgerMenuButton).not.toBeVisible();
    }
  });

  test('should skip this test on mobile', async ({ isMobile }) => {
    // You can use test.skip() to conditionally run tests.
    test.skip(isMobile, 'This feature is not available on mobile yet.');
    
    // ... test logic for a desktop-only feature
  });
});