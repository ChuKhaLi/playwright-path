# Interacting with Web Elements

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Master Basic Interactions**: Use [`click()`](../examples/element-interactions.spec.ts:15), [`fill()`](../examples/element-interactions.spec.ts:25), [`type()`](../examples/element-interactions.spec.ts:35), and other fundamental interaction methods
2. **Handle Form Elements**: Work with checkboxes, radio buttons, select dropdowns, and file uploads effectively
3. **Perform Advanced Actions**: Implement keyboard shortcuts, drag-and-drop, and complex user interactions
4. **Validate Element States**: Check visibility, enabled states, content, and attributes systematically
5. **Handle Dynamic Content**: Work with elements that change based on user actions or loading states
6. **Apply Best Practices**: Choose optimal interaction methods and handle edge cases reliably

## Introduction to Element Interactions

Element interactions are the heart of E2E testing - they simulate real user actions to verify that your application behaves correctly. Think of interactions as the bridge between finding elements (locators) and verifying outcomes (assertions).

### Why Proper Interactions Matter

Effective element interactions ensure that your tests:

- **Mirror Real User Behavior**: Tests should interact with elements the same way users do
- **Handle Edge Cases**: Account for loading states, disabled elements, and dynamic content
- **Provide Reliable Feedback**: Consistent interactions lead to trustworthy test results
- **Maintain Performance**: Efficient interactions keep test execution times reasonable

### The Interaction Lifecycle

Every element interaction follows a predictable pattern:

1. **Locate the Element**: Use locators to find the target element
2. **Wait for Readiness**: Ensure the element is in the correct state for interaction
3. **Perform the Action**: Execute the specific interaction method
4. **Validate the Result**: Verify that the interaction had the expected effect

## Basic Interaction Methods

### Clicking Elements

The [`click()`](../examples/element-interactions.spec.ts:15) method is the most fundamental interaction, simulating mouse clicks on elements.

```typescript
// Basic click on a button
await page.getByRole('button', { name: 'Submit' }).click();

// Click on a link
await page.getByRole('link', { name: 'Home' }).click();

// Click with options
await page.getByRole('button', { name: 'Menu' }).click({
  button: 'right',    // Right-click for context menu
  clickCount: 2,      // Double-click
  delay: 100,         // Add delay between mousedown and mouseup
  force: true,        // Click even if element is not visible
  position: { x: 10, y: 10 } // Click at specific coordinates
});
```

**When to Use Click:**
- Buttons, links, and interactive elements
- Menu items and navigation elements
- Checkboxes and radio buttons (though specific methods are preferred)
- Any element that responds to mouse clicks

**Best Practices for Clicking:**
- Use semantic locators like `getByRole()` for better reliability
- Avoid `force: true` unless absolutely necessary
- Consider using specific methods for form elements

### Filling Text Fields

The [`fill()`](../examples/element-interactions.spec.ts:25) method clears existing content and enters new text, while [`type()`](../examples/element-interactions.spec.ts:35) preserves existing content.

```typescript
// Fill input field (clears existing content)
await page.getByLabel('Email').fill('user@example.com');

// Type text (preserves existing content)
await page.getByLabel('Comments').type('Additional information');

// Fill with special handling
await page.getByLabel('Password').fill('secret123', {
  timeout: 5000,      // Custom timeout
  noWaitAfter: true   // Don't wait for navigation after filling
});

// Clear a field
await page.getByLabel('Search').fill('');
```

**Difference Between `fill()` and `type()`:**
- **`fill()`**: Clears the field first, then enters text (faster, recommended for most cases)
- **`type()`**: Types character by character, preserving existing content (slower, useful for specific scenarios)

**When to Use Each:**
- **Use `fill()`** for: Form fields, search boxes, text areas (most common)
- **Use `type()`** for: Appending text, simulating real typing behavior, testing character-by-character validation

### Keyboard Interactions

The [`press()`](../examples/element-interactions.spec.ts:45) method simulates keyboard input, including special keys and combinations.

