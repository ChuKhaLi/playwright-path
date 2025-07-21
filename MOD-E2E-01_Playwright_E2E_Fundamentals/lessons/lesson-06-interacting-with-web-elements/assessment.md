# Assessment: Interacting with Web Elements

## Overview

This assessment evaluates your understanding of Playwright's element interaction methods, including basic interactions, form handling, advanced actions, state validation, and best practices for reliable element interaction.

**Time Limit**: 30 minutes  
**Total Questions**: 6 multiple-choice + 1 bonus question  
**Passing Score**: 75% (5 out of 6 correct answers)  
**Format**: Multiple choice with detailed explanations

## Instructions

1. Read each question carefully
2. Select the best answer from the provided options
3. Review the explanations after completing all questions
4. Use the scoring guide to evaluate your performance

---

## Question 1: Basic Interaction Method Selection

You need to fill a search input field with the text "Playwright testing". The field currently contains "Previous search". Which method is MOST appropriate?

**A)** `page.getByPlaceholder('Search').type('Playwright testing')`  
**B)** `page.getByPlaceholder('Search').fill('Playwright testing')`  
**C)** `page.getByPlaceholder('Search').press('Control+A'); page.getByPlaceholder('Search').type('Playwright testing')`  
**D)** `page.getByPlaceholder('Search').clear(); page.getByPlaceholder('Search').type('Playwright testing')`

### Explanation

**Correct Answer: B**

**Why B is correct:**
- `fill()` automatically clears the existing content before entering new text
- It's the most efficient method for replacing text content completely
- It's faster than character-by-character typing
- It's the recommended approach for most text input scenarios
- It handles the clearing and filling in a single atomic operation

**Why other options are less ideal:**
- **A)** `type()` would append to existing text, resulting in "Previous searchPlaywright testing"
- **C)** Unnecessarily complex with manual selection and slower typing
- **D)** `clear()` is not a standard Playwright method; `fill()` handles clearing automatically

**Key Learning:** Use `fill()` for replacing text content and `type()` only when you need to append or simulate character-by-character input.

---

## Question 2: Form Element Interaction

You have a checkbox for "Terms and Conditions" that should be checked based on a boolean variable `shouldAcceptTerms`. Which approach is BEST?

**A)** 
```typescript
if (shouldAcceptTerms) {
  await page.getByLabel('Terms and Conditions').click();
}
```

**B)** 
```typescript
if (shouldAcceptTerms) {
  await page.getByLabel('Terms and Conditions').check();
} else {
  await page.getByLabel('Terms and Conditions').uncheck();
}
```

**C)** 
```typescript
await page.getByLabel('Terms and Conditions').setChecked(shouldAcceptTerms);
```

**D)** 
```typescript
const checkbox = page.getByLabel('Terms and Conditions');
const isChecked = await checkbox.isChecked();
if (isChecked !== shouldAcceptTerms) {
  await checkbox.click();
}
```

### Explanation

**Correct Answer: C**

**Why C is correct:**
- `setChecked()` is designed specifically for conditional checkbox state setting
- It takes a boolean parameter and sets the checkbox to that exact state
- It's the most concise and readable solution
- It handles both checking and unchecking based on the boolean value
- It's idempotent - calling it multiple times with the same value is safe

**Why other options are less ideal:**
- **A)** Only handles the checking case, ignores unchecking
- **B)** More verbose and requires explicit if/else logic
- **D)** Unnecessarily complex with manual state checking and clicking

**Key Learning:** Use `setChecked()` for conditional checkbox state management, `check()`/`uncheck()` for explicit state changes.

---

## Question 3: Select Dropdown Interaction

You need to select "Canada" from a country dropdown. The HTML structure is:

```html
<select name="country">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
</select>
```

Which selection method is MOST reliable across different scenarios?

**A)** `page.getByRole('combobox', { name: 'country' }).selectOption('Canada')`  
**B)** `page.getByRole('combobox', { name: 'country' }).selectOption({ value: 'ca' })`  
**C)** `page.getByRole('combobox', { name: 'country' }).selectOption({ index: 1 })`  
**D)** `page.locator('select[name="country"]').selectOption('ca')`

### Explanation

**Correct Answer: B**

**Why B is correct:**
- Selecting by value is the most stable approach as values typically don't change
- Values are usually consistent across different languages/localizations
- It's less likely to break when the visible text changes
- It directly matches the HTML value attribute
- It's more reliable than text-based selection for internationalized applications

**Why other options are less ideal:**
- **A)** Selecting by visible text can break with internationalization or text changes
- **C)** Index-based selection is brittle and breaks when options are reordered
- **D)** Uses CSS selector instead of semantic locator, less maintainable

