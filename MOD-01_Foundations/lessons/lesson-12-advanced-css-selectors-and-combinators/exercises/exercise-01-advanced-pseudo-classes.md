# Exercise 01: Advanced Pseudo-Classes

## Overview

This exercise focuses on mastering advanced pseudo-class selectors including `:nth-child()`, `:nth-of-type()`, `:not()`, and `:has()`. You'll create practical implementations that demonstrate precise element targeting techniques essential for modern web development and automated testing.

## Learning Objectives

By completing this exercise, you will:
- Implement complex `:nth-child()` patterns for dynamic styling
- Use `:not()` to create exclusion-based selectors  
- Apply `:has()` for parent-child relationship targeting
- Combine multiple pseudo-classes for sophisticated selections
- Create testing-friendly selectors with data attributes

## Prerequisites

- Completion of [Lesson 03: CSS Selectors Fundamentals](../../lesson-03-css-selectors-fundamentals/content.md)
- Understanding of basic CSS syntax and HTML structure
- Familiarity with browser developer tools

## Exercise Instructions

### Part A: Structural Pseudo-Classes (30 minutes)

Create an HTML file called `pseudo-class-practice.html` with the following requirements:

#### 1. nth-child() Patterns

Create a grid of 20 items and use CSS selectors to:

```html
<div class="item-grid">
    <div class="grid-item" data-testid="item-1">Item 1</div>
    <div class="grid-item" data-testid="item-2">Item 2</div>
    <!-- ... continue to item-20 -->
</div>
```

**Required CSS Selectors:**
- Style every 3rd item with a blue background
- Apply special styling to the first 5 items  
- Target only odd-numbered items in the second half (items 11-20)
- Create a zebra-stripe pattern that excludes the first and last items

```css
/* Your CSS solutions here */
.grid-item:nth-child(3n) {
    /* Blue background for every 3rd item */
}

.grid-item:nth-child(-n+5) {
    /* Special styling for first 5 items */
}

/* Complete the remaining selectors */
```

#### 2. nth-of-type() vs nth-child()

Create a mixed content section and demonstrate the difference:

```html
<div class="mixed-content">
    <h3>Section Title</h3>
    <p>First paragraph</p>
    <p>Second paragraph</p>
    <div>First div</div>
    <p>Third paragraph</p>
    <div>Second div</div>
    <p>Fourth paragraph</p>
</div>
```

**Tasks:**
- Style the 2nd paragraph using `:nth-of-type()`
- Style the 2nd paragraph using `:nth-child()` 
- Explain why the results are different in comments

### Part B: Negation Pseudo-Class (20 minutes)

#### 3. Complex :not() Selectors

Create a button collection with various states:

```html
<div class="button-collection">
    <button class="btn primary" data-testid="btn-save">Save</button>
    <button class="btn secondary" data-testid="btn-cancel">Cancel</button>
    <button class="btn primary" disabled data-testid="btn-submit">Submit</button>
    <button class="btn danger" data-testid="btn-delete">Delete</button>
    <button class="btn" data-testid="btn-help">Help</button>
    <a href="#" class="btn-link" data-testid="link-more">Learn More</a>
</div>
```

**Required Selectors:**
```css
/* Style all buttons except primary and disabled ones */
.btn:not(.primary):not([disabled]) {
    /* Your styles */
}

/* Target elements with data-testid that don't start with "btn-" */
[data-testid]:not([data-testid^="btn-"]) {
    /* Your styles */
}

/* Style all elements except the danger button and links */
.button-collection *:not(.danger):not(.btn-link) {
    /* Your styles */
}
```

### Part C: Relational Pseudo-Class (25 minutes)

#### 4. :has() Selector Implementation

Create a card layout system that styles based on content:

```html
<div class="card-container">
    <div class="card" data-testid="card-basic">
        <h3>Basic Card</h3>
        <p>Simple content card</p>
    </div>
    
    <div class="card" data-testid="card-image">
        <img src="placeholder.jpg" alt="Sample">
        <div class="card-content">
            <h3>Image Card</h3>
            <p>Card with image</p>
        </div>
    </div>
    
    <div class="card" data-testid="card-badge">
        <div class="badge urgent">Urgent</div>
        <h3>Badge Card</h3>
        <p>Card with priority badge</p>
    </div>
    
    <div class="card" data-testid="card-interactive">
        <h3>Interactive Card</h3>
        <p>Card with actions</p>
        <button class="action-btn" data-testid="card-action">Action</button>
    </div>
</div>
```

**Required :has() Selectors:**
```css
/* Cards containing images should have no padding */
.card:has(img) {
    padding: 0;
    overflow: hidden;
}

/* Cards with badges get colored border */
.card:has(.badge) {
    border-left: 4px solid var(--badge-color);
}

/* Cards with urgent badges get red accent */
.card:has(.badge.urgent) {
    --badge-color: #e74c3c;
    background: rgba(231, 76, 60, 0.05);
}

/* Interactive cards get hover effects */
.card:has(.action-btn):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

#### 5. Form Validation with :has()

Create a form that uses `:has()` for validation styling:

```html
<form class="validation-form" data-testid="contact-form">
    <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" id="name" required data-testid="input-name">
        <span class="error-message">Name is required</span>
    </div>
    
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" required data-testid="input-email">
        <span class="error-message">Valid email is required</span>
    </div>
    
    <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" data-testid="input-phone">
    </div>
