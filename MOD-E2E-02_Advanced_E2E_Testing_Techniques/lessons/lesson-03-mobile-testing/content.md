# Lesson 3: Mobile and Responsive Testing

A significant portion of web traffic comes from mobile devices. Testing your application's mobile and responsive design is essential. Playwright provides powerful tools for mobile emulation.

## 1. What is Mobile Emulation?

Mobile emulation simulates the screen size, user agent, and touch events of a mobile device on a desktop browser. This allows you to test your application's responsive design without needing a physical device.

## 2. Using Device Descriptors

Playwright comes with a set of predefined device descriptors that make it easy to emulate popular devices.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

When you run your tests with these projects, Playwright will automatically configure the browser with the correct viewport size, user agent, and touch event support.

## 3. Emulating a Custom Device

If you need to test a device that isn't in the predefined list, you can specify the properties yourself.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'My Custom Device',
      use: {
        browserName: 'chromium',
        viewport: { width: 360, height: 740 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: 'MyCustomUserAgent/1.0',
      },
    },
  ],
});
```

## 4. Testing Responsive Layouts

You can write tests to assert that your application's layout changes correctly at different viewport sizes.

```typescript
import { test, expect } from '@playwright/test';

test('should display the mobile navigation menu on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8 size

  await page.goto('https://my-responsive-site.com');

  // The full navigation should be hidden
  await expect(page.locator('#full-nav')).not.toBeVisible();

  // The hamburger menu button should be visible
  await expect(page.locator('#hamburger-menu')).toBeVisible();
});