# Advanced Element Interaction Patterns

Modern web applications often feature complex UI components that require more than simple clicks and text input. This lesson covers advanced interaction patterns in Playwright to handle such scenarios effectively.

## 1. Hovering Over Elements

Some elements, like dropdown menus or tooltips, only become visible or interactive when a user hovers their mouse over them. Playwright provides the `hover()` method for this purpose.

### Use Case: Revealing a Hidden Menu

Imagine a navigation bar where sub-menus appear on hover.

```typescript
import { test, expect } from '@playwright/test';

test('should display submenu on hover', async ({ page }) => {
  await page.goto('https://example.com/products');

  // Hover over the main menu item
  await page.locator('#products-menu').hover();

  // The submenu should now be visible
  const submenu = page.locator('.submenu-products');
  await expect(submenu).toBeVisible();

  // Click on a submenu item
  await submenu.locator('text=Laptops').click();
  await expect(page).toHaveURL(/.*laptops/);
});
```

**Key Points:**
- The `hover()` action simulates a user moving their mouse over an element.
- After hovering, you can assert the visibility of the revealed element and interact with it.

## 2. Drag and Drop

Drag-and-drop functionality is common in applications like project management boards or file organizers. Playwright's `dragTo()` method simplifies testing this feature.

### Use Case: Reordering a To-Do List

```typescript
import { test, expect } from '@playwright/test';

test('should allow reordering tasks with drag and drop', async ({ page }) => {
  await page.goto('https://example.com/todo-board');

  const taskToMove = page.locator('#task-3');
  const targetColumn = page.locator('#in-progress-column');

  // Perform the drag-and-drop operation
  await taskToMove.dragTo(targetColumn);

  // Verify the task is now in the new column
  await expect(targetColumn.locator('#task-3')).toBeVisible();
});
```

Alternatively, you can use the lower-level `dragAndDrop()` method on the page object for more control:

```typescript
// Alternative using page.dragAndDrop()
await page.dragAndDrop('#task-3', '#in-progress-column');
```

## 3. Interacting with Sliders

HTML5 range inputs (sliders) require a different approach than standard text inputs. You can interact with them by simulating mouse actions.

### Use Case: Setting a Price Range Filter

```typescript
import { test, expect } from '@playwright/test';

test('should adjust the price range slider', async ({ page }) => {
  await page.goto('https://example.com/search');

  const slider = page.locator('input[type="range"]');
  const sliderBoundingBox = await slider.boundingBox();

  if (sliderBoundingBox) {
    // Calculate the position to click on the slider (e.g., 75% of the way)
    const targetX = sliderBoundingBox.x + sliderBoundingBox.width * 0.75;
    const targetY = sliderBoundingBox.y + sliderBoundingBox.height / 2;

    // Click and drag the slider handle
    await page.mouse.move(sliderBoundingBox.x, targetY);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY);
    await page.mouse.up();
  }

  // Verify the price filter has been updated
  await expect(page.locator('#price-display')).toHaveText('$750');
});
```

**Explanation:**
1.  We get the slider's bounding box to understand its position and size.
2.  We calculate the target coordinates on the slider.
3.  We use `page.mouse` to perform a sequence of move, down, move, and up actions, simulating a drag.

## 4. Handling Custom UI Components

Many modern web apps use custom-built components (e.g., with React, Vue, or Angular) that don't rely on standard HTML elements. Testing these requires a good understanding of their underlying DOM structure.

### Use Case: Selecting an Option from a Custom Dropdown

A custom dropdown might consist of `<div>` and `<span>` elements instead of a `<select>` tag.

```typescript
import { test, expect } from '@playwright/test';

test('should select an option from a custom dropdown', async ({ page }) => {
  await page.goto('https://example.com/custom-form');

  const customDropdown = page.locator('#custom-dropdown-trigger');
  
  // 1. Click the trigger to open the dropdown
  await customDropdown.click();

  // 2. Wait for the options panel to be visible
  const optionsPanel = page.locator('.custom-dropdown-options');
  await expect(optionsPanel).toBeVisible();

  // 3. Click the desired option
  await optionsPanel.locator('div[data-value="option-2"]').click();

  // 4. Verify the selection was made
  await expect(customDropdown.locator('.selected-value')).toHaveText('Option 2');
});
```

**Strategy:**
-   Inspect the component with browser developer tools to understand its structure.
-   Break down the interaction into a sequence of user actions (click to open, locate the option, click the option).
-   Use stable attributes like `data-*` for locating elements within the component.

## Summary

Mastering advanced interaction patterns is crucial for testing the rich, dynamic interfaces of modern web applications. By using methods like `hover()`, `dragTo()`, and the `page.mouse` API, you can automate complex user gestures. For custom components, a combination of inspection and sequential actions allows you to test any UI element, regardless of its implementation.