# Exercise 02: Complex Selector Patterns

## Overview

This exercise focuses on mastering complex CSS selector patterns including advanced attribute selectors, combinator chains, and performance-optimized targeting strategies. You'll build real-world scenarios that demonstrate sophisticated element selection techniques crucial for professional web development and test automation.

## Learning Objectives

By completing this exercise, you will:
- Implement advanced attribute selector patterns with substring matching
- Create efficient combinator chains for precise element targeting
- Design performance-optimized selectors for large-scale applications
- Build automation-friendly selectors using data attributes
- Apply complex selector logic for conditional styling and testing scenarios

## Prerequisites

- Completion of [Exercise 01: Advanced Pseudo-Classes](./exercise-01-advanced-pseudo-classes.md)
- Understanding of CSS specificity and cascade rules
- Basic knowledge of browser performance considerations

## Exercise Instructions

### Part A: Advanced Attribute Selectors (35 minutes)

#### 1. Substring Matching Patterns

Create a resource library interface that styles different link types:

```html
<div class="resource-library" data-testid="library-container">
    <h2>Learning Resources</h2>
    
    <div class="link-section">
        <h3>External Links</h3>
        <ul class="resource-list">
            <li><a href="https://playwright.dev/docs" data-testid="link-playwright-docs">Playwright Documentation</a></li>
            <li><a href="https://developer.mozilla.org/docs" data-testid="link-mdn-docs">MDN Web Docs</a></li>
            <li><a href="http://legacy-site.com" data-testid="link-legacy">Legacy Site</a></li>
            <li><a href="mailto:support@example.com" data-testid="link-email">Contact Support</a></li>
            <li><a href="tel:+1234567890" data-testid="link-phone">Call Us</a></li>
        </ul>
    </div>
    
    <div class="download-section">
        <h3>Downloads</h3>
        <ul class="download-list">
            <li><a href="guide.pdf" data-testid="download-pdf">Testing Guide (PDF)</a></li>
            <li><a href="template.docx" data-testid="download-word">Template Document</a></li>
            <li><a href="data.xlsx" data-testid="download-excel">Test Data (Excel)</a></li>
            <li><a href="script.js" data-testid="download-script">Sample Script</a></li>
            <li><a href="config.json" data-testid="download-config">Configuration File</a></li>
        </ul>
    </div>
</div>
```

**Required Attribute Selectors:**

```css
/* Secure HTTPS links - green with lock icon */
a[href^="https"] {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    text-decoration: none;
}

a[href^="https"]::after {
    content: " 🔒";
}

/* Insecure HTTP links - orange warning */
a[href^="http"]:not([href^="https"]) {
    /* Your implementation */
}

/* Email links - blue with envelope icon */
a[href^="mailto:"] {
    /* Your implementation */
}

/* Phone links - purple with phone icon */
a[href^="tel:"] {
    /* Your implementation */
}

/* PDF downloads - red styling */
a[href$=".pdf"] {
    /* Your implementation */
}

/* Office documents - blue styling */
a[href$=".docx"], a[href$=".xlsx"] {
    /* Your implementation */
}

/* Development files - dark styling */
a[href$=".js"], a[href$=".json"] {
    /* Your implementation */
}

/* Links containing 'docs' - special documentation styling */
a[href*="docs"] {
    /* Your implementation */
}
```

#### 2. Data Attribute Patterns

Create a component system with data-driven styling:

```html
<div class="component-showcase">
    <div class="component" data-type="button" data-variant="primary" data-size="large" data-testid="btn-primary-lg">
        Primary Large Button
    </div>
    
    <div class="component" data-type="button" data-variant="secondary" data-size="medium" data-testid="btn-secondary-md">
        Secondary Medium Button
    </div>
    
    <div class="component" data-type="input" data-variant="text" data-state="valid" data-testid="input-text-valid">
        <input type="text" placeholder="Valid input" value="test@example.com">
    </div>
    
    <div class="component" data-type="input" data-variant="email" data-state="invalid" data-testid="input-email-invalid">
        <input type="email" placeholder="Invalid input" value="invalid-email">
    </div>
    
    <div class="component" data-type="card" data-priority="high" data-status="urgent" data-testid="card-urgent">
        <h4>Urgent Card</h4>
        <p>High priority content</p>
    </div>
    
    <div class="component" data-type="card" data-priority="low" data-status="normal" data-testid="card-normal">
        <h4>Normal Card</h4>
        <p>Standard priority content</p>
    </div>
</div>
```

### Part B: Combinator Mastery (30 minutes)

#### 3. Navigation Menu System

Create a complex navigation with multiple levels and implement precise combinator selectors for styling and functionality.

### Part C: Performance-Optimized Selectors (25 minutes)

#### 4. Efficient Selector Patterns

Create performance-optimized selectors that maintain functionality while ensuring fast browser parsing and execution.

## Testing and Validation

Use browser developer tools to test selector performance and verify correct targeting.

## Expected Deliverables

Submit complete HTML, CSS, and documentation files demonstrating mastery of complex selector patterns.

## Success Criteria

- [ ] Correct implementation of advanced attribute selectors
- [ ] Efficient combinator usage with appropriate specificity
- [ ] Performance-optimized selector patterns
- [ ] Test-automation-friendly implementations
- [ ] Cross-browser compatibility

## Resources

- [CSS Selectors Performance Guide](https://developers.google.com/web/fundamentals/performance/rendering/)
- [MDN: Advanced Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [Lesson 04 Examples](../examples/)

## Next Steps

After completing this exercise:
- Take the [Lesson 04 Assessment](../assessment.md)
- Proceed to [Lesson 05: XPath Fundamentals](../../lesson-05-xpath-fundamentals/content.md)