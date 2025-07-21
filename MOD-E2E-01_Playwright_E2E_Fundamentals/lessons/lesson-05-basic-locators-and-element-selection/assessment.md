# Assessment: Basic Locators and Element Selection

## Overview

This assessment evaluates your understanding of Playwright's locator system, including built-in locators, CSS selectors, dynamic content handling, and best practices for element selection.

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

## Question 1: Built-in Locator Selection

You need to find and click a "Submit" button on a form. Which locator strategy is MOST appropriate and follows Playwright best practices?

**A)** `page.locator('#submit-btn').click()`  
**B)** `page.locator('.btn-submit').click()`  
**C)** `page.getByRole('button', { name: 'Submit' }).click()`  
**D)** `page.locator('//button[text()="Submit"]').click()`

### Explanation

**Correct Answer: C**

**Why C is correct:**
- `getByRole()` is a built-in locator that follows semantic, accessibility-first principles
- It finds elements by their ARIA role, which represents their purpose and meaning
- The `name` option ensures we find the specific "Submit" button among potentially multiple buttons
- This approach is user-centric - it mirrors how screen readers and users perceive the element
- It's resilient to UI changes since it doesn't depend on implementation details like IDs or classes

**Why other options are less ideal:**
- **A)** Depends on a specific ID that might change during development
- **B)** Relies on CSS class names that are implementation details
- **D)** Uses XPath, which is generally slower and less readable than built-in locators

**Key Learning:** Always prefer built-in locators like `getByRole()` for semantic element selection as they create more maintainable and accessible tests.

---

## Question 2: Form Element Targeting

You have a login form with username and password fields. The HTML structure is:

```html
<form>
  <label for="username">Email Address</label>
  <input id="username" type="email" />
  
  <label for="password">Password</label>
  <input id="password" type="password" />
</form>
```

Which is the BEST way to fill the email field?

**A)** `page.locator('#username').fill('user@example.com')`  
**B)** `page.getByLabel('Email Address').fill('user@example.com')`  
**C)** `page.locator('input[type="email"]').fill('user@example.com')`  
**D)** `page.locator('form input:first-child').fill('user@example.com')`

### Explanation

**Correct Answer: B**

**Why B is correct:**
- `getByLabel()` finds form elements by their associated label text, which is semantic and user-focused
- It works with both explicit (`for` attribute) and implicit (nested) label associations
- This approach is accessible and mirrors how users identify form fields
- It remains stable even if the underlying HTML structure changes
- It's self-documenting - the test clearly shows what field is being filled

**Why other options are less ideal:**
- **A)** Depends on the specific ID, which is an implementation detail
- **C)** Could match multiple email inputs if they exist on the page
- **D)** Brittle positional selector that breaks if form structure changes

**Key Learning:** Use `getByLabel()` for form elements as it provides semantic, accessible, and maintainable element selection.

---

## Question 3: Dynamic Content Handling

You have a list of user cards with dynamic IDs like `user-123`, `user-456`, etc. You need to find a specific user card for "John Doe". Which approach is MOST effective?

**A)** `page.locator('#user-123')`  
**B)** `page.locator('[id*="user-"]').filter({ hasText: 'John Doe' })`  
**C)** `page.getByText('John Doe').locator('..')`  
**D)** `page.locator('.user-card:has-text("John Doe")')`

### Explanation

**Correct Answer: B**

**Why B is correct:**
- Uses partial attribute matching `[id*="user-"]` to handle dynamic IDs
- Combines with `.filter({ hasText: 'John Doe' })` to find the specific user
- This approach is flexible and handles dynamic content effectively
- It's readable and clearly expresses the intent
- Works reliably even when user IDs change

**Why other options are less ideal:**
- **A)** Hard-codes a specific ID that might not exist or change
- **C)** Uses parent navigation (`..`) which is fragile and depends on HTML structure
- **D)** Uses CSS pseudo-selector that might not be supported in all browsers

**Key Learning:** Combine flexible attribute matching with filtering to handle dynamic content effectively while maintaining readability.

