# The Trace Viewer

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Understand Tracing**: Explain what the Playwright Trace Viewer is and why it's essential for debugging E2E tests
2. **Enable Tracing**: Configure tracing in [`playwright.config.ts`](../../../playwright.config.ts) using different modes
3. **Generate Traces**: Run tests to create trace files for analysis
4. **Navigate the UI**: Use the Trace Viewer interface to inspect test execution
5. **Debug Effectively**: Use trace data to identify and resolve test failures

## What is the Playwright Trace Viewer?

The Playwright Trace Viewer is one of the most powerful debugging tools available for E2E testing. Think of it as a "time machine" for your tests - it records everything that happens during test execution and allows you to step through each action to see exactly what your test was doing at any point in time.

### Why is Tracing Important?

When tests fail, especially in CI/CD environments, it can be challenging to understand what went wrong. The Trace Viewer solves this by providing:

- **Visual Timeline**: See exactly when each action occurred
- **DOM Snapshots**: View the page state before and after each action
- **Network Activity**: Monitor all HTTP requests and responses
- **Console Logs**: Access browser console output during test execution
- **Screenshots**: Automatic screenshots at key moments
- **Action Details**: Detailed information about each Playwright action

## Enabling Tracing in Configuration

Tracing is configured in your [`playwright.config.ts`](../../../playwright.config.ts) file. There are several modes available:

### Tracing Modes

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Enable tracing on first retry of failed tests
    trace: 'on-first-retry',
    
    // Other common options:
    // trace: 'on',           // Always record traces
    // trace: 'off',          // Never record traces
    // trace: 'retain-on-failure', // Keep traces only for failed tests
  },
});
```

### Understanding Trace Modes

1. **`'on-first-retry'`** (Recommended for CI/CD)
   - Records traces only when a test fails and is retried
   - Balances debugging capability with performance
   - Ideal for production environments

2. **`'on'`** (Best for Development)
   - Always records traces for every test
   - Provides maximum debugging information
   - Can slow down test execution

3. **`'off'`**
   - Disables tracing completely
   - Fastest execution but no debugging data

4. **`'retain-on-failure'`**
   - Records traces for all tests but only keeps them if tests fail
   - Good compromise between performance and debugging

## Generating and Viewing Traces

### Step 1: Run Tests with Tracing Enabled

Once tracing is configured, run your tests normally:

```bash
npx playwright test
```

If a test fails (and you're using `'on-first-retry'`), Playwright will automatically generate a trace file.

### Step 2: Locate Trace Files

Trace files are saved in the `test-results` directory:

```
test-results/
├── example-test-chromium/
│   ├── trace.zip
│   ├── test-failed-1.png
│   └── video.webm
```

### Step 3: Open the Trace Viewer

Use the Playwright CLI to open the trace:

```bash
npx playwright show-trace test-results/example-test-chromium/trace.zip
```

This command opens the Trace Viewer in your default browser.

## Navigating the Trace Viewer Interface

The Trace Viewer interface consists of several key sections:

### 1. Timeline (Top Section)

The timeline shows the chronological sequence of all actions:

- **Action Bars**: Each bar represents a Playwright action
- **Hover Details**: Hover over bars to see action details
- **Time Markers**: Shows the duration of each action
- **Zoom Controls**: Use mouse wheel or controls to zoom in/out

### 2. Action List (Left Panel)

Displays all actions in chronological order:

- **Action Names**: [`page.goto()`](../../../page.goto()), [`page.click()`](../../../page.click()), [`page.fill()`](../../../page.fill()), etc.
- **Timestamps**: When each action occurred
- **Status Indicators**: Success, failure, or warning icons
- **Click to Navigate**: Click any action to jump to that moment

### 3. DOM Snapshot (Center Panel)

Shows the page state at the selected moment:

- **Interactive DOM**: Click elements to inspect them
- **Before/After Views**: Toggle between states before and after actions
- **Element Highlighting**: Selected elements are highlighted
- **Responsive View**: Resize to see different viewport sizes

### 4. Details Panel (Right Side)

Provides detailed information about the selected action:

- **Action Parameters**: Arguments passed to the action
- **Element Selector**: The locator used to find the element
- **Execution Time**: How long the action took
- **Error Messages**: If the action failed, detailed error information

### 5. Network Tab

Monitor all network activity during test execution:

- **Request List**: All HTTP requests made during the test
- **Request Details**: Headers, payload, response data
- **Timing Information**: Request/response timing
- **Status Codes**: HTTP status codes for each request

### 6. Console Tab

View browser console output:

- **Console Logs**: All [`console.log()`](../../../console.log()), [`console.error()`](../../../console.error()), etc.
- **JavaScript Errors**: Runtime errors that occurred
- **Timestamps**: When each log entry was created
- **Log Levels**: Different types of console output

## Time-Travel Debugging

The most powerful feature of the Trace Viewer is the ability to "time-travel" through your test execution:

### How Time-Travel Works

1. **Select Any Action**: Click on any action in the timeline or action list
2. **View Page State**: The DOM snapshot shows exactly how the page looked at that moment
3. **Inspect Elements**: Click on elements to see their properties and state
4. **Compare States**: Switch between before/after views to see changes

### Practical Time-Travel Example

Imagine your test fails when trying to click a button:

1. **Navigate to the Failed Action**: Click on the failed [`page.click()`](../../../page.click()) action
2. **Examine the DOM**: Look at the page state when the click was attempted
3. **Check Element State**: Was the button visible? Enabled? In the right position?
4. **Review Previous Actions**: Go back to see what led to this state
5. **Identify the Issue**: Maybe the button was covered by a modal or still loading

## Common Debugging Scenarios

### Scenario 1: Element Not Found

When you see "Element not found" errors:

1. Navigate to the failed action in the trace
2. Examine the DOM snapshot at that moment
3. Check if the element exists but with a different selector
4. Look at previous actions to see if the page state changed unexpectedly

### Scenario 2: Timing Issues

For tests that fail intermittently:

1. Look at the timeline to see action durations
2. Check if actions are happening too quickly
3. Examine network requests to see if data is still loading
4. Use the console tab to check for JavaScript errors

### Scenario 3: Unexpected Page State

When the page doesn't look as expected:

1. Use time-travel to go back to previous actions
2. Compare DOM snapshots before and after each action
3. Check network requests for failed API calls
4. Look for JavaScript errors that might have changed the page

## Best Practices for Using Traces

### 1. Strategic Trace Configuration

```typescript
// For development
export default defineConfig({
  use: {
    trace: 'on', // Always trace during development
  },
});

