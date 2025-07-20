# Hands-On Practice: The Trace Viewer

## Overview

In this exercise, you'll learn to use the Playwright Trace Viewer by configuring tracing, running tests, and exploring the generated trace files. You'll practice debugging techniques and learn to interpret trace data effectively.

## Prerequisites

- Completed Lesson 03: Introduction to the Test Runner
- Basic understanding of Playwright test structure
- Node.js and Playwright installed in your project

## Exercise 1: Configure Tracing

### Step 1: Set Up Your Configuration

1. **Create or modify your [`playwright.config.ts`](../../../../playwright.config.ts) file:**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    // Enable tracing for development
    trace: 'on-first-retry',
    
    // Optional: Enable screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

2. **Verify your configuration:**
   - Save the file
   - Run [`npx playwright test --dry-run`](../../../../npx playwright test --dry-run) to check for configuration errors

### Step 2: Understanding Trace Modes

**Task**: Experiment with different trace modes by modifying your config:

1. **Development Mode** (Always trace):
   ```typescript
   use: {
     trace: 'on',
   }
   ```

2. **Production Mode** (Trace on retry):
   ```typescript
   use: {
     trace: 'on-first-retry',
   }
   ```

3. **Failure Mode** (Keep traces only for failures):
   ```typescript
   use: {
     trace: 'retain-on-failure',
   }
   ```

**Question**: Which mode would you use for local development vs. CI/CD? Write your answer below:

```
Your Answer:
Local Development: ________________
CI/CD Pipeline: ___________________
Reasoning: _______________________
```

## Exercise 2: Generate Your First Trace

### Step 1: Copy the Example Test

