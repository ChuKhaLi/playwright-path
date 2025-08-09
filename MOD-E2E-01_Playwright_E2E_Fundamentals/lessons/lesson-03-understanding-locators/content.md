# Lesson 3: Understanding Locators

## 1. What are Locators?

In Playwright, locators are the way we find elements on a page. Think of them as a set of instructions that tell Playwright how to find a specific button, input field, or any other element you want to interact with.

Using good locators is one of the most important skills in test automation. Good locators are:

-   **Resilient:** They don't break when the page's structure or styling changes.
-   **Readable:** They are easy to understand, making your tests easier to maintain.

## 2. Common Locator Strategies

Playwright provides several ways to locate elements. Here are some of the most common, in order of recommendation:

### a. User-Facing Locators

These are the best locators to use because they are the most resilient to change. They find elements the way a real user would.

-   **`page.getByRole(role, { name })`**: This is the best choice. It locates elements by their ARIA role, which is how assistive technologies like screen readers see the page. For example, `page.getByRole('button', { name: 'Sign in' })`.
-   **`page.getByText(text)`**: Locates an element by the text it contains.
-   **`page.getByLabel(text)`**: Finds a form control by its associated label text.

### b. Other Recommended Locators

-   **`page.getByPlaceholder(text)`**: Finds an input by its placeholder text.
-   **`page.getByAltText(text)`**: Finds an image by its `alt` text.
-   **`page.getByTitle(text)`**: Finds an element by its `title` attribute.
-   **`page.getByTestId(testId)`**: This is a great option if you can work with your development team to add `data-testid` attributes to the HTML. This makes your tests very robust.

### c. CSS and XPath Locators

You can also use CSS selectors and XPath expressions, but these should be your last resort. They are more brittle and can easily break if the HTML structure changes.

-   **`page.locator('css=selector')`** or **`page.locator('selector')`**: Finds an element using a CSS selector.
-   **`page.locator('xpath=expression')`**: Finds an element using an XPath expression.

## 3. Example

Let's look at our to-do list example again:

```typescript
await page.locator('.new-todo').fill('Buy milk');
```

This uses a CSS selector to find the element with the class `new-todo`. A better, more user-facing locator would be to use the placeholder text:

```typescript
await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
```

This is more resilient because the placeholder text is less likely to change than the CSS class.

## 4. Best Practices

-   **Prioritize user-facing locators.**
-   **Work with developers to add `data-testid` attributes for hard-to-find elements.**
-   **Avoid brittle locators like XPath and complex CSS selectors.**
-   **Use the Playwright Inspector to help you find the best locators.**