```typescript
// Press individual keys
await page.getByLabel('Search').press('Enter');
await page.press('body', 'Escape'); // Press Escape on the page

// Keyboard shortcuts
await page.press('body', 'Control+A'); // Select all
await page.press('body', 'Control+C'); // Copy
await page.press('body', 'Control+V'); // Paste

// Navigation keys
await page.press('body', 'Tab');       // Tab to next element
await page.press('body', 'Shift+Tab'); // Tab to previous element
await page.press('body', 'ArrowDown'); // Arrow key navigation

// Function keys
await page.press('body', 'F5');        // Refresh page
await page.press('body', 'F12');       // Open developer tools
```

**Common Key Combinations:**
- `Control+A` / `Meta+A` (Mac): Select all
- `Control+C` / `Meta+C` (Mac): Copy
- `Control+V` / `Meta+V` (Mac): Paste
- `Control+Z` / `Meta+Z` (Mac): Undo
- `Control+S` / `Meta+S` (Mac): Save

## Form Element Interactions

### Checkboxes and Radio Buttons

Checkboxes and radio buttons have specialized methods for better semantic interaction.

```typescript
// Checkbox interactions
const agreeCheckbox = page.getByLabel('I agree to the terms');

// Check a checkbox
await agreeCheckbox.check();

// Uncheck a checkbox
await agreeCheckbox.uncheck();

// Set checkbox state conditionally
await agreeCheckbox.setChecked(true);  // Check
await agreeCheckbox.setChecked(false); // Uncheck

// Radio button interactions
await page.getByLabel('Credit Card').check();
await page.getByLabel('PayPal').check();

// Verify checkbox/radio state
await expect(agreeCheckbox).toBeChecked();
await expect(page.getByLabel('PayPal')).toBeChecked();
```

**Best Practices:**
- Use `check()` and `uncheck()` for explicit state changes
- Use `setChecked()` when the desired state is determined programmatically
- Always verify the state after interaction

### Select Dropdowns

Select elements have multiple ways to choose options, providing flexibility for different scenarios.

```typescript
const countrySelect = page.getByLabel('Country');

// Select by visible text
await countrySelect.selectOption('United States');

// Select by value attribute
await countrySelect.selectOption({ value: 'us' });

// Select by index (0-based)
await countrySelect.selectOption({ index: 1 });

// Select multiple options (for multi-select)
await countrySelect.selectOption(['us', 'ca', 'mx']);

// Select by label (alternative to visible text)
await countrySelect.selectOption({ label: 'United States' });

// Verify selected option
await expect(countrySelect).toHaveValue('us');
await expect(countrySelect).toHaveText('United States');
```

**Selection Strategies:**
- **By text**: Most readable and user-centric
- **By value**: Reliable when text might change
- **By index**: Useful for programmatic selection
- **By label**: Alternative when text matching is complex

### File Uploads

File upload interactions require special handling to simulate file selection.

```typescript
// Upload a single file
await page.getByLabel('Upload Document').setInputFiles('path/to/document.pdf');

// Upload multiple files
await page.getByLabel('Upload Images').setInputFiles([
  'path/to/image1.jpg',
  'path/to/image2.png'
]);

// Upload from buffer (for dynamic content)
await page.getByLabel('Upload Data').setInputFiles({
  name: 'data.json',
  mimeType: 'application/json',
  buffer: Buffer.from('{"key": "value"}')
});

// Clear file selection
await page.getByLabel('Upload Document').setInputFiles([]);

// Verify file upload
const fileInput = page.getByLabel('Upload Document');
await expect(fileInput).toHaveValue(/document\.pdf$/);
```

**File Upload Best Practices:**
- Use relative paths from your test directory
- Test both single and multiple file uploads
- Verify file selection before form submission
- Handle file upload progress and completion states

## Advanced Interactions

### Hover and Focus

Hover and focus interactions are essential for testing interactive UI elements and accessibility.

```typescript
// Hover over elements
await page.getByRole('button', { name: 'Menu' }).hover();

// Hover to reveal dropdown menus
await page.getByText('Products').hover();
await page.getByText('Software').click(); // Click revealed menu item

// Focus on elements
await page.getByLabel('Email').focus();

// Focus and verify focus state
const emailInput = page.getByLabel('Email');
await emailInput.focus();
await expect(emailInput).toBeFocused();

// Hover with options
await page.getByText('Tooltip Trigger').hover({
  position: { x: 10, y: 10 }, // Hover at specific position
  timeout: 5000,              // Custom timeout
  trial: true                 // Don't actually hover, just check if possible
});
```

