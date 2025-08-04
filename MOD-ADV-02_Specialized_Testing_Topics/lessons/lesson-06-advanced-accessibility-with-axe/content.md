# Lesson 6: Advanced Accessibility with Axe

## 1. Configuring AxeBuilder

The `AxeBuilder` in `axe-playwright` is highly configurable, allowing you to tailor the accessibility scan to your specific needs.

### Targeting WCAG Levels

WCAG has different conformance levels: A (lowest), AA (mid-range), and AAA (highest). Most organizations aim for AA compliance. You can tell Axe which standards to run against using the `withTags()` method.

```typescript
import AxeBuilder from '@axe-core/playwright';

// This will only run rules tagged with 'wcag2aa'
const accessibilityScanResults = await new AxeBuilder({ page })
  .withTags(['wcag2aa'])
  .analyze();
```

Common tags include `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `best-practice`.

### Disabling Rules

Sometimes, you may have a known accessibility issue that has been accepted by your team and will not be fixed immediately. To prevent this issue from failing your tests, you can disable the specific rule.

```typescript
import AxeBuilder from '@axe-core/playwright';

// This will run all rules except for 'color-contrast'
const accessibilityScanResults = await new AxeBuilder({ page })
  .disableRules(['color-contrast'])
  .analyze();
```

This is useful for temporarily ignoring a violation while a fix is being developed, without blocking your entire CI/CD pipeline.

## 2. Scanning Specific Parts of a Page

Running a scan on an entire page can be slow and may report issues in areas you are not currently testing (e.g., headers or footers). Axe allows you to target specific elements.

### Including a Selector

You can limit the scan to a specific part of the page using `include()`.

```typescript
import AxeBuilder from '@axe-core/playwright';

// This will only scan the element with the id 'main-content' and its children
const accessibilityScanResults = await new AxeBuilder({ page })
  .include('#main-content')
  .analyze();
```

### Excluding a Selector

Conversely, you can scan the entire page while excluding a specific component that might have known issues or is not relevant to the current test. This is useful for ignoring third-party widgets that you don't control.

```typescript
import AxeBuilder from '@axe-core/playwright';

// This will scan the whole page but ignore the chat widget
const accessibilityScanResults = await new AxeBuilder({ page })
  .exclude('#live-chat-widget')
  .analyze();
```

## 3. Accessibility in User-Flow Tests

A powerful application of accessibility testing is to check for issues that appear only after user interaction, such as in modals, dropdowns, or dynamically loaded content.

You can integrate Axe scans at multiple points within a single user-flow test.

### Example: Testing a Modal Dialog

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should open a modal and check its accessibility', async ({ page }) => {
  await page.goto('https://example.com');

  // Initial scan of the page
  const initialScan = await new AxeBuilder({ page }).analyze();
  expect(initialScan.violations).toEqual([]);

  // User action: open the modal
  await page.click('#open-modal-button');
  await page.waitForSelector('#my-modal');

  // Scan the page again, but this time only include the modal
  const modalScan = await new AxeBuilder({ page })
    .include('#my-modal')
    .analyze();
  
  // Assert that the modal itself is accessible
  expect(modalScan.violations).toEqual([]);
});
```

This ensures that dynamically added content also meets your accessibility standards.

## 4. Best Practices for Advanced Scans

-   **Be Specific:** The more targeted your scan, the faster and more relevant it will be.
-   **Document Disabled Rules:** If you disable a rule, add a comment explaining why and link to the ticket or decision log.
-   **Combine with Functional Tests:** Add accessibility scans as an extra layer of assertion in your E2E tests rather than creating a completely separate test suite.
-   **Don't Over-Configure:** Start with the default rules and only customize when you have a specific reason to do so.