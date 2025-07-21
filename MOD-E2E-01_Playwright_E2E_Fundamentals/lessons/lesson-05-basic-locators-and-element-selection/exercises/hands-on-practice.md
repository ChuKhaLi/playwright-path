# Hands-On Practice: Basic Locators and Element Selection

## Overview

This hands-on exercise will give you practical experience with Playwright's locator system. You'll work with real websites to practice different locator strategies, handle dynamic content, and debug locator issues.

**Estimated Time**: 90-120 minutes  
**Difficulty**: Beginner to Intermediate  
**Prerequisites**: Completed Lesson 04 (The Trace Viewer)

## Setup Instructions

Before starting the exercises, ensure you have:

1. **Playwright Installed**: Run `npm install @playwright/test` in your project directory
2. **Test Environment**: Create a new test file called `locator-practice.spec.ts`
3. **Browser Setup**: Ensure you can run `npx playwright test` successfully

## Exercise 1: Built-in Locator Mastery (25 minutes)

### Objective
Practice using Playwright's built-in locators on a real website to understand their strengths and use cases.

### Instructions

1. **Navigate to the TodoMVC Demo**
   ```typescript
   test('Built-in locator practice', async ({ page }) => {
     await page.goto('https://demo.playwright.dev/todomvc/');
   });
   ```

2. **Practice `getByRole()` Locators**
   - Find the main input field using its role
   - Locate the "All", "Active", and "Completed" filter buttons by role
   - Identify any other interactive elements using semantic roles

3. **Practice `getByText()` Locators**
   - Add several todos with different text content
   - Find specific todos by their exact text
   - Use partial text matching to find todos containing specific words
   - Try case-insensitive matching

4. **Practice `getByPlaceholder()` Locators**
   - Locate the main input using its placeholder text
   - Verify the placeholder text matches your expectations

### Tasks to Complete

**Task 1.1**: Create a test that adds 3 different todos using only `getByRole()` locators.

**Task 1.2**: Create a test that finds and clicks on specific todos using `getByText()` with exact matching.

**Task 1.3**: Create a test that uses `getByPlaceholder()` to interact with the input field.

### Verification Steps

- [ ] All todos are added successfully using role-based locators
- [ ] Specific todos can be found and interacted with using text-based locators
- [ ] Input field interactions work correctly with placeholder-based locators
- [ ] No hard-coded CSS selectors or XPath expressions are used

## Exercise 2: Form Element Selection (20 minutes)

### Objective
Master form element selection using `getByLabel()` and other form-specific locators.

### Instructions

1. **Navigate to a Form Demo**
   ```typescript
   test('Form locator practice', async ({ page }) => {
     await page.goto('https://the-internet.herokuapp.com/login');
   });
   ```

2. **Practice `getByLabel()` Locators**
   - Find the username input by its label
   - Find the password input by its label
   - Locate the submit button using appropriate locators

3. **Test Different Form Scenarios**
   - Fill out the form using only semantic locators
   - Submit the form and verify the result
   - Handle both success and error scenarios

### Tasks to Complete

**Task 2.1**: Create a successful login test using only `getByLabel()` and `getByRole()` locators.

**Task 2.2**: Create a failed login test that verifies error messages using `getByText()`.

**Task 2.3**: Create a test that validates form field properties (required, type, etc.) using semantic locators.

### Verification Steps

- [ ] Login form can be filled using label-based locators
- [ ] Form submission works correctly
- [ ] Error messages are properly detected
- [ ] Form validation is tested using semantic approaches

## Exercise 3: CSS Selector Strategies (25 minutes)

### Objective
Learn when and how to use CSS selectors effectively with `page.locator()`.

### Instructions

1. **Navigate to a Complex Page**
   ```typescript
   test('CSS selector practice', async ({ page }) => {
     await page.goto('https://the-internet.herokuapp.com/');
   });
   ```

2. **Practice Basic CSS Selectors**
   - Use element selectors to find headings and paragraphs
   - Use class selectors to find styled elements
   - Use attribute selectors to find links with specific attributes

3. **Practice Advanced CSS Selectors**
   - Use descendant selectors to find nested elements
   - Use pseudo-selectors like `:first-child`, `:last-child`, `:nth-child()`
   - Combine multiple selectors for precise targeting

### Tasks to Complete

**Task 3.1**: Create a test that navigates through the examples list using only CSS selectors.

**Task 3.2**: Create a test that finds the first, middle, and last links in the examples list using pseudo-selectors.

**Task 3.3**: Create a test that uses attribute selectors to find links containing specific text in their href.

### Verification Steps

- [ ] Basic CSS selectors work correctly for element targeting
- [ ] Advanced CSS selectors provide precise element selection
- [ ] Pseudo-selectors work for positional element selection
- [ ] Attribute selectors successfully filter elements by properties

## Exercise 4: Dynamic Content Handling (30 minutes)

### Objective
Handle dynamic content and changing elements using flexible locator strategies.

### Instructions

1. **Create Dynamic Content Simulation**
   ```typescript
   test('Dynamic content practice', async ({ page }) => {
     // Create a page with dynamic content for testing
     await page.setContent(`
       <html>
         <body>
           <div id="dynamic-container">
             <div class="user-card" data-user-id="user-123">
               <h3>John Doe</h3>
               <span class="status online">Online</span>
               <button class="action-btn edit-btn">Edit</button>
             </div>
             <div class="user-card" data-user-id="user-456">
               <h3>Jane Smith</h3>
               <span class="status offline">Offline</span>
               <button class="action-btn delete-btn">Delete</button>
             </div>
           </div>
         </body>
       </html>
     `);
   });
   ```