**Use Cases for Hover:**
- Dropdown menus that appear on hover
- Tooltips and help text
- Image galleries with hover effects
- Navigation menus with sub-menus

**Use Cases for Focus:**
- Keyboard navigation testing
- Form field validation triggers
- Accessibility testing
- Custom focus indicators

### Drag and Drop

Drag and drop interactions simulate complex user gestures for reordering and organizing content.

```typescript
// Basic drag and drop
await page.getByText('Item 1').dragTo(page.getByText('Drop Zone'));

// Drag and drop with precise control
const source = page.getByTestId('draggable-item');
const target = page.getByTestId('drop-target');

await source.hover(); // Start hover
await page.mouse.down(); // Press mouse button
await target.hover(); // Move to target
await page.mouse.up(); // Release mouse button

// Drag and drop in lists (reordering)
await page.getByText('Task 1').dragTo(page.getByText('Task 3'));

// Verify drag and drop result
const taskList = page.getByTestId('task-list');
await expect(taskList.locator('li').first()).toHaveText('Task 3');
```

**Drag and Drop Scenarios:**
- Reordering lists and tables
- File uploads via drag and drop
- Kanban boards and project management tools
- Image galleries and media organization

### Context Menus and Double Clicks

Advanced click interactions for specialized user interface patterns.

```typescript
// Right-click for context menu
await page.getByText('File Name').click({ button: 'right' });
await page.getByText('Delete').click();

// Double-click interactions
await page.getByText('Folder Name').dblclick();

// Double-click with options
await page.getByText('Editable Text').dblclick({
  delay: 100,     // Delay between clicks
  timeout: 5000   // Custom timeout
});

// Middle-click (wheel button)
await page.getByRole('link', { name: 'External Link' }).click({ 
  button: 'middle' 
});
```

## Element State Validation

### Visibility and Presence

Understanding the difference between element presence and visibility is crucial for reliable tests.

```typescript
// Check if element is visible to users
await expect(page.getByText('Welcome Message')).toBeVisible();

// Check if element is hidden
await expect(page.getByText('Error Message')).toBeHidden();

// Check if element exists in DOM (but might not be visible)
await expect(page.getByTestId('hidden-data')).toBeAttached();

// Check if element doesn't exist in DOM
await expect(page.getByText('Deleted Item')).not.toBeAttached();

// Wait for element to become visible
await page.getByText('Loading...').waitFor({ state: 'hidden' });
await page.getByText('Content Loaded').waitFor({ state: 'visible' });
```

**Visibility States:**
- **Visible**: Element is displayed and can be interacted with
- **Hidden**: Element exists but is not visible (CSS `display: none`, `visibility: hidden`)
- **Attached**: Element exists in the DOM
- **Detached**: Element has been removed from the DOM

### Interaction States

Validating whether elements can be interacted with prevents test failures and provides better feedback.

```typescript
// Check if element is enabled for interaction
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

// Check if element is disabled
await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();

// Check if element is editable
await expect(page.getByLabel('Comments')).toBeEditable();

// Check if element is readonly
await expect(page.getByLabel('Generated ID')).not.toBeEditable();

// Wait for element to become enabled
await page.getByRole('button', { name: 'Continue' }).waitFor({ 
  state: 'attached' 
});
await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
```

### Content and Value Validation

Verifying element content ensures that interactions have the expected results.

```typescript
// Check text content
await expect(page.getByTestId('status')).toHaveText('Success');
await expect(page.getByTestId('counter')).toHaveText(/\d+ items/);

// Check input values
await expect(page.getByLabel('Email')).toHaveValue('user@example.com');
await expect(page.getByLabel('Age')).toHaveValue('25');

// Check attributes
await expect(page.getByRole('link')).toHaveAttribute('href', '/dashboard');
await expect(page.getByTestId('image')).toHaveAttribute('alt', 'Profile picture');

// Check CSS classes
await expect(page.getByTestId('notification')).toHaveClass('success');
await expect(page.getByTestId('form-field')).toHaveClass(/error/);

// Check CSS properties
await expect(page.getByTestId('modal')).toHaveCSS('display', 'block');
await expect(page.getByTestId('button')).toHaveCSS('background-color', 'rgb(0, 123, 255)');
```

