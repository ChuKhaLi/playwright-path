# Handling Complex Authentication Flows

Testing pages behind a login wall is a fundamental requirement for most E2E test suites. Logging in through the UI for every single test is slow and inefficient. This lesson covers robust strategies for handling authentication in Playwright.

## 1. The Problem with UI-Based Login

Relying on UI-based login for every test has several drawbacks:
-   **Slow:** It adds significant time to each test run.
-   **Brittle:** Login forms can change, breaking all your tests.
-   **Not Isolated:** A failure in the login flow causes a cascade of failures in unrelated tests.

The best practice is to log in once and reuse the session across multiple tests.

## 2. Reusing Authentication State

Playwright's recommended approach is to use a **global setup file** to log in once and save the authentication state (cookies, local storage, etc.) to a file. Then, individual tests can load this state, bypassing the UI login.

### Step 1: Create a Global Setup File

This file will perform the login and save the state.

`auth.setup.ts`
```typescript
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace with your own login logic.
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('your-username');
  await page.getByLabel('Password').fill('your-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait until the page receives the cookies.
  //
  // Sometimes login is slow and waiting for a specific element is not enough.
  // In this case, you can wait for a network response that sets the cookie.
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
```

### Step 2: Configure Playwright

In `playwright.config.ts`, specify the global setup file and configure projects to use the saved state.

`playwright.config.ts`
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Use a global setup file.
  globalSetup: require.resolve('./auth.setup.ts'),

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        // Use the saved authentication state.
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],
});
```

### Step 3: Write Authenticated Tests

Your tests will now run in an authenticated context automatically.

`authenticated-test.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test('user dashboard is visible after login', async ({ page }) => {
  // This test will start already logged in.
  await page.goto('https://github.com/dashboard');
  
  // Verify that the user is on their dashboard.
  await expect(page.locator('.dashboard-sidebar')).toBeVisible();
});
```

## 3. Handling Multi-Factor Authentication (MFA)

MFA adds a layer of complexity. Here are common strategies for test environments:
-   **Disable MFA:** The most straightforward approach is to disable MFA for test user accounts in your testing environment.
-   **Use Virtual Authenticators:** For TOTP (Time-based One-Time Password) authenticators like Google Authenticator, you can use libraries like `otplib` to generate codes programmatically.
-   **Mock MFA Service:** In a controlled test environment, the MFA service can be mocked to accept any code.

**Example with `otplib`:**
```typescript
import { authenticator } from 'otplib';

// In your auth.setup.ts
const mfaSecret = process.env.MFA_SECRET; // Store the secret securely
const mfaCode = authenticator.generate(mfaSecret);

await page.getByLabel('One-time code').fill(mfaCode);
await page.getByRole('button', { name: 'Verify' }).click();
```

## 4. Social Logins (OAuth)

Testing OAuth flows (e.g., "Login with Google") is challenging because it involves a third-party domain, which is often protected against automation.
-   **Avoid Direct Testing:** Do not test the third-party login flow directly. It's not your application, and they have their own tests.
-   **Mock the Callback:** The best approach is to mock the OAuth callback. After the user would typically authenticate with the third party, that service redirects back to your application with a token or code. You can simulate this by:
    1.  Intercepting the network request to the third party.
    2.  Navigating directly to your application's callback URL with a valid, pre-generated test token.

**Example of Mocking an OAuth Callback:**
```typescript
test('should handle OAuth callback', async ({ page }) => {
  const testToken = 'mock-oauth-token-for-testing';

  // Navigate directly to the callback URL with the mock token
  await page.goto(`/auth/callback/google?code=${testToken}`);

  // Your application should handle this callback and log the user in.
  // Assert that the user is now authenticated.
  await expect(page.locator('#user-profile')).toBeVisible();
});
```

## Summary

Properly handling authentication is key to creating a fast and reliable E2E test suite. By using Playwright's `storageState` and global setup, you can log in once and reuse the session for all your tests. For more complex scenarios like MFA and OAuth, a combination of environment configuration, mocking, and programmatic code generation provides robust solutions without sacrificing test stability.