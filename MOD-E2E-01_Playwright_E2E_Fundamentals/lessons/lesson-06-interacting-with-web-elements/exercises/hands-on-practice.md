# Hands-On Practice: Interacting with Web Elements

## Overview

This hands-on exercise will give you practical experience with Playwright's element interaction methods. You'll work with real websites to practice clicking, typing, form handling, advanced actions, and state validation techniques.

**Estimated Time**: 90-120 minutes  
**Difficulty**: Beginner to Intermediate  
**Prerequisites**: Completed Lesson 05 (Basic Locators and Element Selection)

## Setup Instructions

Before starting the exercises, ensure you have:

1. **Playwright Environment**: Working Playwright test setup from previous lessons
2. **Test File**: Create a new test file called `element-interactions-practice.spec.ts`
3. **Browser Access**: Ensure you can access demo websites for testing

## Exercise 1: Basic Interaction Mastery (25 minutes)

### Objective
Master the fundamental interaction methods: click, fill, type, and keyboard actions.

### Instructions

1. **Navigate to TodoMVC Demo**
   ```typescript
   test('Basic interaction practice', async ({ page }) => {
     await page.goto('https://demo.playwright.dev/todomvc/');
   });
   ```

2. **Practice Click Interactions**
   - Click on the input field to focus it
   - Add multiple todo items using different interaction patterns
   - Click on todo items to toggle their completion status
   - Practice double-click to edit existing todos

3. **Practice Text Input Methods**
   - Use `fill()` to replace text content completely
   - Use `type()` to append text to existing content
   - Compare the performance and behavior differences

4. **Practice Keyboard Actions**
   - Use Enter key to submit todos
   - Use Tab key for navigation
   - Use Escape key to cancel editing
   - Try keyboard shortcuts like Ctrl+A (select all)

### Tasks to Complete

**Task 1.1**: Create a test that adds 5 todos using only `fill()` and Enter key interactions.

**Task 1.2**: Create a test that demonstrates the difference between `fill()` and `type()` by:
- Adding base text with `fill()`
- Appending additional text with `type()`
- Verifying the final combined text

**Task 1.3**: Create a test that uses keyboard navigation to:
- Tab through interactive elements
- Use arrow keys for navigation (if supported)
- Use keyboard shortcuts for common actions

### Verification Steps

- [ ] All todos are created successfully using different interaction methods
- [ ] Text input differences between `fill()` and `type()` are clearly demonstrated
- [ ] Keyboard navigation works correctly across different elements
- [ ] All interactions complete without errors or timeouts

## Exercise 2: Form Element Handling (30 minutes)

### Objective
Master form element interactions including checkboxes, radio buttons, select dropdowns, and file uploads.

### Instructions

1. **Navigate to Form Demo**
   ```typescript
   test('Form element practice', async ({ page }) => {
     await page.goto('https://the-internet.herokuapp.com/checkboxes');
   });
   ```

2. **Practice Checkbox Interactions**
   - Use `check()` and `uncheck()` methods
   - Use `setChecked()` for conditional state setting
   - Verify checkbox states with assertions

3. **Create Custom Form for Advanced Practice**
   ```typescript
   await page.setContent(`
     <form>
       <input type="checkbox" id="newsletter" name="newsletter">
       <label for="newsletter">Subscribe to newsletter</label>
       
       <input type="radio" id="payment-credit" name="payment" value="credit">
       <label for="payment-credit">Credit Card</label>
       
       <select id="country" name="country">
         <option value="us">United States</option>
         <option value="ca">Canada</option>
       </select>
       
       <input type="file" id="upload" name="upload">
     </form>
   `);
   ```

### Tasks to Complete

**Task 2.1**: Create a comprehensive checkbox test that:
- Checks and unchecks multiple checkboxes
- Uses `setChecked()` with boolean conditions
- Verifies all state changes with appropriate assertions

**Task 2.2**: Create a radio button test that:
- Selects different radio button options
- Verifies that selecting one option deselects others
- Tests radio button groups with multiple sets

**Task 2.3**: Create a select dropdown test that:
- Selects options by text, value, and index
- Tests both single and multi-select dropdowns
- Verifies selected values and options

**Task 2.4**: Create a file upload test that:
- Uploads single and multiple files
- Uses both file paths and buffer content
- Verifies file selection and clears selections

### Verification Steps

- [ ] Checkbox interactions work correctly with proper state validation
- [ ] Radio button selections work with mutual exclusivity
- [ ] Select dropdown selections work with all selection methods
- [ ] File uploads handle various file types and scenarios