1. **Create a test directory** (if it doesn't exist):
   ```bash
   mkdir tests
   ```

2. **Copy the example test** from [`../examples/traceable-test.spec.ts`](../examples/traceable-test.spec.ts) to your `tests` directory:
   ```bash
   cp ../examples/traceable-test.spec.ts tests/my-trace-test.spec.ts
   ```

### Step 2: Run the Test

1. **Run a single test to generate a trace:**
   ```bash
   npx playwright test tests/my-trace-test.spec.ts --project=chromium
   ```

2. **If the test passes**, force a failure to generate a trace:
   - Modify the test to expect wrong text
   - Or use the `--retries=1` flag to ensure retry behavior

3. **Check for trace files:**
   ```bash
   ls test-results/
   ```

**Expected Output**: You should see directories like `my-trace-test-chromium` containing `trace.zip` files.

### Step 3: Open Your First Trace

1. **Open the trace viewer:**
   ```bash
   npx playwright show-trace test-results/my-trace-test-chromium/trace.zip
   ```

2. **Explore the interface:**
   - Timeline at the top
   - Action list on the left
   - DOM snapshot in the center
   - Details panel on the right

**Checkpoint**: Can you see the trace viewer in your browser? ✅ Yes / ❌ No

## Exercise 3: Navigate the Trace Viewer

### Step 1: Explore the Timeline

**Tasks**:
1. **Hover over different action bars** in the timeline
2. **Click on various actions** to jump to different moments
3. **Use the zoom controls** to get a detailed view of specific time periods

**Questions**:
- How long did the [`page.goto()`](../../../../page.goto()) action take? __________ ms
- Which action took the longest time? __________________
- How many total actions were recorded? __________________

### Step 2: Examine the Action List

**Tasks**:
1. **Click on the first [`page.goto()`](../../../../page.goto()) action**
2. **Find a [`page.fill()`](../../../../page.fill()) action**
3. **Locate a [`page.click()`](../../../../page.click()) action**

**Questions**:
- What URL was loaded in the goto action? __________________
- What text was filled in the username field? __________________
- What selector was used for the submit button? __________________

### Step 3: Inspect DOM Snapshots

**Tasks**:
1. **Navigate to a [`page.fill()`](../../../../page.fill()) action**
2. **Toggle between "Before" and "After" views**
3. **Click on elements in the DOM snapshot**

**Questions**:
- Can you see the difference between before/after states? ✅ Yes / ❌ No
- What happens when you click on form elements in the snapshot? __________________

## Exercise 4: Debug with Network and Console Tabs

### Step 1: Examine Network Activity

**Tasks**:
1. **Click on the "Network" tab** in the trace viewer
2. **Find the initial page load request**
3. **Look for any form submission requests**

**Questions**:
- How many network requests were made during the test? __________________
- What was the status code of the main page request? __________________
- Were there any failed network requests? ✅ Yes / ❌ No

### Step 2: Review Console Output

**Tasks**:
1. **Click on the "Console" tab**
2. **Find the custom trace logs** (starting with "TRACE:")
3. **Look for any JavaScript errors**

**Questions**:
- How many custom trace logs can you find? __________________
- What was the first trace log message? __________________
- Were there any console errors? ✅ Yes / ❌ No

## Exercise 5: Time-Travel Debugging

### Step 1: Simulate a Debugging Scenario

**Task**: Imagine the login test failed. Use the trace to debug:

1. **Navigate to the [`page.click()`](../../../../page.click()) action** for the submit button
2. **Examine the page state** at that moment
3. **Check if the form fields were properly filled**
4. **Look at the network requests** after the click

**Debugging Questions**:
- Were the form fields filled correctly before submission? ✅ Yes / ❌ No
- Was the submit button visible and clickable? ✅ Yes / ❌ No
- What network request was triggered by the form submission? __________________

### Step 2: Compare Different Test States

**Tasks**:
1. **Go to the beginning** of the test (first action)
2. **Jump to the middle** (form filling actions)
3. **Go to the end** (verification actions)

**Analysis Questions**:
- How did the page appearance change throughout the test? __________________
- At what point did the success message appear? __________________

## Exercise 6: Create Your Own Traceable Test

### Step 1: Write a Custom Test

**Task**: Create a new test file `tests/my-custom-trace.spec.ts` with the following requirements:

1. **Navigate to a website** of your choice (or use `https://example.com`)
2. **Add console logs** for trace context
3. **Perform at least 3 different actions** (click, fill, hover, etc.)
4. **Include assertions** to verify expected behavior

**Example Structure**:
```typescript
import { test, expect } from '@playwright/test';

test('my custom traceable test', async ({ page }) => {
  console.log('TRACE: Starting my custom test');
  
  // Your test steps here
  
  console.log('TRACE: Test completed');
});
```

### Step 2: Run and Analyze Your Test

1. **Run your custom test:**
   ```bash
   npx playwright test tests/my-custom-trace.spec.ts
   ```

2. **Open the generated trace:**
   ```bash
   npx playwright show-trace test-results/my-custom-trace-chromium/trace.zip
   ```

3. **Analyze your trace:**
   - Count the total actions
   - Find your custom console logs
   - Examine the DOM changes

**Reflection Questions**:
- What insights did you gain from your custom trace? __________________
- How could tracing help you debug real test failures? __________________

## Exercise 7: Advanced Trace Features

### Step 1: Custom Trace Annotations

**Task**: Modify your test to include custom trace annotations:

```typescript
test('advanced trace features', async ({ page }) => {
  // Custom annotation
  await page.evaluate(() => {
    console.log('CUSTOM_TRACE: This is a custom annotation');
  });
  
  // Your test actions here
});
```

### Step 2: Programmatic Trace Control

**Task**: Experiment with programmatic trace control:

```typescript
test('programmatic tracing', async ({ page, context }) => {
  // Start custom tracing
  await context.tracing.start({ screenshots: true, snapshots: true });
  
  // Your test actions
  await page.goto('https://example.com');
  
  // Stop and save trace
  await context.tracing.stop({ path: 'custom-trace.zip' });
});
```

## Troubleshooting Guide

### Common Issues and Solutions

**Issue 1**: No trace files generated
- **Check**: Is tracing enabled in your config?
- **Check**: Did the test actually fail (for `'on-first-retry'` mode)?
- **Solution**: Try using `trace: 'on'` temporarily

**Issue 2**: Trace viewer won't open
- **Check**: Is the trace file path correct?
- **Check**: Do you have the latest Playwright version?
- **Solution**: Try [`npx playwright install`](../../../../npx playwright install) to update

**Issue 3**: Trace files are too large
- **Solution**: Use `'on-first-retry'` instead of `'on'`
- **Solution**: Clean up old traces regularly

## Verification Checklist

Mark each item as complete:

- [ ] Successfully configured tracing in [`playwright.config.ts`](../../../../playwright.config.ts)
- [ ] Generated trace files by running tests
- [ ] Opened and navigated the Trace Viewer interface
- [ ] Explored timeline, actions, DOM snapshots, network, and console tabs
- [ ] Used time-travel debugging to analyze test execution
- [ ] Created and analyzed a custom traceable test
- [ ] Experimented with advanced trace features
- [ ] Understood how to troubleshoot common trace issues

## Submission

**What to Submit**:
1. **Screenshot** of your trace viewer showing a successful trace
2. **Your custom test file** (`my-custom-trace.spec.ts`)
3. **Answers** to all questions in this exercise
4. **Brief reflection** (2-3 sentences) on how tracing will help your testing workflow

**Submission Format**:
```
Name: ____________________
Date: ____________________

Custom Test File: [Attach file]
Screenshot: [Attach image]

Reflection:
_________________________
_________________________
_________________________
```

## Next Steps

After completing this exercise, you'll be ready to:
- Use tracing effectively in your daily testing workflow
- Debug complex test failures using trace data
- Configure tracing appropriately for different environments
- Move on to **Lesson 05: Basic Locators and Element Selection**

## Additional Resources

- [Playwright Trace Viewer Documentation](https://playwright.dev/docs/trace-viewer)
- [Debugging Tests Guide](https://playwright.dev/docs/debug)
- [Test Configuration Options](https://playwright.dev/docs/test-configuration)