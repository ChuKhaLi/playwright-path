# Lesson 8: Working with Test Data

## Learning Objectives
After completing this lesson, you will be able to:
- Understand the importance of separating test data from test logic.
- Create and use JSON files to store test data (fixtures).
- Import JSON data into your TypeScript test files.
- Loop through data to create data-driven tests.
- Structure your project to include test data files.

---

## 1. Why Separate Test Data?

Hardcoding data directly into your tests is a common anti-pattern.

**Bad Example (Hardcoded Data):**
```typescript
test('should log in with a standard user', async ({ page }) => {
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  // ... assertions
});
```

This approach has several problems:
- **Maintenance Nightmare:** If the credentials change, you have to update them in every test that uses them.
- **Poor Reusability:** It's difficult to run the same test with different users (e.g., a standard user, a locked-out user, a performance user).
- **Reduced Readability:** The test logic is cluttered with data values.

By separating data, we make our tests cleaner, more maintainable, and more powerful.

## 2. Using JSON Files for Test Data

A great way to store test data is in JSON (JavaScript Object Notation) files. JSON is easy for both humans and machines to read and write.

### Step 1: Create a Data File
1.  Create a new folder in your project root named `test-data`.
2.  Inside `test-data`, create a new file named `users.json`.

### Step 2: Add Data to the JSON File
Open `users.json` and add the following content:

```json
[
  {
    "username": "standard_user",
    "password": "secret_sauce",
    "description": "A standard, valid user"
  },
  {
    "username": "locked_out_user",
    "password": "secret_sauce",
    "description": "A user who should not be able to log in"
  },
  {
    "username": "problem_user",
    "password": "secret_sauce",
    "description": "A user who experiences performance issues"
  }
]
```
We've created an array of user objects, each with a username, password, and description.

## 3. Importing and Using JSON Data in Tests

Now, let's refactor our login test to use this external data file.

```typescript
import { test, expect } from '@playwright/test';
// Import the JSON data
import users from '../../test-data/users.json';

test('should log in with a standard user from JSON file', async ({ page }) => {
  // Find the standard user from our imported data
  const standardUser = users.find(user => user.username === 'standard_user');

  // Ensure the user was found before proceeding
  if (!standardUser) {
    throw new Error('Standard user not found in test data');
  }

  await page.goto('https://www.saucedemo.com/');
  
  // Use the data from the user object
  await page.getByPlaceholder('Username').fill(standardUser.username);
  await page.getByPlaceholder('Password').fill(standardUser.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
```

**Explanation:**
- **`import users from '../../test-data/users.json';`**: We import the entire JSON file. TypeScript automatically parses it into a JavaScript array of objects.
- **`users.find(...)`**: We use the standard JavaScript `find` method to get the specific user object we need for this test.
- **`standardUser.username`** and **`standardUser.password`**: We access the properties of the user object to fill the form fields.

This test is now much cleaner. The test logic is focused on the *actions* of logging in, while the *data* is managed elsewhere.

## 4. Creating Data-Driven Tests

The real power of external data comes from creating **data-driven tests**. We can write a single test block and have Playwright run it multiple times, once for each entry in our data set.

We can do this by simply looping through our imported data.

```typescript
import { test, expect } from '@playwright/test';
import users from '../../test-data/users.json';

test.describe('SauceDemo Login', () => {
  // Loop through each user in the JSON file
  for (const user of users) {
    
    // Create a dynamic test name
    test(`should handle login for ${user.description}`, async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');

      await page.getByPlaceholder('Username').fill(user.username);
      await page.getByPlaceholder('Password').fill(user.password);
      await page.getByRole('button', { name: 'Login' }).click();

      // Add conditional logic based on the user type
      if (user.username === 'standard_user') {
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      } else if (user.username === 'locked_out_user') {
        const errorMessage = page.getByText('Epic sadface: Sorry, this user has been locked out.');
        await expect(errorMessage).toBeVisible();
      }
      // You could add more conditions for other user types
    });
  }
});
```

Now, when you run `npx playwright test`, Playwright will generate and run three separate tests:
- `should handle login for A standard, valid user`
- `should handle login for A user who should not be able to log in`
- `should handle login for A user who experiences performance issues`

This is an incredibly efficient way to increase your test coverage with minimal code duplication.

---

## Summary

In this lesson, you learned the importance of managing test data effectively. You can now create and use JSON files to store data, import that data into your tests, and create powerful data-driven tests by looping through your data sets. This practice is fundamental to building a scalable and maintainable test automation suite.