---

## Question 4: CSS Selector Best Practices

You need to select the first item in a navigation menu. The HTML structure is:

```html
<nav class="main-nav">
  <ul class="nav-list">
    <li class="nav-item"><a href="/home">Home</a></li>
    <li class="nav-item"><a href="/about">About</a></li>
    <li class="nav-item"><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

Which CSS selector approach is MOST maintainable?

**A)** `page.locator('.main-nav ul li:first-child a')`  
**B)** `page.locator('.nav-item:first-of-type a')`  
**C)** `page.getByRole('navigation').getByRole('link', { name: 'Home' })`  
**D)** `page.locator('nav > ul > li:nth-child(1) > a')`

### Explanation

**Correct Answer: C**

**Why C is correct:**
- Uses semantic locators that reflect the element's purpose and content
- `getByRole('navigation')` finds the nav element by its semantic role
- `getByRole('link', { name: 'Home' })` finds the specific link by its accessible name
- This approach is user-centric and accessibility-focused
- It remains stable even if the HTML structure or CSS classes change

**Why other options are less ideal:**
- **A)** Depends on specific class names and HTML structure
- **B)** Better than A but still relies on CSS classes and positional selection
- **D)** Very brittle with multiple levels of structural dependency

**Key Learning:** Even when CSS selectors are needed, prefer semantic approaches that combine built-in locators for better maintainability.

---

## Question 5: Locator Performance and Caching

You have a test that interacts with the same element multiple times. Which approach is BEST for performance and readability?

**A)**
```typescript
await page.getByRole('button', { name: 'Submit' }).waitFor();
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
```

**B)**
```typescript
const submitButton = page.getByRole('button', { name: 'Submit' });
await submitButton.waitFor();
await submitButton.click();
await expect(submitButton).toBeDisabled();
```

**C)**
```typescript
await page.locator('button:has-text("Submit")').waitFor();
await page.locator('button:has-text("Submit")').click();
await expect(page.locator('button:has-text("Submit")')).toBeDisabled();
```

**D)**
```typescript
const button = page.locator('#submit-btn');
await button.waitFor();
await button.click();
await expect(button).toBeDisabled();
```

### Explanation

**Correct Answer: B**

**Why B is correct:**
- Caches the locator in a variable, avoiding repeated locator creation
- Uses the semantic `getByRole()` locator for better maintainability
- Improves both performance and code readability
- Makes the test intent clear through descriptive variable naming
- Reduces the chance of typos in repeated locator expressions

**Why other options are less ideal:**
- **A)** Recreates the same locator multiple times, impacting performance
- **C)** Uses CSS selector instead of semantic locator, and recreates locator multiple times
- **D)** While it caches the locator, it uses an ID-based selector which is less semantic

**Key Learning:** Cache frequently used locators in variables to improve performance and readability while using semantic locator strategies.

---

## Question 6: Debugging Locator Issues

Your test is failing because a locator isn't finding any elements. Which debugging approach is MOST systematic?

**A)** Add `await page.pause()` and inspect the page manually  
**B)** Use `console.log()` to print the page content  
**C)** Validate the locator with `await expect(locator).toHaveCount(1)` before interaction  
**D)** Try different locator strategies until one works  

### Explanation

**Correct Answer: C**

**Why C is correct:**
- Provides systematic validation of locator behavior before interaction
- `toHaveCount(1)` ensures exactly one element is found (not zero, not multiple)
- Gives clear feedback about whether the locator is working correctly
- Can be combined with other validations like `toBeVisible()` and `toBeEnabled()`
- Helps identify the root cause of locator issues quickly

**Why other options are less ideal:**
- **A)** Manual inspection is time-consuming and doesn't provide automated feedback
- **B)** Console logging is helpful but doesn't validate locator behavior systematically
- **D)** Trial-and-error approach without understanding why locators fail

**Key Learning:** Use systematic locator validation with assertions like `toHaveCount()` to debug locator issues effectively.

---

## Bonus Question: Advanced Locator Strategies

You're testing a complex e-commerce product grid where each product has dynamic attributes and you need to find a specific product that is both "in stock" and costs more than $100. Which approach demonstrates the MOST advanced locator strategy?

**A)**
```typescript
page.locator('.product-card')
  .filter({ has: page.locator('.in-stock') })
  .filter({ has: page.locator('.price:has-text("$1")') })
  .first()
