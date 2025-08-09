# Lesson 04 Assessment: Advanced CSS Selectors and Combinators

## Overview

This assessment evaluates your understanding of advanced CSS selector techniques including structural pseudo-classes, negation selectors, relational pseudo-classes, and complex selector patterns. You'll demonstrate proficiency in creating efficient, maintainable, and automation-friendly selectors for modern web development and QA testing scenarios.

## Assessment Format

**Duration:** 90 minutes  
**Type:** Practical implementation with theory questions  
**Tools:** Text editor, browser with developer tools  
**Resources:** MDN documentation, lesson examples (reference only)

## Learning Objectives Assessment

This assessment measures your ability to:

- [ ] Implement complex `:nth-child()` and `:nth-of-type()` patterns
- [ ] Use `:not()` pseudo-class for exclusion-based selections
- [ ] Apply `:has()` pseudo-class for parent-child relationship targeting
- [ ] Create advanced attribute selectors with substring matching
- [ ] Design performance-optimized selector chains
- [ ] Build testing-friendly selectors with data attributes
- [ ] Analyze selector efficiency and browser compatibility

## Part A: Theoretical Understanding (20 points)

### Question 1: Selector Parsing (5 points)

Explain how browsers parse CSS selectors and why this impacts performance. Include:

1. The direction browsers read selectors (left-to-right vs right-to-left)
2. Why `.button` is faster than `div.container .sidebar button.button`
3. One practical example of optimization

**Sample Answer Framework:**
```
Browsers parse selectors from [direction] because...
Performance impact occurs when...
Optimization example: [before] → [after]
```

### Question 2: Browser Compatibility (5 points)

Complete this compatibility matrix:

| Selector | Chrome | Firefox | Safari | IE11 | Notes |
|----------|--------|---------|--------|------|-------|
| `:nth-child(3n+1)` | ✅ | ✅ | ✅ | ? | |
| `:has(.child)` | ? | ? | ? | ? | |
| `[attr^="value"]` | ✅ | ✅ | ✅ | ? | |
| `:not(.class1, .class2)` | ? | ? | ? | ? | |

### Question 3: Specificity Calculation (5 points)

Calculate the specificity values for these selectors:

1. `.container .sidebar button:hover` = ___
2. `#header nav.primary > ul li:first-child` = ___
3. `[data-testid="submit"]:not(.disabled)` = ___
4. `.form:has(.error) input:invalid` = ___

### Question 4: Performance Analysis (5 points)

Rank these selectors from fastest to slowest and explain your reasoning:

```css
A. .button-primary
B. button[type="submit"]
C. .container .form .field input[type="text"]
D. *:has(.target)
E. #submit-btn
```

**Ranking:** ___ → ___ → ___ → ___ → ___

## Part B: Practical Implementation (60 points)

### Task 1: E-commerce Product Grid (20 points)

Create a responsive product grid with advanced selector-based styling:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Grid Assessment</title>
    <style>
        /* Your CSS implementation here */
    </style>
</head>
<body>
    <div class="product-grid" data-testid="product-container">
        <div class="product-card" data-product-id="1" data-category="electronics" data-testid="product-1">
            <div class="product-badge sale">Sale</div>
            <img src="laptop.jpg" alt="Laptop" class="product-image">
            <div class="product-info">
                <h3 class="product-title">Gaming Laptop</h3>
                <span class="product-price" data-original="1299.99" data-sale="999.99">$999.99</span>
                <div class="product-rating">
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star"></span>
                </div>
                <button class="add-to-cart" data-testid="add-to-cart-1">Add to Cart</button>
            </div>
        </div>
        
        <div class="product-card" data-product-id="2" data-category="books" data-testid="product-2">
            <div class="product-badge new">New</div>
            <img src="book.jpg" alt="Book" class="product-image">
            <div class="product-info">
                <h3 class="product-title">QA Testing Guide</h3>
                <span class="product-price">$29.99</span>
                <div class="product-rating">
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                </div>
                <button class="add-to-cart" data-testid="add-to-cart-2">Add to Cart</button>
            </div>
        </div>
        
        <div class="product-card" data-product-id="3" data-category="electronics" data-testid="product-3">
            <img src="phone.jpg" alt="Phone" class="product-image">
            <div class="product-info">
                <h3 class="product-title">Smartphone</h3>
                <span class="product-price">$599.99</span>
                <div class="product-rating">
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star filled"></span>
                    <span class="star"></span>
                    <span class="star"></span>
                </div>
                <button class="add-to-cart disabled" data-testid="add-to-cart-3" disabled>Out of Stock</button>
            </div>
        </div>
        
        <!-- Continue pattern for products 4-12 -->
    </div>
