import { test, expect } from '@playwright/test';

// This test file assumes that the authentication has already been handled
// by the global setup file (`auth.setup.ts`) and the `storageState`
// is configured in `playwright.config.ts`.

test.describe('Authenticated user flows', () => {
  test('should access user profile page', async ({ page }) => {
    // The test starts as an authenticated user.
    // No need to log in here.
    await page.goto('https://github.com/settings/profile');

    // Verify that we are on the profile settings page
    await expect(page.locator('h1')).toHaveText('Public profile');

    // Check for a known element on the page that only an authenticated user can see
    const usernameInput = page.getByLabel('Name');
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).not.toBeEmpty();
  });

  test('should be able to access a private repository', async ({ page }) => {
    // Replace with a URL to a private repository you have access to
    const privateRepoUrl = 'https://github.com/your-username/your-private-repo';
    
    await page.goto(privateRepoUrl);

    // Verify access by checking for a key element within the repository view
    await expect(page.getByRole('link', { name: 'Code' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Issues' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pull requests' })).toBeVisible();

    // A non-authenticated user would see a 404 page or a login prompt.
    await expect(page.locator('text=Sign in to view this repository')).not.toBeVisible();
  });
});