## Exercise 3: Advanced User Actions (25 minutes)

### Objective
Implement advanced interactions including hover, focus, drag-and-drop, and context menus.

### Instructions

1. **Create Interactive Test Page**
   ```typescript
   await page.setContent(`
     <div>
       <button onmouseover="showTooltip()" onmouseout="hideTooltip()">
         Hover me
         <span id="tooltip" style="display:none;">Tooltip text</span>
       </button>
       
       <div id="drag-source" draggable="true">Drag me</div>
       <div id="drop-target">Drop here</div>
       
       <input type="text" placeholder="Focus me">
       <button>Focusable button</button>
     </div>
   `);
   ```

2. **Practice Hover Interactions**
   - Use `hover()` to trigger hover states
   - Test tooltip appearances and disappearances
   - Combine hover with other actions

3. **Practice Focus Management**
   - Use `focus()` to focus elements
   - Test tab navigation between focusable elements
   - Verify focus states with assertions

4. **Practice Drag and Drop**
   - Use `dragTo()` for drag-and-drop operations
   - Test reordering items in lists
   - Handle complex drag-and-drop scenarios

### Tasks to Complete

**Task 3.1**: Create a hover interaction test that:
- Hovers over elements to reveal hidden content
- Tests hover-triggered dropdown menus
- Verifies hover state changes

**Task 3.2**: Create a focus management test that:
- Focuses on form elements programmatically
- Tests keyboard navigation with Tab key
- Verifies focus indicators and states

**Task 3.3**: Create a drag-and-drop test that:
- Drags items between different containers
- Tests reordering within the same container
- Verifies the final positions after drag operations

### Verification Steps

- [ ] Hover interactions reveal and hide content correctly
- [ ] Focus management works with both programmatic and keyboard navigation
- [ ] Drag-and-drop operations complete successfully with proper verification

## Exercise 4: Element State Validation (20 minutes)

### Objective
Master element state validation techniques for visibility, content, attributes, and dynamic states.

### Instructions

1. **Create Dynamic Content Test Page**
   ```typescript
   await page.setContent(`
     <div>
       <button onclick="toggleVisibility()">Toggle Content</button>
       <div id="dynamic-content" style="display:none;">Hidden content</div>
       
       <input type="text" id="text-input" value="Initial value">
       <button onclick="updateContent()">Update Content</button>
       
       <div id="status" class="pending" data-status="pending">Pending</div>
     </div>
   `);
   ```

2. **Practice Visibility Validation**
   - Test `toBeVisible()` and `toBeHidden()` assertions
   - Verify element presence with `toBeAttached()`
   - Handle dynamic show/hide scenarios

3. **Practice Content Validation**
   - Test `toHaveText()` and `toContainText()` assertions
   - Verify input values with `toHaveValue()`
   - Test attribute validation with `toHaveAttribute()`

### Tasks to Complete

**Task 4.1**: Create a visibility validation test that:
- Tests initial visibility states
- Toggles element visibility and verifies changes
- Distinguishes between hidden and non-existent elements

**Task 4.2**: Create a content validation test that:
- Verifies text content with exact and partial matching
- Tests input field values before and after changes
- Validates dynamic content updates

**Task 4.3**: Create an attribute validation test that:
- Checks element attributes like class, id, and data attributes
- Verifies CSS properties and computed styles
- Tests attribute changes in response to user actions

### Verification Steps

- [ ] Visibility states are correctly identified and validated
- [ ] Content validation works for both static and dynamic content
- [ ] Attribute validation covers various attribute types and changes

## Exercise 5: Dynamic Content and Loading States (15 minutes)

### Objective
Handle dynamic content, loading states, and asynchronous interactions effectively.

### Instructions

1. **Create Loading State Simulation**
   ```typescript
   await page.setContent(`
     <div>
       <button onclick="loadData()">Load Data</button>
       <div id="loading" style="display:none;">Loading...</div>
       <div id="data" style="display:none;">Loaded data content</div>
       
       <script>
         function loadData() {
           document.getElementById('loading').style.display = 'block';
           setTimeout(() => {
             document.getElementById('loading').style.display = 'none';
             document.getElementById('data').style.display = 'block';
           }, 2000);
         }
       </script>
     </div>
   `);
   ```

2. **Practice Waiting Strategies**
   - Use `waitFor()` with different states
   - Handle loading indicators and completion states
   - Test timeout scenarios and error handling