</body>
</html>
```

**Requirements (implement these with CSS selectors):**

1. **Structural Styling (5 points)**
   - Every 3rd product gets a subtle highlight border
   - First 2 products in each row get special "featured" styling
   - Last product in the grid gets "closing deal" emphasis

2. **Badge-Based Styling (5 points)**
   - Products with "sale" badges get red accent borders
   - Products with "new" badges get green accent borders  
   - Products without badges get default styling

3. **Rating System (5 points)**
   - 5-star products get gold highlight
   - 4+ star products get silver highlight
   - Products with less than 3 stars get muted appearance

4. **Interactive States (5 points)**
   - Enabled "Add to Cart" buttons get hover animations
   - Disabled buttons get grayed-out appearance
   - Products without sale badges hover differently than sale products

**CSS Selectors You Must Use:**
```css
/* Structural pseudo-classes */
.product-card:nth-child(3n) { }
.product-card:nth-child(-n+2) { }
.product-card:last-child { }

/* :has() relational selectors */
.product-card:has(.product-badge.sale) { }
.product-card:has(.product-badge.new) { }
.product-card:not(:has(.product-badge)) { }

/* Complex rating logic */
.product-card:has(.star.filled:nth-child(5)) { }
.product-card:has(.star.filled:nth-child(4)):not(:has(.star.filled:nth-child(5))) { }

/* Interactive states */
.add-to-cart:not([disabled]):hover { }
.product-card:not(:has(.product-badge.sale)):hover { }
```

### Task 2: Form Validation Dashboard (20 points)

Create a dynamic form with CSS-only validation indicators:

```html
<form class="validation-form" data-testid="user-registration">
    <fieldset class="form-section">
        <legend>Personal Information</legend>
        
        <div class="form-group" data-field="username">
            <label for="username">Username *</label>
            <input type="text" id="username" required minlength="3" pattern="[a-zA-Z0-9_]+" data-testid="input-username">
            <div class="validation-feedback">
                <span class="requirement" data-check="required">Required field</span>
                <span class="requirement" data-check="minlength">At least 3 characters</span>
                <span class="requirement" data-check="pattern">Letters, numbers, underscore only</span>
            </div>
        </div>
        
        <div class="form-group" data-field="email">
            <label for="email">Email Address *</label>
            <input type="email" id="email" required data-testid="input-email">
            <div class="validation-feedback">
                <span class="requirement" data-check="required">Required field</span>
                <span class="requirement" data-check="email">Valid email format</span>
            </div>
        </div>
        
        <div class="form-group" data-field="password">
            <label for="password">Password *</label>
            <input type="password" id="password" required minlength="8" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)" data-testid="input-password">
            <div class="validation-feedback">
                <span class="requirement" data-check="required">Required field</span>
                <span class="requirement" data-check="minlength">At least 8 characters</span>
                <span class="requirement" data-check="uppercase">One uppercase letter</span>
                <span class="requirement" data-check="lowercase">One lowercase letter</span>
                <span class="requirement" data-check="number">One number</span>
            </div>
        </div>
    </fieldset>
    
    <fieldset class="form-section">
        <legend>Preferences</legend>
        
        <div class="checkbox-group">
            <input type="checkbox" id="newsletter" data-testid="checkbox-newsletter">
            <label for="newsletter">Subscribe to newsletter</label>
            
            <input type="checkbox" id="terms" required data-testid="checkbox-terms">
            <label for="terms">I agree to terms and conditions *</label>
        </div>
    </fieldset>
    
    <div class="form-actions">
        <button type="submit" data-testid="submit-btn">Create Account</button>
    </div>
</form>
```

**Requirements (10 points each):**

1. **Field State Indicators**
   - Valid fields show green checkmarks
   - Invalid fields show red X marks  
   - Required fields show red asterisks in labels
   - Fields with user input (not empty) get different border colors

2. **Advanced Validation Logic**
   - Form groups with invalid required fields get error styling
   - Form groups with valid complex patterns (password) get success styling
   - Submit button only enabled when all required fields are valid
   - Checkbox groups style differently based on checked state

**Required Selectors:**
```css
/* Field states */
.form-group:has(input:valid) { }
.form-group:has(input:invalid) { }
.form-group:has(input:required) label::after { }
.form-group:has(input:not(:placeholder-shown)) { }