2. **Practice Flexible Attribute Matching**
   - Find elements with dynamic IDs using partial matching
   - Use wildcard selectors for changing class names
   - Handle elements with multiple dynamic attributes

3. **Practice Locator Chaining and Filtering**
   - Chain locators to find nested elements
   - Use filters to narrow down element selection
   - Combine multiple filtering conditions

### Tasks to Complete

**Task 4.1**: Create a test that finds user cards with dynamic IDs using partial attribute matching.

**Task 4.2**: Create a test that finds specific users by name and interacts with their action buttons using chaining.

**Task 4.3**: Create a test that filters users by status (online/offline) and performs different actions.

### Verification Steps

- [ ] Dynamic IDs are handled correctly with partial matching
- [ ] Locator chaining works for nested element selection
- [ ] Filtering successfully narrows down element selection
- [ ] Multiple filter conditions work together correctly

## Exercise 5: Locator Debugging and Optimization (20 minutes)

### Objective
Learn to debug locator issues and optimize locator performance.

### Instructions

1. **Practice Locator Validation**
   ```typescript
   test('Locator debugging practice', async ({ page }) => {
     await page.goto('https://demo.playwright.dev/todomvc/');
     
     // Practice validating locators before use
     const todoInput = page.getByRole('textbox');
     await expect(todoInput).toHaveCount(1);
     await expect(todoInput).toBeVisible();
   });
   ```

2. **Practice Locator Caching**
   - Cache frequently used locators
   - Reuse locators across multiple actions
   - Compare performance with and without caching

3. **Practice Locator Troubleshooting**
   - Intentionally create problematic locators
   - Use debugging techniques to identify issues
   - Fix locators using best practices

### Tasks to Complete

**Task 5.1**: Create a test that validates locator properties before interaction.

**Task 5.2**: Create a test that demonstrates locator caching for improved performance.

**Task 5.3**: Create a test that handles common locator issues (multiple matches, no matches, timing issues).

### Verification Steps

- [ ] Locator validation prevents runtime errors
- [ ] Locator caching improves code readability and performance
- [ ] Common locator issues are properly handled
- [ ] Debugging techniques successfully identify problems

## Challenge Exercise: Complete Locator Strategy (15 minutes)

### Objective
Combine all learned techniques to create a comprehensive test using optimal locator strategies.

### Instructions

Create a single test that demonstrates mastery of all locator types by:

1. **Using Built-in Locators** for semantic element selection
2. **Using CSS Selectors** for complex element targeting
3. **Handling Dynamic Content** with flexible matching
4. **Implementing Best Practices** for maintainable code

### Challenge Task

Create a test called `comprehensive-locator-demo` that:
- Navigates to a complex web application
- Uses at least 4 different built-in locator types
- Implements at least 2 CSS selector strategies
- Handles at least 1 dynamic content scenario
- Demonstrates locator caching and validation
- Includes meaningful assertions and error handling

### Success Criteria

- [ ] Test uses diverse locator strategies appropriately
- [ ] Code is readable and maintainable
- [ ] All interactions work reliably
- [ ] Best practices are followed throughout
- [ ] Test provides meaningful feedback on failures

## Troubleshooting Guide

### Common Issues and Solutions

**Issue 1: Element Not Found**
```typescript
// Problem: Locator doesn't find any elements
await page.locator('.non-existent').click(); // Fails

// Solution: Validate locator first
const element = page.locator('.existing-element');
await expect(element).toBeVisible();
await element.click();
```

**Issue 2: Multiple Elements Found**
```typescript
// Problem: Locator finds multiple elements
await page.locator('button').click(); // Which button?

// Solution: Be more specific
await page.getByRole('button', { name: 'Submit' }).click();
```

**Issue 3: Timing Issues**
```typescript
// Problem: Element not ready when locator runs
await page.locator('.dynamic-content').click(); // Might fail

// Solution: Use built-in waiting
await page.getByText('Dynamic Content').click(); // Waits automatically
```

**Issue 4: Brittle Selectors**
```typescript
// Problem: Selector depends on implementation details
await page.locator('.css-1a2b3c > div:nth-child(3)').click();

// Solution: Use semantic approach
await page.getByRole('button', { name: 'Save' }).click();
```

## Submission Guidelines

### What to Submit

1. **Test File**: Your completed `locator-practice.spec.ts` file
2. **Documentation**: Brief notes on which locator strategies worked best for different scenarios
3. **Reflection**: Short summary of lessons learned and challenges encountered

### Evaluation Criteria

- **Correctness**: All tests pass and work as expected
- **Best Practices**: Appropriate use of locator strategies
- **Code Quality**: Clean, readable, and maintainable code
- **Completeness**: All exercises completed with proper verification

### Next Steps

After completing these exercises, you'll be ready to:
- Move on to **Lesson 06: Interacting with Web Elements**
- Apply locator knowledge to real-world testing scenarios
- Implement Page Object Model patterns using reliable locators
- Contribute to team locator strategy guidelines

## Additional Resources

- [Playwright Locators Documentation](https://playwright.dev/docs/locators)
- [CSS Selector Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**Remember**: The goal is not just to make tests pass, but to create maintainable, reliable locators that will serve your team well in the long term. Focus on semantic, user-centric approaches whenever possible!