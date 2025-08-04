# Lesson 5: Accessibility Testing Fundamentals

## 1. What is Web Accessibility (a11y)?

Web accessibility is the inclusive practice of ensuring there are no barriers that prevent interaction with, or access to, websites on the World Wide Web by people with physical disabilities, situational disabilities, and socio-economic restrictions on bandwidth and speed.

When sites are correctly designed, developed, and edited, all users have equal access to information and functionality.

### The POUR Principles

The Web Content Accessibility Guidelines (WCAG) are organized around four main principles, known as POUR:

-   **Perceivable:** Information and user interface components must be presentable to users in ways they can perceive. (e.g., providing alt text for images).
-   **Operable:** User interface components and navigation must be operable. (e.g., all functionality is available from a keyboard).
-   **Understandable:** Information and the operation of the user interface must be understandable. (e.g., using clear and simple language).
-   **Robust:** Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies. (e.g., using valid HTML).

## 2. The Role of Automated Testing

Automated accessibility testing can catch a significant percentage (some studies suggest 30-50%) of common accessibility issues. It is excellent at detecting violations of technical standards, such as:

-   Missing `alt` text for images.
-   Improper heading structure (e.g., skipping from `<h1>` to `<h3>`).
-   Insufficient color contrast.
-   Missing form labels.

However, automated tools **cannot** determine if the `alt` text is meaningful, if the reading order is logical, or if the user experience makes sense for someone using a screen reader. Therefore, automated testing should always be supplemented with manual testing.

## 3. Integrating Axe with Playwright

Axe is a popular accessibility testing engine developed by Deque Systems. We can integrate it into our Playwright tests using the `axe-playwright` package.

### Step 1: Install Dependencies

```bash
npm install -D axe-playwright
```

### Step 2: Create an Accessibility Test File

Create a new test file, for example, `accessibility.spec.ts`.

## 4. Running a Basic Accessibility Scan

Let's write a test that scans a page for accessibility violations.

### Example: Basic Axe Scan

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Analyzing the Results

The `analyze()` method returns a results object. The most important part of this object is the `violations` array. If this array is empty, it means Axe did not find any accessibility issues that violate WCAG rules.

If there are violations, the `violations` array will contain objects with detailed information about each issue, including:
-   `id`: The rule that was violated (e.g., `color-contrast`).
-   `description`: A human-readable explanation of the issue.
-   `helpUrl`: A link to a page with more information about the violation and how to fix it.
-   `nodes`: An array of the specific HTML elements that are in violation.

### Example of a Violation Object

```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.4/color-contrast",
  "nodes": [
    {
      "html": "<a href=\"/login\" class=\"text-gray-500\">Login</a>",
      "target": [ ".text-gray-500" ]
    }
  ]
}
```

You can log this output to the console to help with debugging:

```typescript
if (accessibilityScanResults.violations.length > 0) {
  console.log('Accessibility Violations:');
  console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
}