/* Complex validation */
.form-group:has(input:required:invalid) { }
.form-group:has(input[pattern]:valid) { }
button[type="submit"]:has(~ form input:required:invalid) { }
.checkbox-group:has(input:checked) { }
```

### Task 3: Data Table with Conditional Formatting (20 points)

Create a sortable data table with advanced CSS-based conditional formatting:

```html
<div class="table-container" data-testid="users-table">
    <table class="data-table">
        <thead>
            <tr>
                <th data-sort="name" data-testid="header-name">Name</th>
                <th data-sort="status" data-testid="header-status">Status</th>
                <th data-sort="role" data-testid="header-role">Role</th>
                <th data-sort="lastActive" data-testid="header-activity">Last Active</th>
                <th data-testid="header-actions">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr class="table-row" data-user-id="1" data-testid="user-row-1">
                <td class="name-cell">John Doe</td>
                <td class="status-cell" data-status="active" data-priority="normal">Active</td>
                <td class="role-cell" data-role="admin">Administrator</td>
                <td class="activity-cell" data-minutes="30">30 minutes ago</td>
                <td class="actions-cell">
                    <button class="action-btn edit" data-testid="edit-user-1">Edit</button>
                    <button class="action-btn delete" data-testid="delete-user-1">Delete</button>
                </td>
            </tr>
            
            <tr class="table-row" data-user-id="2" data-testid="user-row-2">
                <td class="name-cell">Jane Smith</td>
                <td class="status-cell" data-status="warning" data-priority="high">Warning</td>
                <td class="role-cell" data-role="user">User</td>
                <td class="activity-cell" data-minutes="1440">1 day ago</td>
                <td class="actions-cell">
                    <button class="action-btn edit" data-testid="edit-user-2">Edit</button>
                    <button class="action-btn delete" data-testid="delete-user-2">Delete</button>
                </td>
            </tr>
            
            <tr class="table-row" data-user-id="3" data-testid="user-row-3">
                <td class="name-cell">Bob Johnson</td>
                <td class="status-cell" data-status="critical" data-priority="urgent">Critical</td>
                <td class="role-cell" data-role="user">User</td>
                <td class="activity-cell" data-minutes="7200">5 days ago</td>
                <td class="actions-cell">
                    <button class="action-btn edit" data-testid="edit-user-3">Edit</button>
                    <button class="action-btn delete disabled" data-testid="delete-user-3" disabled>Delete</button>
                </td>
            </tr>
            
            <!-- Continue pattern for more users -->
        </tbody>
    </table>
</div>
```

**Requirements:**

1. **Status-Based Row Styling (7 points)**
   - Critical status rows: red left border + light red background
   - Warning status rows: orange left border + light orange background  
   - Active status rows: green left border + light green background
   - Zebra striping that excludes status-highlighted rows

2. **Role-Based Element Styling (7 points)**
   - Admin users get different name cell styling
   - Admin users get additional action buttons
   - Rows with admin users get subtle crown icons
   - Non-admin rows with critical status get escalation indicators

3. **Activity-Based Conditional Formatting (6 points)**
   - Users active within 1 hour: green activity cell
   - Users active within 1 day: yellow activity cell  
   - Users inactive over 3 days: red activity cell
   - Combine activity status with role for complex highlighting

**Required Complex Selectors:**
```css
/* Status-based row styling */
.table-row:has([data-status="critical"]) { }
.table-row:has([data-status="warning"]):not(:has([data-status="critical"])) { }
.table-row:nth-child(even):not(:has([data-status])) { }

/* Role-based styling */
.table-row:has([data-role="admin"]) .name-cell { }
.table-row:has([data-role="admin"]) .actions-cell { }
.table-row:has([data-role="admin"]):has([data-status="critical"]) { }

/* Activity-based styling */
.table-row:has([data-minutes$="30"]) .activity-cell { }
.table-row:has([data-minutes="1440"]) .activity-cell { }
.table-row:has([data-minutes^="7"]) .activity-cell { }
```

## Part C: Performance and Testing (20 points)

### Task 4: Selector Performance Analysis (10 points)

Given this HTML structure with 1000+ similar elements:

```html
<div class="app">
    <div class="container">
        <div class="main-content">
            <div class="widget-grid">
                <!-- 1000+ widget elements -->
                <div class="widget" data-widget-id="1" data-type="chart">
                    <div class="widget-header">
                        <h3 class="widget-title">Chart Widget</h3>
                        <button class="widget-action refresh">Refresh</button>
                    </div>
                    <div class="widget-content">
                        <canvas class="chart-canvas"></canvas>
                    </div>
                </div>
                <!-- ... more widgets -->
            </div>
        </div>
    </div>