```

**B)**
```typescript
page.locator('.product-card:has(.in-stock):has(.price:regex("\\$[1-9]\\d{2,}"))')
```

**C)**
```typescript
page.locator('.product-card')
  .filter({ has: page.locator('.in-stock') })
  .filter({ 
    has: page.locator('.price').filter({ 
      hasText: /\$([1-9]\d{2,}|\d{4,})/ 
    }) 
  })
  .first()
```

**D)**
```typescript
page.getByTestId('product-grid')
  .locator('.product-card')
  .filter({ hasText: 'In Stock' })
  .filter({ hasText: /\$[1-9]\d{2,}/ })
```

### Explanation

**Correct Answer: C**

**Why C is correct:**
- Uses multiple chained filters for complex conditions
- Properly handles the stock status with element presence checking
- Uses a precise regular expression to match prices over $100
- Maintains readability through proper formatting and structure
- Demonstrates advanced filtering techniques with nested locators

**Why other options are less ideal:**
- **A)** The price regex is too simple and would match "$1" (not over $100)
- **B)** Complex CSS selector that's hard to read and maintain
- **D)** Good approach but the regex might match prices under $100 (like "$19")

**Key Learning:** Advanced locator strategies combine multiple filters, precise regular expressions, and nested locator conditions while maintaining code readability.

---

## Scoring Guide

### Score Calculation
- **Questions 1-6**: 1 point each (6 points total)
- **Bonus Question**: 1 additional point (7 points maximum)
- **Passing Score**: 5/6 (83%) or 4/6 (67%) with bonus correct

### Performance Levels

**Excellent (6-7 points)**
- Mastery of all locator strategies
- Understanding of best practices and performance optimization
- Ready for advanced E2E testing concepts
- Can mentor others on locator strategies

**Good (4-5 points)**
- Solid understanding of core locator concepts
- Some areas for improvement in advanced strategies
- Ready to proceed with guided practice
- Should review dynamic content handling

**Needs Improvement (2-3 points)**
- Basic understanding but gaps in key concepts
- Should review lesson content and practice exercises
- Focus on built-in locators and best practices
- Additional hands-on practice recommended

**Requires Review (0-1 points)**
- Fundamental concepts not yet mastered
- Complete lesson review required
- Extensive hands-on practice needed
- Consider additional resources and support

## Next Steps Based on Performance

### If You Scored Well (5+ points)
- Proceed to **Lesson 06: Interacting with Web Elements**
- Consider exploring advanced locator patterns
- Practice with real-world applications
- Share knowledge with team members

### If You Need Improvement (3-4 points)
- Review the lesson content, focusing on areas you missed
- Complete additional hands-on exercises
- Practice with the provided code examples
- Seek clarification on challenging concepts

### If You Need Significant Review (0-2 points)
- Re-read the entire lesson content
- Work through all hands-on exercises step by step
- Practice with simpler examples before complex scenarios
- Consider additional resources or mentoring

## Reflection Questions

After completing the assessment, consider these questions:

1. **Which locator strategy do you find most intuitive and why?**
2. **What challenges did you face with dynamic content handling?**
3. **How will you apply these locator strategies in your own testing projects?**
4. **What additional practice do you need to feel confident with locators?**

## Additional Resources for Improvement

- [Playwright Locators Documentation](https://playwright.dev/docs/locators)
- [CSS Selector Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [ARIA Roles and Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Regular Expressions for Text Matching](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

---

**Remember**: The goal is not just to pass the assessment, but to develop a deep understanding of locator strategies that will serve you throughout your E2E testing career. Focus on semantic, maintainable approaches that create reliable and readable tests.