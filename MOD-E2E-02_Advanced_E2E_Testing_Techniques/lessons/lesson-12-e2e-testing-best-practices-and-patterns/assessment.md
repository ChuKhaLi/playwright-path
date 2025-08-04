# Assessment: E2E Testing Best Practices and Patterns

## Knowledge Check

### Question 1
According to the Test Pyramid, which type of test should you have the most of in your test suite?
a) E2E Tests
b) Integration Tests
c) Unit Tests
d) Manual Tests

**Answer:** c) Unit Tests

---

### Question 2
What are the three phases of the Arrange-Act-Assert (AAA) pattern?
a) Assemble, Action, Affirm
b) Arrange, Act, Assert
c) Acknowledge, Activate, Announce
d) Allocate, Apply, Analyze

**Answer:** b) Arrange, Act, Assert

---

### Question 3
Which of the following is a key principle for writing independent and isolated tests?
a) Making sure each test logs into the application through the UI.
b) Having tests that depend on the successful completion of previous tests.
c) Using `beforeEach` and `afterEach` hooks to set up and tear down state for each test.
d) Storing data from one test in a global variable to be used by another test.

**Answer:** c) Using `beforeEach` and `afterEach` hooks to set up and tear down state for each test.

---

### Question 4
Which type of locator is generally the most robust and user-facing?
a) A complex CSS selector based on the DOM structure.
b) An XPath selector.
c) A locator based on `getByRole`, `getByLabel`, or `getByText`.
d) A locator based on the element's class name.

**Answer:** c) A locator based on `getByRole`, `getByLabel`, or `getByText`.

---

## Practical Application

### Scenario
You are given a poorly written test for a "Forgot Password" feature. The test is hard to read, uses brittle selectors, and doesn't follow best practices.

**Original Bad Test:**
```typescript
test('pwd reset', async ({ page }) => {
  await page.goto('/login');
  await page.locator('a.forgot-password-link').click();
  await page.locator('#email_field').fill('test@example.com');
  await page.locator('form > button.submit').click();
  const successDiv = page.locator('div.success-message');
  await expect(successDiv).toHaveText('Password reset link sent');
});
```

### Task
Refactor the provided test to apply the best practices learned in this lesson.
1.  **Improve Naming:** Give the test a descriptive title.
2.  **Use Better Locators:** Replace the CSS selectors with user-facing locators (`getByRole`, `getByLabel`, etc.).
3.  **Apply AAA Pattern:** Add comments (`// Arrange`, `// Act`, `// Assert`) to clearly structure the test into the three phases.
4.  **Add Organization:** Wrap the test in a `test.describe` block named "Forgot Password Flow".
5.  **Add Annotation:** Add a tag of `@authentication` to the test.

Provide the complete, refactored TypeScript code for the test.