# Lesson 1: Advanced Locator Strategies and Patterns

## 1. Introduction: The Importance of Robust Locators

In test automation, locators are the bridge between your test script and the web page. A poorly written locator is a primary source of flaky tests—tests that fail intermittently without any changes to the application's functionality. As applications become more complex and dynamic, relying on simple CSS or XPath selectors is often not enough.

This lesson will teach you how to use Playwright's advanced locator features to create tests that are:
- **Resilient:** Less likely to break when the UI changes.
- **Readable:** Easy to understand what element is being targeted.
- **Maintainable:** Simple to update when the application evolves.

## 2. Beyond Basic Selectors: Playwright's Built-in Locators

Playwright strongly recommends using its built-in locators, which are designed to align with how users perceive a page. These locators are more resilient to DOM changes than traditional CSS or XPath selectors.

### `getByRole()`
This is the most preferred locator. It finds elements based on their ARIA role, which is how assistive technologies navigate the page.

```typescript
// Find a button with the accessible name "Login"
await page.getByRole('button', { name: 'Login' }).click();

// Find a heading with the text "Welcome"
await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
```

### `getByText()`
This locator finds elements containing specific text. It's useful for locating non-interactive elements like paragraphs or spans.

```typescript
// Find an element with the exact text "Product Details"
await expect(page.getByText('Product Details', { exact: true })).toBeVisible();

// Find an element containing the text "items in your cart"
await expect(page.getByText('items in your cart')).toBeVisible();
```

### `getByLabel()`
This finds form controls by their associated `<label>` text.

```typescript
// Find an input field with the label "Username"
await page.getByLabel('Username').fill('testuser');
```

### Other Useful Built-in Locators
- `getByPlaceholder()`: Finds an input by its placeholder text.
- `getByAltText()`: Finds an image by its `alt` text.
- `getByTitle()`: Finds an element by its `title` attribute.

## 3. Chaining Locators for Precision

You can chain locators to narrow down the search scope. This is a powerful technique for finding elements within a specific container.

Imagine a product card with a title and an "Add to Cart" button.

```html
<div class="product-card">
  <h2>Awesome T-Shirt</h2>
  <p>A really cool t-shirt.</p>
  <button>Add to Cart</button>
</div>
<div class="product-card">
  <h2>Cool Hat</h2>
  <p>A stylish hat.</p>
  <button>Add to Cart</button>
</div>
```

To click the "Add to Cart" button for the "Awesome T-Shirt", you can chain locators:

```typescript
const productCard = page.getByRole('heading', { name: 'Awesome T-Shirt' }).locator('..'); // Go up to the parent container
await productCard.getByRole('button', { name: 'Add to Cart' }).click();
```
A more robust way is to locate a container and then find the element within it.

```typescript
const tShirtCard = page.locator('.product-card', { hasText: 'Awesome T-Shirt' });
await tShirtCard.getByRole('button', { name: 'Add to Cart' }).click();
```

## 4. Filtering Locators

The `filter()` method allows you to refine a set of locators based on certain criteria. This is especially useful when dealing with lists of similar elements.

### `filter({ hasText: '...' })`
Selects elements that contain a specific text.

```typescript
// From a list of products, find the one with "Featured" text
const featuredProduct = page.getByRole('listitem').filter({ hasText: 'Featured' });
await featuredProduct.getByRole('button', { name: 'View Details' }).click();
```

### `filter({ has: locator })`
Selects elements that contain a specific sub-element.

```typescript
// From a list of articles, find the one that has an image with alt text "Playwright Logo"
const articles = page.getByRole('article');
const articleWithLogo = articles.filter({
  has: page.getByAltText('Playwright Logo'),
});
await expect(articleWithLogo).toBeVisible();
```

## 5. Relative Locators (Layout-Based Locators)

Playwright can find elements based on their visual position relative to other elements. This is extremely useful for stable selectors when DOM structure is complex or changes frequently.

- `rightOf(locator)`
- `leftOf(locator)`
- `above(locator)`
- `below(locator)`
- `near(locator)`

### Example
Imagine a form where labels are to the left of the input fields.

```html
<label for="email">Email:</label> <input id="email" type="text" />
<label for="password">Password:</label> <input id="password" type="password" />
```

You can locate the password input relative to its label:

```typescript
// Find the input field to the right of the "Password:" label
await page.locator('input').rightOf(page.getByText('Password:')).fill('s3cr3t');
```

This is more resilient than relying on `id` or `for` attributes, which might change.

## 6. Handling Lists and Dynamic Elements

When working with lists, you often need to interact with a specific item.

### `first()`, `last()`, `nth(index)`
These methods allow you to select a specific element from a list of matching locators.

```typescript
// Click the first "Delete" button on the page
await page.getByRole('button', { name: 'Delete' }).first().click();

// Get the text of the third list item
const thirdItemText = await page.getByRole('listitem').nth(2).textContent();

// Assert the last item in a list has a specific class
await expect(page.getByRole('listitem').last()).toHaveClass('active');
```

## 7. Summary and Best Practices

- **Prefer user-facing locators:** Use `getByRole`, `getByText`, and `getByLabel` whenever possible.
- **Chain locators for context:** Narrow down your search from a stable container element.
- **Use `filter()` for dynamic lists:** Refine your selection based on content or sub-elements.
- **Leverage relative locators:** Use layout-based locators when DOM structure is unreliable.
- **Avoid brittle selectors:** Minimize the use of long, complex CSS or XPath selectors that are tied to the DOM implementation.
- **Test your locators:** Use Playwright's `highlight()` method (`await page.locator('...').highlight()`) during debugging to visually confirm you are selecting the correct element.