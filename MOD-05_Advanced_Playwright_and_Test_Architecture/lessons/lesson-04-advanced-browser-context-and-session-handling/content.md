# Lesson 4: Advanced Browser Context and Session Handling

## 1. The Playwright Hierarchy: Browser, Context, Page

To manage sessions effectively, it's essential to understand Playwright's object hierarchy.

- **Browser:** Represents a single browser instance (e.g., Chromium, Firefox). A browser can have multiple independent browser contexts. The `browser` fixture in Playwright gives you access to this.
- **BrowserContext:** An isolated, "incognito-like" session within a browser instance. Each context has its own cookies, local storage, and cache. A context can have multiple pages (tabs). The `context` fixture gives you access to this.
- **Page:** Represents a single tab within a browser context. This is the primary object you interact with in your tests. The `page` fixture gives you access to this.

By default, Playwright Test creates a new, clean browser context for each test file, ensuring tests are isolated from each other.

## 2. Simulating Multiple Users with Browser Contexts

A powerful feature of browser contexts is the ability to simulate multiple users interacting with your application simultaneously. This is perfect for testing scenarios like chat applications, collaborative editing, or admin/user interactions.

```typescript
import { test, expect } from '@playwright/test';

test('admin can message a user', async ({ browser }) => {
  // Create a context for the admin user
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  
  // Create a separate context for a regular user
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  // --- Admin logs in ---
  await adminPage.goto('/login');
  // ... admin login steps ...
  await expect(adminPage.getByText('Admin Dashboard')).toBeVisible();

  // --- User logs in ---
  await userPage.goto('/login');
  // ... user login steps ...
  await expect(userPage.getByText('Welcome, User!')).toBeVisible();

  // --- Admin sends a message ---
  await adminPage.goto('/messages/user123');
  await adminPage.getByRole('textbox').fill('Hello from the admin!');
  await adminPage.getByRole('button', { name: 'Send' }).click();

  // --- User receives the message ---
  await userPage.goto('/messages');
  await expect(userPage.getByText('Hello from the admin!')).toBeVisible();

  // Clean up contexts
  await adminContext.close();
  await userContext.close();
});
```
In this example, `adminContext` and `userContext` are completely isolated. They have separate cookies and storage, perfectly simulating two different users on two different machines.

## 3. Reusing Authentication State for Faster Tests

Logging in through the UI for every single test is slow and inefficient. A much better approach is to log in once, save the authentication state (cookies, local storage), and then reuse that state for all subsequent tests.

We touched on this with `globalSetup` in the previous lesson. Let's look at how to use the saved state.

### Step 1: Create the `global.setup.ts` (as seen before)
This file logs in and saves the state to `playwright/.auth/user.json`.

### Step 2: Configure `playwright.config.ts`
Tell Playwright to use this saved state for all tests.

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global.setup.ts'),
  
  use: {
    // Start all tests from a logged-in state.
    storageState: 'playwright/.auth/user.json',
  },
  // ...
});
```

### Step 3: Write Tests That Assume a Logged-in State
Now, your tests can skip the login steps entirely.

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigate to the dashboard, assuming we are already logged in.
  await page.goto('/dashboard');
});

test('should display user-specific data on the dashboard', async ({ page }) => {
  await expect(page.getByText('Your Recent Activity')).toBeVisible();
});

test('can access settings page', async ({ page }) => {
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
});
```
By using `storageState`, you dramatically speed up your test suite because the expensive UI login flow is only performed once.

## 4. Advanced Context Management

### Manipulating Cookies
You can manually add or retrieve cookies from a context. This is useful for setting up state or asserting that a cookie was set correctly.

```typescript
test('should set a tracking cookie', async ({ context, page }) => {
  // Add a cookie before navigating
  await context.addCookies([{
    name: 'tracking_preference',
    value: 'accepted',
    url: 'https://example.com'
  }]);

  await page.goto('https://example.com');

  // Get all cookies and verify
  const cookies = await context.cookies();
  const trackingCookie = cookies.find(c => c.name === 'tracking_preference');
  expect(trackingCookie?.value).toBe('accepted');
});
```

### Setting Permissions and Geolocation
Browser contexts allow you to mock browser-level features like permissions or geolocation.

```typescript
test('should handle geolocation and clipboard permissions', async ({ browser }) => {
  const context = await browser.newContext({
    // Mock user's location
    geolocation: { latitude: 52.52, longitude: 13.39 }, // Berlin
    // Grant clipboard read/write permissions
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  
  await page.goto('/maps');
  // The app will now think the user is in Berlin.
  
  // You can also interact with the clipboard
  await page.evaluate(() => navigator.clipboard.writeText('Test'));
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toBe('Test');

  await context.close();
});
```

## 5. Summary

Browser contexts are a cornerstone of advanced Playwright testing. They provide a mechanism for test isolation, simulating multiple users, and efficiently managing sessions. By mastering context management and authentication state reuse, you can build a test suite that is not only robust and reliable but also significantly faster and more scalable.