import { test, expect } from '@playwright/test';

/**
 * This example demonstrates how to use Playwright for basic security checks.
 * Note: These tests require a running application with authentication to test against.
 * The code is for demonstration purposes.
 */
test.describe('Security Checks', () => {
  // A helper function to log in as a specific user type
  async function loginAs(page, userType: 'admin' | 'user') {
    await page.goto('/login');
    const username = userType === 'admin' ? 'admin' : 'user';
    const password = userType === 'admin' ? 'adminpass' : 'userpass';
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  }

  test('a non-admin user should be redirected from the admin page', async ({
    page,
  }) => {
    // Log in as a regular user
    await loginAs(page, 'user');

    // Attempt to access the admin page
    await page.goto('/admin');

    // Assert that the URL is not the admin page
    expect(page.url()).not.toContain('/admin');
    // Assert that an access denied message is shown
    await expect(page.locator('body')).toContainText('Access Denied');
  });

  test('admin user should be able to access the admin page', async ({
    page,
  }) => {
    // Log in as an admin
    await loginAs(page, 'admin');

    // Access the admin page
    await page.goto('/admin');

    // Assert that the admin is successfully on the admin page
    await expect(page.locator('h1')).toHaveText('Admin Dashboard');
  });
});