**Key Learning:** Prefer selecting by value for stability, by text for readability, and avoid index-based selection.

---

## Question 4: File Upload Handling

You need to upload a PDF file for document verification. Which approach is MOST appropriate for a test environment?

**A)** 
```typescript
await page.getByLabel('Upload Document').setInputFiles('C:\\Users\\Documents\\test.pdf');
```

**B)** 
```typescript
await page.getByLabel('Upload Document').setInputFiles('./test-files/document.pdf');
```

**C)** 
```typescript
await page.getByLabel('Upload Document').setInputFiles({
  name: 'test-document.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('PDF content for testing')
});
```

**D)** 
```typescript
const fileInput = page.getByLabel('Upload Document');
await fileInput.click();
// Manual file selection through OS dialog
```

### Explanation

**Correct Answer: C**

**Why C is correct:**
- Creates files dynamically in memory, no external file dependencies
- Works consistently across different environments and CI/CD systems
- Allows precise control over file content and properties
- Doesn't require maintaining actual files in the test repository
- More reliable for automated testing environments
- Can simulate various file types and sizes programmatically

**Why other options are less ideal:**
- **A)** Absolute path is environment-specific and won't work on other machines
- **B)** Better than A but still requires maintaining actual files
- **D)** Cannot be automated - requires manual interaction

**Key Learning:** Use in-memory file creation for test reliability and environment independence.

---

## Question 5: Advanced Interaction - Drag and Drop

You need to test drag-and-drop functionality to reorder items in a list. Which approach is MOST comprehensive?

**A)** 
```typescript
await page.getByText('Item 1').dragTo(page.getByText('Item 3'));
```

**B)** 
```typescript
const source = page.getByText('Item 1');
const target = page.getByText('Item 3');
await source.hover();
await page.mouse.down();
await target.hover();
await page.mouse.up();
```

**C)** 
```typescript
const source = page.getByText('Item 1');
const target = page.getByText('Item 3');
await source.dragTo(target);
await expect(page.getByTestId('item-list').locator('li').first()).toHaveText('Item 3');
```

**D)** 
```typescript
await page.getByText('Item 1').click();
await page.keyboard.press('Control+X');
await page.getByText('Item 3').click();
await page.keyboard.press('Control+V');
```

### Explanation

**Correct Answer: C**

**Why C is correct:**
- Uses the semantic `dragTo()` method which is designed for drag-and-drop
- Includes verification of the drag-and-drop result
- Tests the complete user workflow including the outcome
- More reliable than manual mouse operations
- Provides meaningful feedback if the operation fails

**Why other options are less ideal:**
- **A)** Performs the action but doesn't verify the result
- **B)** Manual mouse operations are more complex and potentially less reliable
- **D)** Uses keyboard shortcuts instead of actual drag-and-drop interaction

**Key Learning:** Always verify the results of complex interactions like drag-and-drop, and prefer semantic methods over manual mouse operations.

---

## Question 6: Element State Validation

You're testing a form submission that shows a loading spinner and then a success message. Which validation approach is MOST robust?

**A)** 
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await page.waitForTimeout(3000);
await expect(page.getByText('Success')).toBeVisible();
```

**B)** 
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Loading...')).toBeVisible();
await expect(page.getByText('Success')).toBeVisible();
```

**C)** 
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Loading...')).toBeVisible();
await expect(page.getByText('Loading...')).toBeHidden();
await expect(page.getByText('Success')).toBeVisible();
```

**D)** 
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByText('Loading...').waitFor({ state: 'visible' });
await page.getByText('Loading...').waitFor({ state: 'hidden' });
await page.getByText('Success').waitFor({ state: 'visible' });
```

### Explanation

**Correct Answer: C**

**Why C is correct:**
- Validates the complete state transition: loading appears → loading disappears → success appears
- Uses built-in waiting mechanisms instead of arbitrary timeouts
- Provides clear feedback about which step failed if the test breaks
- Tests the actual user experience of seeing loading then success
- More reliable than timeout-based approaches

**Why other options are less ideal:**
- **A)** Uses arbitrary timeout which is unreliable and doesn't validate loading state
- **B)** Doesn't wait for loading to complete before checking success
- **D)** More verbose than necessary; `expect().toBeVisible()` includes waiting

**Key Learning:** Validate complete state transitions and avoid arbitrary timeouts in favor of element-based waiting.

---

## Bonus Question: Performance and Best Practices

You have a test that interacts with the same button multiple times throughout the test. Which approach demonstrates BEST practices for performance and maintainability?

**A)** 
```typescript
await page.getByRole('button', { name: 'Save Draft' }).click();
// ... other actions ...
await page.getByRole('button', { name: 'Save Draft' }).click();
// ... more actions ...
await expect(page.getByRole('button', { name: 'Save Draft' })).toBeDisabled();
```

