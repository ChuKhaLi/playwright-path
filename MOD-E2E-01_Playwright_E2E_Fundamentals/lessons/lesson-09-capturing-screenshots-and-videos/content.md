# Lesson 9: Capturing Screenshots and Videos

## 1. The Importance of Visuals in Debugging

When a test fails, it can sometimes be difficult to understand what went wrong just by looking at the error message. This is where screenshots and videos can be incredibly helpful. They provide a visual record of what was happening on the page at the time of the failure.

## 2. Taking Screenshots

Playwright makes it easy to take screenshots at any point in your test.

### a. Manual Screenshots

You can take a screenshot of the full page using `page.screenshot()`.

```typescript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

You can also take a screenshot of a single element.

```typescript
await page.locator('.my-element').screenshot({ path: 'element.png' });
```

### b. Screenshots on Failure

This is one of the most useful features of Playwright. You can configure it to automatically take a screenshot whenever a test fails.

In your `playwright.config.ts` file:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
});
```

## 3. Recording Videos

Playwright can also record a video of your entire test run. This is a great way to see exactly what happened during the test.

You can enable video recording in your `playwright.config.ts` file.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on', // or 'retain-on-failure'
  },
});
```

-   **`'on'`**: Records a video for every test.
-   **`'retain-on-failure'`**: Records a video for every test, but only keeps the ones from failed tests. This is a great option for saving disk space.

## 4. The Trace Viewer

The Trace Viewer is Playwright's most powerful debugging tool. It combines screenshots, videos, network logs, and a timeline of all the actions in your test into a single, interactive report.

You can enable the Trace Viewer in your `playwright.config.ts` file.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'on', // or 'retain-on-failure'
  },
});
```

After your test run, you can open the trace file using the following command:

```bash
npx playwright show-trace trace.zip
```

## 5. Best Practices

-   **Enable screenshots `only-on-failure` in your config.**
-   **Enable video recording `retain-on-failure` to save disk space.**
-   **Enable tracing `retain-on-failure` for the best debugging experience.**
-   **Use the Trace Viewer as your primary tool for debugging failed tests.**