### Tasks to Complete

**Task 5.1**: Create a loading state test that:
- Triggers a loading process
- Waits for loading indicators to appear and disappear
- Verifies final loaded content

**Task 5.2**: Create a dynamic content test that:
- Handles content that appears after user actions
- Uses appropriate waiting strategies
- Validates content changes over time

### Verification Steps

- [ ] Loading states are properly handled with appropriate waits
- [ ] Dynamic content changes are detected and validated
- [ ] Timeout scenarios are handled gracefully

## Challenge Exercise: Complete User Workflow (15 minutes)

### Objective
Combine all learned interaction techniques to create a comprehensive user workflow test.

### Instructions

Create a single test that demonstrates mastery of all interaction types by simulating a complete user registration and profile setup workflow.

### Challenge Task

Create a test called `complete-user-workflow` that:

1. **Registration Form Interaction**
   - Fill out a multi-step registration form
   - Handle various input types (text, email, password, checkboxes)
   - Use keyboard navigation and shortcuts

2. **Profile Setup**
   - Upload a profile picture (file upload)
   - Select preferences using dropdowns and radio buttons
   - Use drag-and-drop for organizing profile sections

3. **Interactive Features**
   - Test hover effects and tooltips
   - Handle dynamic content loading
   - Validate all form states and content changes

4. **Comprehensive Validation**
   - Verify all interaction results
   - Test both success and error scenarios
   - Ensure proper state management throughout

### Success Criteria

- [ ] Test covers at least 6 different interaction types
- [ ] All interactions are validated with appropriate assertions
- [ ] Test handles dynamic content and loading states
- [ ] Code is well-organized and follows best practices
- [ ] Test provides meaningful feedback on failures

## Troubleshooting Guide

### Common Issues and Solutions

**Issue 1: Element Not Interactable**
```typescript
// Problem: Element exists but can't be interacted with
await page.getByRole('button').click(); // Might fail if button is disabled

// Solution: Check element state first
const button = page.getByRole('button');
await expect(button).toBeEnabled();
await button.click();
```

**Issue 2: Timing Issues with Dynamic Content**
```typescript
// Problem: Interacting with elements before they're ready
await page.getByText('Dynamic Button').click(); // Might fail if not loaded

// Solution: Wait for element to be ready
await page.getByText('Dynamic Button').waitFor();
await page.getByText('Dynamic Button').click();
```

**Issue 3: Form Validation Interference**
```typescript
// Problem: Form validation prevents interaction
await page.getByLabel('Email').fill('invalid-email');
await page.getByRole('button', { name: 'Submit' }).click(); // Might be blocked

// Solution: Handle validation states
await page.getByLabel('Email').fill('valid@email.com');
await expect(page.getByText('Invalid email')).not.toBeVisible();
await page.getByRole('button', { name: 'Submit' }).click();
```

**Issue 4: File Upload Path Issues**
```typescript
// Problem: File path not found
await page.getByLabel('Upload').setInputFiles('nonexistent.pdf'); // Fails

// Solution: Use proper file paths or create files dynamically
await page.getByLabel('Upload').setInputFiles({
  name: 'test.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('PDF content')
});
```

## Submission Guidelines

### What to Submit

1. **Test File**: Your completed `element-interactions-practice.spec.ts` file
2. **Documentation**: Notes on interaction patterns that worked best for different scenarios
3. **Reflection**: Summary of challenges encountered and solutions discovered

### Evaluation Criteria

- **Interaction Variety**: Use of diverse interaction methods appropriately
- **State Validation**: Proper verification of element states and content
- **Error Handling**: Graceful handling of edge cases and timing issues
- **Code Quality**: Clean, readable, and maintainable test code
- **Best Practices**: Following Playwright and testing best practices

### Next Steps

After completing these exercises, you'll be ready to:
- Move on to **Lesson 07: Assertions and Expectations**
- Build complex user workflow tests
- Implement Page Object Model patterns with reliable interactions
- Create robust test suites for real-world applications

## Additional Resources

- [Playwright Actions Documentation](https://playwright.dev/docs/input)
- [Form Handling Best Practices](https://playwright.dev/docs/input#fill-form-fields)
- [File Upload Testing](https://playwright.dev/docs/input#upload-files)
- [Drag and Drop Examples](https://playwright.dev/docs/input#drag-and-drop)

---

**Remember**: The goal is to build muscle memory for common interaction patterns while understanding when and why to use each method. Focus on creating reliable, maintainable interactions that mirror real user behavior!