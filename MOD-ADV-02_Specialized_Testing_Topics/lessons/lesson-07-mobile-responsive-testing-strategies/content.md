# Lesson 7: Mobile and Responsive Testing Strategies

## 1. The Importance of Responsive Design

Responsive web design is an approach that makes web pages render well on a variety of devices and window or screen sizes. A responsive site should adapt its layout to the viewing environment by using fluid grids, flexible images, and CSS media queries.

Testing for responsiveness is crucial because:
-   A significant and growing number of users browse on mobile devices.
-   A poor mobile experience can lead to high bounce rates and lost customers.
-   Google uses mobile-friendliness as a ranking factor in its search results.

## 2. Playwright's Device Emulation

Playwright excels at mobile testing because it can accurately emulate mobile device viewports, user agents, and touch events. It comes with a large list of pre-configured devices.

### Using Device Descriptors

You can find the full list of supported devices in the Playwright documentation. Some popular examples include:
-   `'iPhone 13'`
-   `'Pixel 5'`
-   `'Galaxy S9+'`
-   `'iPad (gen 7)'`

### How to Configure Mobile Projects

The best way to structure your mobile tests is by creating separate projects in your `playwright.config.ts`.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ...
  projects: [
    // Desktop project
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Mobile project
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
    // Tablet project
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],
});
```

When you run `npx playwright test --project=mobile-safari`, your tests will execute in a browser context that perfectly mimics an iPhone 13.

## 3. Writing Responsive Tests

Often, the UI and even the functionality of an application can change on mobile devices. For example, a navigation bar might be replaced by a "hamburger" menu icon. Your tests need to account for these differences.

### Example: Testing a Hamburger Menu

```typescript
import { test, expect } from '@playwright/test';

test.describe('Responsive Navigation', () => {
  test('should show a hamburger menu on mobile', async ({ page, isMobile }) => {
    await page.goto('https://playwright.dev');

    if (isMobile) {
      // On mobile, the hamburger button should be visible
      const hamburgerButton = page.locator('.navbar__toggle');
      await expect(hamburgerButton).toBeVisible();

      // The full navigation links should be hidden
      const navLinks = page.locator('.navbar__item.navbar__link');
      await expect(navLinks.first()).not.toBeVisible();

      // Click the hamburger button to open the menu
      await hamburgerButton.click();
      await expect(navLinks.first()).toBeVisible();
    } else {
      // On desktop, the hamburger button should not be visible
      await expect(page.locator('.navbar__toggle')).not.toBeVisible();
      // The navigation links should be visible
      await expect(page.locator('.navbar__item.navbar__link').first()).toBeVisible();
    }
  });
});
```

The `isMobile` fixture provided by Playwright is a boolean that is `true` if the test is running in a mobile context (as defined by your project configuration). This allows you to write a single test that behaves differently based on the device.

## 4. Visual Regression Testing for Responsiveness

Combining device emulation with visual regression testing is a highly effective way to catch responsive design bugs.

By running your `toHaveScreenshot()` tests across desktop and mobile projects, you can maintain separate baselines for each viewport and ensure your UI looks perfect everywhere.

### Example: Responsive Visual Test

```typescript
import { test, expect } from '@playwright/test';

test('should have a responsive layout', async ({ page }) => {
  await page.goto('https://example.com');

  // The screenshot name will be automatically suffixed with the project name
  // e.g., responsive-layout-chromium.png, responsive-layout-mobile-safari.png
  await expect(page).toHaveScreenshot('responsive-layout.png', { fullPage: true });
});
```

This simple test, when run across your different projects, will create a comprehensive suite of visual baselines for all your supported devices.