</div>
```

**Performance Questions:**

1. **Selector Efficiency (5 points)**
   
   Rank these selectors by performance (1 = fastest, 5 = slowest):
   
   ```css
   A. .widget-title
   B. .app .container .main-content .widget .widget-header .widget-title
   C. [data-widget-id]
   D. .widget > .widget-header > .widget-title
   E. .widget-grid .widget .widget-title
   ```
   
   **Your ranking:** A=___, B=___, C=___, D=___, E=___

2. **Optimization Recommendations (5 points)**
   
   Rewrite these inefficient selectors for better performance:
   
   ```css
   /* Original: Poor performance */
   .app .container .main-content .widget-grid .widget .widget-header .widget-title { }
   
   /* Optimized: _________________________ */
   
   /* Original: Poor performance */
   .widget * .widget-content * .chart-canvas { }
   
   /* Optimized: _________________________ */
   
   /* Original: Poor performance */
   .widget:has(.widget-header:has(.widget-title:contains("Chart"))) { }
   
   /* Optimized: _________________________ */
   ```

### Task 5: Test Automation Integration (10 points)

Design CSS selectors optimized for test automation tools:

**Scenario:** You're creating selectors for Playwright/Selenium tests that need to be:
- Stable across UI changes
- Fast to execute
- Easy to maintain
- Resistant to CSS framework updates

**Requirements:**

1. **Stable Selectors (5 points)**
   
   Choose the BEST selector for test automation from each group:
   
   ```css
   /* Login button */
   A. button.btn.btn-primary.submit-button
   B. [data-testid="login-submit"]
   C. form > div:last-child > button:first-child
   D. .login-form .form-actions .primary-button
   ```
   **Answer:** ___
   
   ```css
   /* Email input field */
   A. input[type="email"]
   B. .form-group:nth-child(2) input
   C. [data-testid="email-input"]
   D. #email-field
   ```
   **Answer:** ___

2. **Selector Strategy (5 points)**
   
   Write CSS selectors for these test scenarios:
   
   ```html
   <div class="modal" data-testid="confirmation-modal">
       <div class="modal-content">
           <h2>Confirm Action</h2>
           <p>Are you sure you want to delete this item?</p>
           <div class="modal-actions">
               <button class="btn cancel" data-testid="modal-cancel">Cancel</button>
               <button class="btn confirm danger" data-testid="modal-confirm">Delete</button>
           </div>
       </div>
   </div>
   ```
   
   **Write selectors for:**
   - Modal container: _______________
   - Cancel button specifically: _______________  
   - Any button in the modal: _______________
   - Confirm button only when modal is visible: _______________

## Submission Requirements

Submit your assessment as a single HTML file named `assessment-solution.html` containing:

1. **All CSS implementations** in `<style>` tags
2. **Theory answers** in HTML comments
3. **Working demonstrations** of all practical tasks
4. **Performance analysis** in structured comments

## Grading Rubric

| Component | Excellent (A) | Good (B) | Satisfactory (C) | Needs Improvement (D/F) |
|-----------|---------------|----------|------------------|------------------------|
| **Theory** | All concepts correct, detailed explanations | Minor errors, good understanding | Basic understanding, some gaps | Major gaps, incorrect concepts |
| **Implementation** | All selectors work perfectly, optimized | Most selectors work, minor issues | Basic functionality, some errors | Major implementation problems |
| **Performance** | Excellent optimization, best practices | Good performance considerations | Basic optimization awareness | Poor performance choices |
| **Testing** | Perfect automation-friendly selectors | Good testing considerations | Basic testing awareness | Poor testing practices |

## Time Management Suggestions

- **Part A (Theory):** 20 minutes
- **Part B (Implementation):** 60 minutes  
  - Task 1: 20 minutes
  - Task 2: 20 minutes
  - Task 3: 20 minutes
- **Part C (Performance/Testing):** 10 minutes

## Success Criteria

To pass this assessment, you must:

- [ ] Score 70% or higher overall
- [ ] Demonstrate correct use of advanced pseudo-classes
- [ ] Show understanding of selector performance implications
- [ ] Create automation-friendly selector patterns
- [ ] Implement working solutions for all practical tasks

## Common Pitfalls to Avoid

1. **Overly Specific Selectors:** Don't chain more than 3-4 levels
2. **Browser Compatibility:** Remember `:has()` support limitations
3. **Performance Impact:** Avoid universal selectors in chains
4. **Testing Brittleness:** Don't rely on positional selectors for tests
5. **Selector Conflicts:** Watch for CSS specificity issues

## Next Steps

After completing this assessment:
- Review any areas where you scored below expectations
- Practice with the lesson examples for reinforcement
- Proceed to [Lesson 05: XPath Fundamentals](../lesson-05-xpath-fundamentals/content.md)
- Consider the advanced challenges in the lesson exercises

## Resources for Review

- [Lesson 04 Content](./content.md)
- [Advanced Selector Examples](./examples/)
- [Practice Exercises](./exercises/)
- [MDN CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)