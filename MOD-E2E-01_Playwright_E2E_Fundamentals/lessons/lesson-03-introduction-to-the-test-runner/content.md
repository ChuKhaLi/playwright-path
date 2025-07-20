# Introduction to the Test Runner

## Learning Objectives

By the end of this lesson, you will understand:
- How to structure tests using Playwright's test runner
- The purpose and usage of test hooks
- How to organize tests with describe blocks
- The execution order of hooks and tests
- Basic test modifiers for development workflow

## What is a Test Runner?

A test runner is a tool that executes your tests and provides feedback about their results. Playwright comes with its own built-in test runner that provides powerful features for organizing, running, and reporting on your tests.

Think of the test runner as the conductor of an orchestra - it coordinates when each test runs, ensures proper setup and cleanup, and reports the results in an organized way.

## The `test()` Function

The [`test()`](../examples/test-runner-demo.spec.ts:5) function is the foundation of every Playwright test. It's equivalent to the `it()` function you might know from other testing frameworks like Jest or Mocha.

### Basic Syntax

```typescript
import { test, expect } from '@playwright/test';

test('should have a descriptive name', async ({ page }) => {
  // Your test code goes here
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
});
```

### Key Points About the `test()` Function

1. **Descriptive Names**: Always use clear, descriptive names that explain what the test does
2. **Async/Await**: Playwright tests are asynchronous, so use `async` and `await`
3. **Page Fixture**: The `{ page }` parameter is a fixture that provides a browser page for testing
4. **Assertions**: Use `expect()` to verify that your application behaves as expected

## Organizing Tests with `describe()`

The [`describe()`](../examples/test-runner-demo.spec.ts:3) function helps you group related tests together. This makes your test suite more organized and easier to understand.

### Basic Usage

```typescript
import { test, expect, describe } from '@playwright/test';

describe('User Authentication', () => {
  test('should allow user to log in with valid credentials', async ({ page }) => {
    // Login test code
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Invalid login test code
  });

  test('should allow user to log out', async ({ page }) => {
    // Logout test code
  });
});
```

### Benefits of Using `describe()`

- **Organization**: Groups related tests together
- **Readability**: Makes test reports easier to understand
- **Scoped Hooks**: Hooks can be applied to specific groups of tests
- **Parallel Execution**: Playwright can run describe blocks in parallel

## Test Hooks: Setup and Cleanup

Test hooks are functions that run at specific points during test execution. They help you set up test conditions and clean up afterward.

### Types of Hooks

#### `beforeEach()` Hook

Runs **before each individual test** in the describe block:

```typescript
import { test, expect, describe, beforeEach } from '@playwright/test';

describe('Shopping Cart Tests', () => {
  beforeEach(async ({ page }) => {
    // This runs before EVERY test in this describe block
    await page.goto('https://example-shop.com');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="submit-login"]');
  });

  test('should add item to cart', async ({ page }) => {
    // User is already logged in thanks to beforeEach
    await page.click('[data-testid="add-to-cart"]');
    // Test continues...
  });
});
```

#### `afterEach()` Hook

Runs **after each individual test** in the describe block:

```typescript
describe('File Upload Tests', () => {
  afterEach(async ({ page }) => {
    // Clean up uploaded files after each test
    await page.click('[data-testid="delete-all-files"]');
    console.log('Cleaned up test files');
  });

  test('should upload a single file', async ({ page }) => {
    // Upload test code
  });
});
```

#### `beforeAll()` Hook

Runs **once before all tests** in the describe block:

```typescript
describe('Database Tests', () => {
  beforeAll(async () => {
    // This runs ONCE before all tests in this describe block
    console.log('Setting up test database...');
    // Database setup code would go here
  });

  test('should create a user', async ({ page }) => {
    // Test code
  });

  test('should update user profile', async ({ page }) => {
    // Test code
  });
});
```

#### `afterAll()` Hook

Runs **once after all tests** in the describe block:

```typescript
describe('API Tests', () => {
  afterAll(async () => {
    // This runs ONCE after all tests in this describe block
    console.log('Cleaning up test data...');
    // Cleanup code would go here
  });

  test('should create API resource', async ({ page }) => {
    // Test code
  });

  test('should delete API resource', async ({ page }) => {
    // Test code
  });
});
```

## Understanding Execution Order

Understanding when hooks run is crucial for writing reliable tests. Here's the execution order:

```
1. beforeAll() - runs once at the start
2. beforeEach() - runs before first test
3. test() - first test executes
4. afterEach() - runs after first test
5. beforeEach() - runs before second test
6. test() - second test executes
7. afterEach() - runs after second test
8. ... (pattern repeats for each test)
9. afterAll() - runs once at the end
```

### Visual Example

