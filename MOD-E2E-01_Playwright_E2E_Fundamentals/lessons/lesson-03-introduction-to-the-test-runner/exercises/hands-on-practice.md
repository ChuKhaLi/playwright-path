# Hands-On Practice: Test Runner and Hooks

## Exercise Overview

In this exercise, you'll create your own test file to practice using Playwright's test runner structure, hooks, and understand the execution order. This hands-on practice will reinforce the concepts learned in the lesson content.

## Prerequisites

- Completed Lesson 01 (Playwright Installation and Setup)
- Completed Lesson 02 (Project Structure and Configuration)
- Read through the lesson content on test runner concepts

## Exercise Instructions

### Part 1: Create a Basic Test Structure

1. **Create a new test file** in your Playwright project:
   - File name: `test-runner-practice.spec.ts`
   - Location: In your `tests/` directory

2. **Write a basic test structure** with the following requirements:
   - Import necessary functions from `@playwright/test`
   - Create a [`describe()`](../content.md:35) block named "Test Runner Practice"
   - Add two [`test()`](../content.md:15) functions with descriptive names
   - Each test should navigate to `https://example.com` and verify the page title

### Part 2: Add Test Hooks

3. **Add all four types of hooks** to your describe block:
   - [`beforeAll()`](../content.md:16): Add a console.log message "Setting up test suite"
   - [`beforeEach()`](../content.md:8): Add a console.log message "Preparing individual test"
   - [`afterEach()`](../content.md:12): Add a console.log message "Cleaning up after test"
   - [`afterAll()`](../content.md:20): Add a console.log message "Tearing down test suite"

4. **Observe the execution order** by running your tests and checking the console output.

### Part 3: Practice Test Organization

5. **Create nested describe blocks** to organize your tests:
   - Main describe block: "Website Navigation Tests"
   - Nested describe block 1: "Homepage Tests"
   - Nested describe block 2: "Page Content Tests"
   - Add at least one test in each nested block

### Part 4: Experiment with Test Modifiers

6. **Practice using test modifiers**:
   - Add a test with [`.skip`](../content.md:85) modifier
   - Temporarily add [`.only`](../content.md:89) to one test and observe the behavior
   - Remove the `.only` modifier before completing the exercise

## Expected File Structure

Your completed test file should look similar to this structure:

```typescript
import { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@playwright/test';

describe('Test Runner Practice', () => {
  beforeAll(async () => {
    // Your beforeAll code here
  });

  beforeEach(async ({ page }) => {
    // Your beforeEach code here
  });

  afterEach(async ({ page }) => {
    // Your afterEach code here
  });

  afterAll(async () => {
    // Your afterAll code here
  });

  describe('Homepage Tests', () => {
    test('should load homepage successfully', async ({ page }) => {
      // Your test code here
    });
  });

  describe('Page Content Tests', () => {
    test('should display correct page content', async ({ page }) => {
      // Your test code here
    });

    test.skip('should handle complex interaction', async ({ page }) => {
      // Skipped test code here
    });
  });
});
```

## Verification Steps

After completing your test file:

1. **Run your tests** using the command:
   ```bash
   npx playwright test test-runner-practice.spec.ts
   ```

2. **Check the console output** to verify the execution order matches what you learned:
   - beforeAll runs once at the start
   - beforeEach runs before each test
   - Tests execute in order
   - afterEach runs after each test
   - afterAll runs once at the end

3. **Verify test results** show:
   - All non-skipped tests pass
   - Skipped tests are marked as skipped in the report
   - Console messages appear in the correct order

## Expected Learning Outcomes

By completing this exercise, you should be able to:

- ✅ Create properly structured Playwright tests using [`test()`](../content.md:15) and [`describe()`](../content.md:35)
- ✅ Implement all four types of hooks correctly
- ✅ Understand and predict the execution order of hooks and tests
- ✅ Organize tests using nested describe blocks
- ✅ Use test modifiers for development workflow control

## Troubleshooting Tips

### Common Issues and Solutions

**Issue**: Tests fail with "Cannot find module '@playwright/test'"
- **Solution**: Ensure Playwright is installed in your project (`npm install @playwright/test`)

**Issue**: Console messages don't appear in the expected order
- **Solution**: Check that your hooks are placed inside the correct describe blocks

**Issue**: Skipped tests still run
- **Solution**: Verify you're using `test.skip()` not just `test()`

**Issue**: Page navigation fails
- **Solution**: Ensure you're using `await` with all async operations

## Extension Challenges

If you complete the basic exercise quickly, try these additional challenges:

### Challenge 1: Multiple Describe Blocks
Create multiple top-level describe blocks and observe how hooks work across different groups.

### Challenge 2: Hook Cleanup
Add actual cleanup logic in your `afterEach` hook, such as clearing browser storage:
```typescript
afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

### Challenge 3: Conditional Test Execution
Research and implement conditional test execution based on environment variables.

## Submission Guidelines

When you've completed the exercise:

1. **Save your test file** as `test-runner-practice.spec.ts`
2. **Run the tests** and take a screenshot of the console output showing the execution order
3. **Verify all tests pass** (except the intentionally skipped ones)
4. **Review your code** to ensure it follows the patterns shown in the lesson

## Next Steps

After completing this exercise:
- Move on to the assessment quiz to test your understanding
- Proceed to the next lesson on locators and element interactions
- Keep your practice file as a reference for future test development

Remember: The goal is to understand the test runner structure and execution flow. Don't worry if your first attempt isn't perfect - practice makes perfect!