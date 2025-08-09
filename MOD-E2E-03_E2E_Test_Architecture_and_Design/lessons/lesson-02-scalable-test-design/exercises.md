# Exercises: Scalable Test Design

## Exercise 1: Refactor to an Independent Test

**Objective:** Refactor a set of dependent tests into independent, atomic tests.

**Instructions:**
1. Review the following "bad" example where tests depend on each other.
2. Rewrite the tests to be fully independent, using `test.beforeEach` to set up the necessary state for each test.

**Bad Example:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  let page;

  test('1. User logs in', async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/login');
    // ... login logic ...
    await expect(page).toHaveURL('/dashboard');
  });

  test('2. User navigates to profile', async () => {
    await page.click('text=Profile');
    await expect(page).toHaveURL('/profile');
  });

  test('3. User updates profile', async () => {
    await page.fill('#name', 'New Name');
    await page.click('button:has-text("Save")');
    await expect(page.locator('.notification')).toHaveText('Profile updated!');
  });
});
```

## Exercise 2: Create a Reusable Fixture

**Objective:** Create a custom Playwright fixture to provide an authenticated page context.

**Instructions:**
1. Create a new file `auth.fixture.ts`.
2. In this file, define a new fixture called `authenticatedPage`.
3. This fixture should:
   - Create a new page.
   - Navigate to the login page.
   - Perform the login operation.
   - Return the authenticated `page` object.
4. Refactor the tests from Exercise 1 to use your new `authenticatedPage` fixture.

## Exercise 3: Implement Data-Driven Testing

**Objective:** Convert a test to be data-driven.

**Instructions:**
1. You have a test that checks for invalid login attempts.
2. Currently, there is a separate test for each invalid credential pair.
3. Refactor this to be a single, data-driven test that iterates over a list of invalid credentials.

**Starting Code:**
```typescript
import { test, expect } from '@playwright/test';

test('Login with invalid username', async ({ page }) => {
  // ... login with invalid username ...
  await expect(page.locator('.error')).toHaveText('Invalid credentials');
});

test('Login with invalid password', async ({ page }) => {
  // ... login with invalid password ...
  await expect(page.locator('.error')).toHaveText('Invalid credentials');
});