```typescript
describe('Execution Order Demo', () => {
  beforeAll(() => {
    console.log('1. beforeAll - I run once at the start');
  });

  beforeEach(() => {
    console.log('2. beforeEach - I run before each test');
  });

  afterEach(() => {
    console.log('4. afterEach - I run after each test');
  });

  afterAll(() => {
    console.log('5. afterAll - I run once at the end');
  });

  test('first test', () => {
    console.log('3a. First test is running');
  });

  test('second test', () => {
    console.log('3b. Second test is running');
  });
});
```

**Console Output:**
```
1. beforeAll - I run once at the start
2. beforeEach - I run before each test
3a. First test is running
4. afterEach - I run after each test
2. beforeEach - I run before each test
3b. Second test is running
4. afterEach - I run after each test
5. afterAll - I run once at the end
```

## Test Modifiers

Test modifiers help you control which tests run during development and debugging.

### `.skip` Modifier

Use `.skip` to temporarily disable a test:

```typescript
test.skip('should handle complex scenario', async ({ page }) => {
  // This test will be skipped and won't run
  // Useful when a test is broken or not ready
});

// You can also skip entire describe blocks
describe.skip('Feature under development', () => {
  test('should work eventually', async ({ page }) => {
    // All tests in this describe block will be skipped
  });
});
```

### `.only` Modifier

Use `.only` to run only specific tests:

```typescript
test.only('should focus on this test', async ({ page }) => {
  // Only this test will run, all others will be skipped
  // Great for debugging a specific test
});

// You can also use only on describe blocks
describe.only('Critical feature tests', () => {
  test('should run this test', async ({ page }) => {
    // This will run
  });
});

test('should be skipped', async ({ page }) => {
  // This won't run because of the .only above
});
```

### When to Use Modifiers

- **`.skip`**: When a test is temporarily broken or a feature isn't ready
- **`.only`**: When debugging specific tests or working on a particular feature
- **Remember**: Remove modifiers before committing code to version control

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// ❌ Bad: Vague and unclear
test('login test', async ({ page }) => {
  // What exactly does this test?
});

// ✅ Good: Clear and specific
test('should display error message when login fails with invalid password', async ({ page }) => {
  // Clear what this test verifies
});
```

### 2. Keep Tests Independent

```typescript
// ❌ Bad: Tests depend on each other
describe('User Management', () => {
  test('should create user', async ({ page }) => {
    // Creates user "john@example.com"
  });

  test('should update user', async ({ page }) => {
    // Assumes "john@example.com" exists from previous test
  });
});

// ✅ Good: Each test is independent
describe('User Management', () => {
  beforeEach(async ({ page }) => {
    // Set up a fresh user for each test
    await createTestUser('john@example.com');
  });

  test('should create user', async ({ page }) => {
    // Test user creation independently
  });

  test('should update user', async ({ page }) => {
    // Test user update with known user from beforeEach
  });
});
```

### 3. Use Hooks Appropriately

```typescript
// ✅ Good: Use beforeEach for test-specific setup
describe('Shopping Cart', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await loginAsTestUser(page);
  });

  // ✅ Good: Use beforeAll for expensive setup
  beforeAll(async () => {
    await setupTestDatabase();
  });
});
```

## Common Patterns

### Pattern 1: Authentication Setup

```typescript
describe('Authenticated User Features', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should access user profile', async ({ page }) => {
    await page.click('[data-testid="profile-link"]');
    await expect(page).toHaveURL('/profile');
  });
});
```

### Pattern 2: Data Cleanup

```typescript
describe('Data Management Tests', () => {
  afterEach(async ({ page }) => {
    // Clean up any test data created during the test
    await page.goto('/admin/cleanup');
    await page.click('[data-testid="delete-test-data"]');
  });

  test('should create new record', async ({ page }) => {
    // Test creates data that gets cleaned up by afterEach
  });
});
```

## Summary

In this lesson, you learned:

- The [`test()`](../examples/test-runner-demo.spec.ts:5) function is the foundation of Playwright tests
- [`describe()`](../examples/test-runner-demo.spec.ts:3) blocks help organize related tests
- Test hooks ([`beforeEach`](../examples/test-runner-demo.spec.ts:8), [`afterEach`](../examples/test-runner-demo.spec.ts:12), [`beforeAll`](../examples/test-runner-demo.spec.ts:16), [`afterAll`](../examples/test-runner-demo.spec.ts:20)) provide setup and cleanup capabilities
- The execution order of hooks and tests follows a predictable pattern
- Test modifiers (`.skip`, `.only`) help control test execution during development

Understanding these concepts is essential for writing well-organized, maintainable test suites. In the next lesson, we'll explore how to interact with web elements using Playwright's powerful locator system.

## Next Steps

1. Complete the hands-on exercise to practice using hooks
2. Take the assessment quiz to test your understanding
3. Move on to the next lesson about locators and element interactions