## Handling Dynamic Content

### Waiting for Elements

Dynamic content requires careful timing to ensure elements are ready for interaction.

```typescript
// Wait for element to appear
await page.getByText('Dynamic Content').waitFor();

// Wait for element to disappear
await page.getByText('Loading...').waitFor({ state: 'hidden' });

// Wait for element with timeout
await page.getByText('Slow Loading').waitFor({ 
  timeout: 10000 
});

// Wait for element to be stable (not moving)
await page.getByTestId('animated-element').waitFor({ 
  state: 'visible' 
});

// Custom wait conditions
await page.waitForFunction(() => {
  const element = document.querySelector('[data-testid="counter"]');
  return element && parseInt(element.textContent) > 10;
});
```

### Handling Loading States

Many modern applications have loading states that need special handling.

```typescript
// Wait for loading to complete
await page.getByText('Loading...').waitFor({ state: 'hidden' });
await page.getByText('Data loaded successfully').waitFor();

// Handle skeleton loading
await page.getByTestId('skeleton-loader').waitFor({ state: 'hidden' });
await page.getByTestId('actual-content').waitFor();

// Wait for network requests to complete
await page.waitForLoadState('networkidle');

// Handle progressive loading
const loadMoreButton = page.getByRole('button', { name: 'Load More' });
while (await loadMoreButton.isVisible()) {
  await loadMoreButton.click();
  await page.waitForTimeout(1000); // Wait for content to load
}
```

## Best Practices and Performance

### Choosing the Right Interaction Method

Different scenarios call for different interaction approaches:

```typescript
// ✅ Good - Use semantic methods for form elements
await page.getByLabel('Subscribe to newsletter').check();
await page.getByLabel('Country').selectOption('United States');

// ❌ Avoid - Generic click for specialized elements
await page.getByLabel('Subscribe to newsletter').click();

// ✅ Good - Use fill() for text input
await page.getByLabel('Email').fill('user@example.com');

// ❌ Avoid - Slow character-by-character typing
await page.getByLabel('Email').type('user@example.com');

// ✅ Good - Wait for elements naturally
await page.getByText('Success message').waitFor();

// ❌ Avoid - Arbitrary timeouts
await page.waitForTimeout(3000);
```

### Error Handling and Edge Cases

Robust tests handle common interaction issues gracefully:

```typescript
// Handle potentially missing elements
const optionalButton = page.getByRole('button', { name: 'Optional Action' });
if (await optionalButton.isVisible()) {
  await optionalButton.click();
}

// Handle disabled elements
const submitButton = page.getByRole('button', { name: 'Submit' });
await expect(submitButton).toBeEnabled();
await submitButton.click();

// Handle elements that might be covered
const menuItem = page.getByText('Menu Item');
await menuItem.scrollIntoViewIfNeeded();
await menuItem.click();

// Retry interactions on failure
async function clickWithRetry(locator, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await locator.click();
      return;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await page.waitForTimeout(1000);
    }
  }
}
```

## Summary

Mastering element interactions is essential for creating reliable E2E tests. Key takeaways include:

1. **Use Semantic Methods**: Prefer specialized methods like [`check()`](../examples/element-interactions.spec.ts:45) and [`selectOption()`](../examples/element-interactions.spec.ts:65) over generic [`click()`](../examples/element-interactions.spec.ts:15)
2. **Handle Dynamic Content**: Use proper waiting strategies instead of arbitrary timeouts
3. **Validate States**: Always verify element states before and after interactions
4. **Choose Appropriate Methods**: Use [`fill()`](../examples/element-interactions.spec.ts:25) for speed, [`type()`](../examples/element-interactions.spec.ts:35) for realism
5. **Handle Edge Cases**: Account for loading states, disabled elements, and error conditions

By following these practices, you'll create test suites that reliably simulate user interactions and provide valuable feedback about your application's behavior.

## Next Steps

In the next lesson, **Assertions and Expectations**, you'll learn comprehensive validation techniques to verify that your interactions have the expected results, completing the cycle of locate, interact, and validate that forms the foundation of effective E2E testing.