**B)** 
```typescript
const saveButton = page.getByRole('button', { name: 'Save Draft' });
await saveButton.click();
// ... other actions ...
await saveButton.click();
// ... more actions ...
await expect(saveButton).toBeDisabled();
```

**C)** 
```typescript
const SAVE_BUTTON = '#save-draft-btn';
await page.locator(SAVE_BUTTON).click();
// ... other actions ...
await page.locator(SAVE_BUTTON).click();
// ... more actions ...
await expect(page.locator(SAVE_BUTTON)).toBeDisabled();
```

**D)** 
```typescript
async function clickSaveButton() {
  await page.getByRole('button', { name: 'Save Draft' }).click();
}
await clickSaveButton();
// ... other actions ...
await clickSaveButton();
```

### Explanation

**Correct Answer: B**

**Why B is correct:**
- Caches the locator in a variable, avoiding repeated locator creation
- Uses semantic `getByRole()` locator for better maintainability
- Improves performance by reusing the same locator object
- Makes the code more readable with descriptive variable naming
- Reduces the chance of typos in repeated locator expressions
- Follows the DRY (Don't Repeat Yourself) principle

**Why other options are less ideal:**
- **A)** Recreates the same locator multiple times, impacting performance
- **C)** Uses CSS selector instead of semantic locator, and still recreates locators
- **D)** Function approach is over-engineered for simple repeated interactions

**Key Learning:** Cache frequently used locators in variables to improve performance and maintainability while using semantic locator strategies.

---

## Scoring Guide

### Score Calculation
- **Questions 1-6**: 1 point each (6 points total)
- **Bonus Question**: 1 additional point (7 points maximum)
- **Passing Score**: 5/6 (83%) or 4/6 (67%) with bonus correct

### Performance Levels

**Excellent (6-7 points)**
- Mastery of all interaction methods and best practices
- Understanding of performance optimization and maintainability
- Ready for advanced E2E testing and real-world applications
- Can mentor others on interaction strategies

**Good (4-5 points)**
- Solid understanding of core interaction concepts
- Some areas for improvement in advanced techniques or best practices
- Ready to proceed with guided practice on complex scenarios
- Should review form handling and state validation

**Needs Improvement (2-3 points)**
- Basic understanding but gaps in key interaction methods
- Should review lesson content and practice exercises
- Focus on form elements and state validation techniques
- Additional hands-on practice recommended

**Requires Review (0-1 points)**
- Fundamental interaction concepts not yet mastered
- Complete lesson review required
- Extensive hands-on practice needed
- Consider additional resources and mentoring

## Next Steps Based on Performance

### If You Scored Well (5+ points)
- Proceed to **Lesson 07: Assertions and Expectations**
- Practice with complex real-world applications
- Explore advanced interaction patterns and edge cases
- Consider contributing to team interaction guidelines

### If You Need Improvement (3-4 points)
- Review the lesson content, focusing on areas you missed
- Complete additional hands-on exercises with form elements
- Practice state validation and dynamic content handling
- Work through the provided code examples step by step

### If You Need Significant Review (0-2 points)
- Re-read the entire lesson content carefully
- Work through all hands-on exercises with detailed attention
- Practice with simpler examples before complex scenarios
- Seek additional resources or mentoring support

## Reflection Questions

After completing the assessment, consider these questions:

1. **Which interaction methods do you find most intuitive and why?**
2. **What challenges did you face with form element handling?**
3. **How will you apply state validation techniques in your testing projects?**
4. **What additional practice do you need to feel confident with advanced interactions?**

## Additional Resources for Improvement

- [Playwright Input Actions Documentation](https://playwright.dev/docs/input)
- [Form Handling Best Practices](https://playwright.dev/docs/input#fill-form-fields)
- [File Upload Testing Guide](https://playwright.dev/docs/input#upload-files)
- [Drag and Drop Examples](https://playwright.dev/docs/input#drag-and-drop)
- [Element State Assertions](https://playwright.dev/docs/test-assertions#element-assertions)

## Common Mistakes to Avoid

1. **Using `type()` when `fill()` is more appropriate**
2. **Not validating element states before interactions**
3. **Using arbitrary timeouts instead of element-based waiting**
4. **Recreating the same locators multiple times**
5. **Not verifying the results of complex interactions**
6. **Using brittle selectors instead of semantic locators**

---

**Remember**: The goal is not just to pass the assessment, but to develop reliable interaction patterns that create maintainable, robust tests. Focus on understanding when and why to use each interaction method for maximum effectiveness in real-world testing scenarios.