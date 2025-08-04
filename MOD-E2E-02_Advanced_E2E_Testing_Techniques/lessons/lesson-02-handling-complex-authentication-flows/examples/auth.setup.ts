import { test as setup, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const authFile = 'playwright/.auth/user.json';

setup('authenticate as user', async ({ page }) => {
  // Use environment variables for credentials for security
  const username = process.env.PLAYWRIGHT_USERNAME;
  const password = process.env.PLAYWRIGHT_PASSWORD;

  if (!username || !password) {
    throw new Error('Username or password is not set in environment variables. Please create a .env file.');
  }

  // Navigate to the login page
  await page.goto('https://github.com/login');

  // Perform the login steps
  await page.getByLabel('Username or email address').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for the main dashboard to load after login.
  // A good practice is to wait for a specific element that only appears when logged in.
  await expect(page.locator('h1.dashboard-title')).toBeVisible({ timeout: 10000 });

  // Save the authentication state to the specified file.
  // This captures cookies, local storage, etc.
  await page.context().storageState({ path: authFile });

  console.log(`Authentication state saved to ${authFile}`);
});