// For CI/CD
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Only trace on failures
  },
});
```

### 2. Meaningful Test Names

Use descriptive test names to make traces easier to identify:

```typescript
test('should successfully submit contact form with valid data', async ({ page }) => {
  // Test implementation
});
```

### 3. Add Context with Console Logs

Add strategic console logs to provide context in traces:

```typescript
test('user login flow', async ({ page }) => {
  console.log('Starting login test');
  await page.goto('/login');
  
  console.log('Filling login form');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  
  console.log('Submitting form');
  await page.click('#login-button');
  
  console.log('Verifying successful login');
  await expect(page.locator('.welcome-message')).toBeVisible();
});
```

### 4. Clean Up Trace Files

Trace files can be large, so clean them up regularly:

```bash
# Remove all test results
rm -rf test-results/

# Or use Playwright's built-in cleanup
npx playwright test --reporter=html --clean
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run Playwright tests
  run: npx playwright test

- name: Upload trace artifacts
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-traces
    path: test-results/
```

### Viewing Traces in CI

1. Download trace artifacts from your CI system
2. Extract the files locally
3. Use [`npx playwright show-trace`](../../../npx playwright show-trace) to view them

## Advanced Trace Features

### Custom Trace Annotations

Add custom information to your traces:

```typescript
test('complex user workflow', async ({ page }) => {
  await page.goto('/app');
  
  // Add custom trace annotation
  await page.evaluate(() => {
    console.log('TRACE: Starting complex workflow');
  });
  
  // Your test steps here
});
```

### Programmatic Trace Control

Control tracing programmatically within tests:

```typescript
test('conditional tracing', async ({ page, context }) => {
  // Start tracing for specific scenarios
  await context.tracing.start({ screenshots: true, snapshots: true });
  
  // Your test actions
  await page.goto('/complex-page');
  
  // Stop and save trace
  await context.tracing.stop({ path: 'custom-trace.zip' });
});
```

## Troubleshooting Common Issues

### Issue 1: Trace Files Not Generated

**Problem**: No trace files appear after test failures.

**Solutions**:
- Check your [`playwright.config.ts`](../../../playwright.config.ts) configuration
- Ensure the test actually failed (traces aren't generated for passing tests with `'on-first-retry'`)
- Verify you have write permissions to the `test-results` directory

### Issue 2: Trace Viewer Won't Open

**Problem**: [`npx playwright show-trace`](../../../npx playwright show-trace) command fails.

**Solutions**:
- Ensure you have the latest version of Playwright installed
- Check that the trace file path is correct
- Try opening the trace file directly in a browser

### Issue 3: Large Trace Files

**Problem**: Trace files are too large and slow to load.

**Solutions**:
- Use `'on-first-retry'` instead of `'on'` in production
- Configure tracing to capture fewer screenshots
- Clean up old trace files regularly

## Summary

The Playwright Trace Viewer is an invaluable tool for debugging E2E tests. It provides a complete picture of what happened during test execution, allowing you to:

- **See the Timeline**: Understand the sequence of actions
- **Inspect Page State**: View the DOM at any point in time
- **Monitor Network**: Track all HTTP requests and responses
- **Review Console Output**: Access browser console logs
- **Time-Travel Debug**: Navigate through test execution step by step

By mastering the Trace Viewer, you'll be able to debug test failures quickly and effectively, making your test automation more reliable and maintainable.

## Next Steps

In the next lesson, we'll explore **Basic Locators and Element Selection**, where you'll learn how to reliably find and interact with elements on web pages using Playwright's powerful locator system.