</form>
```

**Form Validation Selectors:**
```css
/* Form groups with invalid inputs */
.form-group:has(input:invalid) {
    /* Error styling */
}

/* Form groups with valid required inputs */
.form-group:has(input:required:valid) {
    /* Success styling */
}

/* Show error messages only for invalid inputs */
.form-group:has(input:invalid) .error-message {
    display: block;
}

.form-group:not(:has(input:invalid)) .error-message {
    display: none;
}
```

### Part D: Advanced Combinations (15 minutes)

#### 6. Complex Selector Chains

Create a data table with conditional formatting:

```html
<table class="data-table" data-testid="user-table">
    <thead>
        <tr>
            <th>User</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr data-testid="user-row-1">
            <td>John Doe</td>
            <td data-status="active">Active</td>
            <td>Admin</td>
            <td><button data-testid="edit-user-1">Edit</button></td>
        </tr>
        <tr data-testid="user-row-2">
            <td>Jane Smith</td>
            <td data-status="warning">Warning</td>
            <td>User</td>
            <td><button data-testid="edit-user-2">Edit</button></td>
        </tr>
        <tr data-testid="user-row-3">
            <td>Bob Johnson</td>
            <td data-status="critical">Critical</td>
            <td>User</td>
            <td><button data-testid="edit-user-3">Edit</button></td>
        </tr>
    </tbody>
</table>
```

**Advanced Combination Selectors:**
```css
/* Zebra striping that excludes highlighted rows */
.data-table tbody tr:nth-child(even):not([data-highlight]):not(:hover) {
    background: #f8f9fa;
}

/* Rows with critical status get red styling */
.data-table tbody tr:has(td[data-status="critical"]) {
    background: rgba(231, 76, 60, 0.1);
    border-left: 4px solid #e74c3c;
}

/* Rows with warnings (but not critical) get orange styling */
.data-table tbody tr:has(td[data-status="warning"]):not(:has(td[data-status="critical"])) {
    background: rgba(243, 156, 18, 0.1);
    border-left: 4px solid #f39c12;
}

/* Edit buttons in critical rows get different styling */
.data-table tbody tr:has(td[data-status="critical"]) button[data-testid^="edit-"] {
    background: #e74c3c;
    color: white;
}
```

## Testing Your Selectors

Use browser developer tools to verify your selectors:

1. **Open Developer Tools** (`F12` or `Ctrl+Shift+I`)
2. **Use Console to test selectors:**
   ```javascript
   // Test nth-child selector
   document.querySelectorAll('.grid-item:nth-child(3n)').length
   
   // Test :not() selector  
   document.querySelectorAll('.btn:not(.primary):not([disabled])')
   
   // Test :has() selector (modern browsers)
   document.querySelectorAll('.card:has(.badge)')
   ```
3. **Verify styling with Elements panel**
4. **Test responsiveness and browser compatibility**

## Expected Deliverables

Submit the following files:

1. **`pseudo-class-practice.html`** - Complete HTML file with all exercises
2. **`styles.css`** - CSS file with all required selectors and styling
3. **`testing-notes.md`** - Document your testing process and browser compatibility findings

## Success Criteria

Your solution should demonstrate:

- [ ] Correct implementation of all `:nth-child()` patterns
- [ ] Proper use of `:not()` for exclusion logic
- [ ] Functional `:has()` selectors for relational targeting  
- [ ] Clean, maintainable CSS with good performance characteristics
- [ ] Proper use of `data-testid` attributes for automation-friendly selectors
- [ ] Cross-browser compatibility considerations (note :has() support)

## Common Pitfalls to Avoid

1. **Overly Complex Selectors:** Keep specificity reasonable for maintainability
2. **Browser Support:** Test `:has()` selectors in target browsers  
3. **Performance Impact:** Avoid deeply nested `:has()` chains
4. **Selector Order:** Remember CSS cascade and specificity rules
5. **Testing Integration:** Ensure selectors work well with automation tools

## Extension Challenges (Optional)

For additional practice:

1. **Dynamic Content:** Create selectors that work with JavaScript-added content
2. **Animation Integration:** Combine pseudo-classes with CSS transitions
3. **Accessibility:** Ensure selectors support screen readers and keyboard navigation
4. **Performance Optimization:** Benchmark your selectors against simpler alternatives

## Resources

- [CSS Selectors Level 4 Specification](https://www.w3.org/TR/selectors-4/)
- [MDN: CSS Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- [Can I Use: :has() selector](https://caniuse.com/css-has)
- [Lesson 04 Examples](../examples/) - Reference implementations

## Next Steps

After completing this exercise, you'll be ready for:
- [Exercise 02: Complex Selector Patterns](./exercise-02-complex-selector-patterns.md)
- [Lesson 04 Assessment](../assessment.md)
- [Lesson 05: XPath Fundamentals](../../lesson-05-xpath-fundamentals/content.md)