# Lesson 5: Cross-Platform Test Architecture

## 1. The Importance of Cross-Platform Testing

Users access applications from a diverse ecosystem of devices and browsers. A feature that works perfectly on Chrome on a desktop might be broken on Safari on an iPhone. Cross-platform testing ensures a consistent, high-quality user experience for everyone.

**Key considerations:**
- **Browser Engines:** Chromium (Chrome, Edge), WebKit (Safari), and Gecko (Firefox) can render CSS and execute JavaScript differently.
- **Operating Systems:** Fonts, notifications, and file pickers can differ between Windows, macOS, and Linux.
- **Viewports:** Responsive designs change layout, hide elements, or show different elements (e.g., a hamburger menu) on mobile viewports.

## 2. Configuring Playwright for Cross-Platform Execution

Playwright's strength lies in its ability to run the same test script across different configurations. This is managed in `playwright.config.ts` using projects.

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // A global timeout for all tests
  timeout: 60 * 1000,

  projects: [
    // == Desktop Browsers ==
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },

    // == Mobile Viewports ==
    // These still run on desktop browsers but with mobile dimensions and user agents.
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // Google Pixel 5 viewport
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }, // Apple iPhone 12 viewport
    },
  ],
});
```
When you run `npx playwright test`, it will execute your entire test suite against **all** defined projects in parallel.

## 3. Architectural Patterns for Platform Differences

Even with a robust tool like Playwright, you'll encounter platform-specific differences. Your architecture needs to handle these gracefully without cluttering your tests.

### a) Conditional Logic in Page Objects

For minor differences, you can use conditional logic within your page objects based on the browser or OS.

```typescript
// In a Page Object
import { Page } from '@playwright/test';

export class MyPage {
  constructor(private page: Page) {}

  async openDatePicker() {
    const os = this.page.context().browser().browserType().name();
    
    if (os === 'webkit') { // Safari
      // Safari might have a native date picker that requires a different interaction
      await this.page.locator('#date-input-native').click();
    } else {
      // Other browsers might use a custom calendar widget
      await this.page.locator('#date-input-custom-button').click();
    }
  }
}
```
**Caution:** Use this sparingly. Too much conditional logic can make page objects complex.

### b) Platform-Specific Page Objects (Strategy Pattern)

For more significant differences, you can create platform-specific implementations of a page object.

**1. Define a common interface (`pages/interfaces/IHomePage.ts`)**
```typescript
export interface IHomePage {
  navigate(): Promise<void>;
  openMobileMenu(): Promise<void>;
}
```

**2. Create platform-specific implementations**

**`pages/desktop/HomePage.ts`**
```typescript
import { IHomePage } from '../interfaces/IHomePage';

export class DesktopHomePage implements IHomePage {
  // ...
  async openMobileMenu() {
    // Not applicable on desktop, so we can throw an error or do nothing.
    console.log('Mobile menu does not exist on desktop.');
  }
  // ...
}
```

**`pages/mobile/HomePage.ts`**
```typescript
import { IHomePage } from '../interfaces/IHomePage';

export class MobileHomePage implements IHomePage {
  // ...
  async openMobileMenu() {
    await this.page.locator('#hamburger-menu').click();
  }
  // ...
}
```

**3. Use a factory to provide the correct implementation in a fixture**
```typescript
// In a fixture file
import { DesktopHomePage } from '../pages/desktop/HomePage';
import { MobileHomePage } from '../pages/mobile/HomePage';

export const test = base.extend({
  homePage: async ({ page, isMobile }, use) => {
    if (isMobile) {
      await use(new MobileHomePage(page));
    } else {
      await use(new DesktopHomePage(page));
    }
  },
});

// In a test
test('should open the menu on mobile', async ({ homePage, isMobile }) => {
  if (!isMobile) {
    test.skip(true, 'This test is only for mobile.');
  }
  await homePage.openMobileMenu();
  // ... assertions
});
```

## 4. Writing Resilient Tests for Responsive Design

- **Use Locators That Don't Change:** Rely on `data-testid` attributes, ARIA roles, or text content, which are less likely to change between viewports than CSS classes used for styling.
- **Check for Visibility:** Before interacting with an element, especially one that might be hidden in a menu on mobile, always assert its visibility first.
  ```typescript
  const menuButton = page.locator('#hamburger-menu');
  if (await menuButton.isVisible()) {
    await menuButton.click();
  }
  await page.locator('nav >> text=Profile').click();
  ```
- **Visual Regression Testing:** This is a powerful technique for cross-platform testing. It takes screenshots of your application on different platforms and compares them to baseline images, highlighting any visual differences. We will cover this in a later module.

## 5. Cross-Platform Test Strategy

Running every test on every platform can be time-consuming and expensive. A smart strategy is crucial.

- **Smoke Tests:** Run a small set of critical-path tests on **all** target platforms with every code change.
- **Full Regression Suite:** Run the complete test suite on your **primary target platform** (e.g., Desktop Chrome) with every code change.
- **Nightly Builds:** Run the full regression suite on **all** target platforms on a less frequent schedule, such as nightly or weekly.

This tiered approach provides a balance between fast feedback and comprehensive coverage.