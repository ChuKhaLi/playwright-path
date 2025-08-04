# Lesson 4: Interacting with Web Elements

## Learning Objectives
After completing this lesson, you will be able to:
- Perform click and fill actions on elements.
- Interact with checkboxes and radio buttons.
- Select options from dropdown menus.
- Differentiate between various click and input methods.
- Chain locators to find elements within other elements.

---

## 1. The Core Interactions: Click and Fill

The two most common actions you will perform are clicking and typing.

### Clicking Elements: `.click()`
The `.click()` method scrolls an element into view and clicks it in the center. Playwright's auto-waiting ensures the element is ready to be clicked.

```typescript
// Find a button by its role and accessible name, then click it
await page.getByRole('button', { name: 'Submit' }).click();

// Find a link by its text and click it
await page.getByText('Read more').click();
```

### Typing into Input Fields: `.fill()`
The `.fill()` method focuses an input element and fills it with the provided text. It clears any existing text in the input first.

```typescript
// Find an input by its label and fill it with text
await page.getByLabel('Email address').fill('test@example.com');

// Find an input by its placeholder and fill it
await page.getByPlaceholder('Enter your password').fill('S3cr3tP@ssw0rd');
```

**Note:** If you want to simulate typing key-by-key instead of filling the value instantly, you can use `locator.pressSequentially()`. This is useful for testing inputs that have special behavior on key presses.

## 2. Handling Checkboxes and Radio Buttons

Interacting with checkboxes and radio buttons is straightforward.

### Checkboxes: `.check()` and `.uncheck()`
- **`.check()`**: Ensures a checkbox is checked. If it's already checked, it does nothing.
- **`.uncheck()`**: Ensures a checkbox is unchecked.

```typescript
// Find a checkbox by its label and check it
await page.getByLabel('I agree to the terms').check();

// Assert that the checkbox is checked
await expect(page.getByLabel('I agree to the terms')).toBeChecked();

// Uncheck the checkbox
await page.getByLabel('I agree to the terms').uncheck();

// Assert that it is now unchecked
await expect(page.getByLabel('I agree to the terms')).not.toBeChecked();
```

### Radio Buttons
You interact with radio buttons in the same way, typically by finding them by their label and using `.check()`.

```typescript
// Select the "Yes" radio button
await page.getByLabel('Yes').check();

// Assert that "Yes" is selected
await expect(page.getByLabel('Yes')).toBeChecked();
```

## 3. Selecting from Dropdown Menus (`<select>`)

To handle `<select>` elements, you use the `.selectOption()` method.

```typescript
const selectElement = page.getByLabel('Choose a country');

// Select an option by its value attribute
await selectElement.selectOption('US');

// Select an option by its visible text (label)
await selectElement.selectOption({ label: 'Canada' });

// Select an option by its index
await selectElement.selectOption({ index: 2 });
```

You can select single or multiple options depending on the dropdown's configuration.

## 4. Other Useful Interactions

Playwright provides a rich set of interaction methods to simulate any user action.

- **`.dblclick()`**: Double-clicks an element.
- **`.hover()`**: Hovers the mouse over an element.
- **`.press()`**: Simulates a single key press, like `Enter` or `Tab`.
  ```typescript
  await page.getByLabel('Search').press('Enter');
  ```
- **`.focus()`**: Focuses an element.
- **`.blur()`**: Removes focus from an element.

## 5. Chaining and Filtering Locators

Sometimes, you need to find an element that is located inside another element. You can chain locators to narrow down your search.

Imagine you have a product card, and you want to click the "Add to Cart" button only for that specific product.

**HTML Example:**
```html
<div class="product-card">
  <h2>Awesome T-Shirt</h2>
  <p>A really cool t-shirt.</p>
  <button>Add to Cart</button>
</div>
<div class="product-card">
  <h2>Cool Hat</h2>
  <p>A really cool hat.</p>
  <button>Add to Cart</button>
</div>
```

**Playwright Test:**
```typescript
// 1. Locate the specific product card for the "Cool Hat"
const hatCard = page.locator('.product-card', { hasText: 'Cool Hat' });

// 2. Within that card, find the "Add to Cart" button and click it
await hatCard.getByRole('button', { name: 'Add to Cart' }).click();
```

Here, we first create a locator for the specific product card. Then, we chain another locator (`.getByRole()`) onto it to find the button *within* that card. This is a powerful technique for writing precise and readable tests.

You can also use `.filter()` for similar purposes.

---

## Summary

In this lesson, you learned how to perform the most common user interactions on a web page using Playwright. You can now click, type, check boxes, and select options. You also learned how to chain locators to interact with elements in a specific context. With these skills, you are now capable of automating a wide variety of user workflows. The next lesson will focus on how to verify the results of these actions using assertions.