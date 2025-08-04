# Lesson 4: Assessment

## Knowledge Check

### Question 1
Which method should you use to type text into an input field, clearing its previous content?
a) `.type()`
b) `.fill()`
c) `.inputText()`
d) `.pressSequentially()`

**Answer:** b) `.fill()` is the standard method for setting the value of an input element.

---

### Question 2
How do you select an option from a `<select>` dropdown menu based on its visible text?
a) `locator.selectOption('Visible Text')`
b) `locator.selectOption({ text: 'Visible Text' })`
c) `locator.selectOption({ label: 'Visible Text' })`
d) `locator.click('Visible Text')`

**Answer:** c) You pass an object with the `label` property to `.selectOption()` to match by visible text.

---

### Question 3
What is the purpose of chaining locators, for example: `page.locator('.product').getByRole('button')`?
a) To make the code longer.
b) To find the first button on the page that happens to be near a product.
c) To find a button that is a descendant of an element with the class "product".
d) It is not valid syntax.

**Answer:** c) Chaining locators allows you to scope your search, finding child elements within a specific parent element, which makes tests more precise.

---

## Practical Exercise

### Task
1.  Go to the practice website `http://the-internet.herokuapp.com/`.
2.  Create a new test file named `interaction-practice.spec.ts`.
3.  Write a test that performs the following sequence of actions:
    - Click on the "Form Authentication" link.
    - Fill the "username" field with "tomsmith".
    - Fill the "password" field with "SuperSecretPassword!".
    - Click the "Login" button.
    - **Assertion:** Verify that a success message containing the text "You logged into a secure area!" is visible on the next page.
4.  Write a second test in the same file that interacts with the "Dropdown" page.
    - Click on the "Dropdown" link from the homepage.
    - Select "Option 2" from the dropdown menu.
    - **Assertion:** Verify that "Option 2" is now the selected option. (Hint: you can check the value of the select element).

### Expected Code
Your `interaction-practice.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Interacting with elements on the-internet.herokuapp.com', () => {

  test('should log in successfully', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/');
    await page.getByRole('link', { name: 'Form Authentication' }).click();

    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    const successMessage = page.locator('#flash');
    await expect(successMessage).toContainText('You logged into a secure area!');
  });

  test('should select an option from the dropdown', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/');
    await page.getByRole('link', { name: 'Dropdown' }).click();

    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption({ label: 'Option 2' });

    // Assert that the value of the select element is '2'
    await expect(dropdown).toHaveValue('2');
  });

});
```

This exercise provides hands-on practice with the most common interaction methods (`.click()`, `.fill()`, `.selectOption()`) and introduces a basic assertion to verify the outcome.