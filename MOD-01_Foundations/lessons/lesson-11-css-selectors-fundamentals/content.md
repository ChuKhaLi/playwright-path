# Lesson 03: CSS Selectors Fundamentals

## Learning Objectives
By the end of this lesson, you will be able to:
- **Identify** the five basic types of CSS selectors (element, class, ID, attribute, universal)
- **Explain** how CSS selector specificity determines which styles are applied
- **Create** CSS rules using different selector combinations for styling web elements
- **Recognize** the relationship between CSS selectors and web element identification in testing
- **Apply** CSS selectors to style HTML forms and interactive elements
- **Understand** why CSS selectors are important for both styling and automated testing

## Introduction

CSS (Cascading Style Sheets) selectors are patterns used to select and style HTML elements on a web page. Think of selectors as a way to "point to" specific elements and say "I want to style these particular elements this way."

In the context of QA automation, CSS selectors serve a dual purpose:
1. **Styling**: They determine how web elements look and behave visually
2. **Testing**: They provide a reliable way to identify and interact with elements during automated testing

Understanding CSS selectors is crucial for QA professionals because:
- Many testing frameworks use CSS selectors to locate elements
- You need to understand how developers structure and identify elements
- CSS selectors are often more stable and readable than other locator strategies
- They help you communicate effectively with developers about element identification

## What Are CSS Selectors?

A CSS selector is a pattern that matches one or more HTML elements. When you write CSS, you're essentially saying: "Find all elements that match this pattern, and apply these styles to them."

### Basic Syntax
```css
selector {
    property: value;
    property: value;
}
```

**Example:**
```css
h1 {
    color: blue;
    font-size: 24px;
}
```

This rule says: "Find all `<h1>` elements and make their text blue with a font size of 24 pixels."

## The Five Basic CSS Selector Types

### 1. Element Selector (Type Selector)

The element selector targets HTML elements by their tag name.

**Syntax**: `elementname`

**Examples:**
```css
/* Selects all paragraph elements */
p {
    color: black;
    line-height: 1.5;
}

/* Selects all input elements */
input {
    border: 1px solid #ccc;
    padding: 8px;
}

/* Selects all h2 elements */
h2 {
    font-weight: bold;
    margin-bottom: 16px;
}
```

**HTML it would match:**
```html
<p>This paragraph will be styled</p>
<input type="text" placeholder="This input will have a border">
<h2>This heading will be bold</h2>
```

**When to use**: When you want to apply consistent styling to all elements of the same type.

### 2. Class Selector

The class selector targets elements that have a specific `class` attribute value.

**Syntax**: `.classname`

**Examples:**
```css
/* Selects all elements with class="button" */
.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
}

/* Selects all elements with class="error-message" */
.error-message {
    color: red;
    font-weight: bold;
    border: 1px solid red;
    padding: 8px;
}

/* Selects all elements with class="form-group" */
.form-group {
    margin-bottom: 15px;
}
```

**HTML it would match:**
```html
<button class="button">Click Me</button>
<div class="error-message">Please enter a valid email</div>
<div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email">
</div>
```

**Important Notes:**
- An element can have multiple classes: `<div class="form-group error-message">`
- Class names are case-sensitive
- Class names should be descriptive and reusable

### 3. ID Selector

The ID selector targets a single element with a specific `id` attribute value.

**Syntax**: `#idname`

**Examples:**
```css
/* Selects the element with id="header" */
#header {
    background-color: #333;
    color: white;
    padding: 20px;
}

/* Selects the element with id="login-form" */
#login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

/* Selects the element with id="submit-button" */
#submit-button {
    background-color: green;
    font-size: 16px;
}
```

**HTML it would match:**
```html
<header id="header">
    <h1>My Website</h1>
</header>
<form id="login-form">
    <input type="text" placeholder="Username">
    <button id="submit-button">Login</button>
</form>
```

**Important Notes:**
- IDs must be unique on a page - only one element should have a specific ID
- IDs have higher specificity than classes
- IDs are commonly used for unique page sections or important interactive elements

### 4. Attribute Selector

Attribute selectors target elements based on their attributes and attribute values.

**Basic Syntax**: `[attribute]` or `[attribute="value"]`

**Examples:**
```css
/* Selects all elements with a "required" attribute */
[required] {
    border-left: 3px solid red;
}

/* Selects all inputs with type="email" */
[type="email"] {
    background-color: #f0f8ff;
}

/* Selects all elements with data-testid attribute */
[data-testid] {
    outline: 2px dotted blue;
}

/* Selects inputs with placeholder containing "phone" */
[placeholder*="phone"] {
    border-color: green;
}
```

**HTML it would match:**
```html
<input type="text" required placeholder="Name">
<input type="email" placeholder="Email address">
<button data-testid="submit-btn">Submit</button>
<input type="tel" placeholder="Enter phone number">
```

**Attribute Selector Variations:**
- `[attr]` - Has the attribute
- `[attr="value"]` - Attribute equals exact value
- `[attr*="value"]` - Attribute contains the value
- `[attr^="value"]` - Attribute starts with the value
- `[attr$="value"]` - Attribute ends with the value

### 5. Universal Selector

The universal selector targets all elements on the page.

**Syntax**: `*`

**Examples:**
```css
/* Selects all elements */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Often used for CSS resets */
*, *::before, *::after {
    box-sizing: inherit;
}
```

**When to use**: Typically for CSS resets or applying universal box-sizing rules.

## Combining Selectors

You can combine selectors to create more specific targeting rules.

### Multiple Selectors (Grouping)
Apply the same styles to multiple selectors:

```css
/* Applies to all h1, h2, and h3 elements */
h1, h2, h3 {
    font-family: Arial, sans-serif;
    color: #333;
}

/* Applies to elements with either class */
.button, .btn {
    cursor: pointer;
    display: inline-block;
}
```

### Descendant Selector (Space)
Selects elements that are descendants of another element:

```css
/* Selects all <p> elements inside elements with class="content" */
.content p {
    margin-bottom: 16px;
}

/* Selects all <input> elements inside <form> elements */
form input {
    width: 100%;
    margin-bottom: 10px;
}
```

**HTML it would match:**
```html
<div class="content">
    <p>This paragraph will be styled</p>
    <div>
        <p>This nested paragraph will also be styled</p>
    </div>
</div>
```

### Child Selector (>)
Selects direct children only:

```css
/* Selects only direct <li> children of <ul> */
ul > li {
    list-style-type: disc;
}

/* Selects only direct <input> children of <div> with class="form-group" */
.form-group > input {
    border: 2px solid #007bff;
}
```

### Multiple Classes
Target elements that have multiple specific classes:

```css
/* Selects elements that have BOTH classes */
.button.primary {
    background-color: #007bff;
}

.form-group.error {
    border: 1px solid red;
}
```

**HTML it would match:**
```html
<button class="button primary">Primary Button</button>
<div class="form-group error">
    <input type="text" class="invalid">
</div>
```

## CSS Specificity

Specificity determines which CSS rule is applied when multiple rules target the same element. Think of it as a scoring system where higher scores win.

### Specificity Hierarchy (from highest to lowest):
1. **Inline styles** (style attribute): 1000 points
2. **IDs**: 100 points each
3. **Classes, attributes, pseudo-classes**: 10 points each
4. **Elements**: 1 point each
5. **Universal selector (*)**: 0 points

### Specificity Examples:

```css
/* Specificity: 1 (one element) */
p { color: black; }

/* Specificity: 10 (one class) */
.text { color: blue; }

/* Specificity: 100 (one ID) */
#main-text { color: red; }

/* Specificity: 11 (one class + one element) */
p.text { color: green; }

/* Specificity: 101 (one ID + one element) */
#main-text p { color: purple; }
```

**If applied to this HTML:**
```html
<p id="main-text" class="text">What color will this text be?</p>
```

**Answer**: Red, because `#main-text` has the highest specificity (100).

### Practical Specificity Tips:
- **Start with low specificity** - use classes rather than IDs when possible
- **Avoid !important** - it overrides specificity but makes CSS harder to maintain
- **Be consistent** - establish naming conventions for classes
- **Use specific selectors when needed** - but avoid overly complex chains

## Pseudo-Classes and Pseudo-Elements

Pseudo-classes and pseudo-elements allow you to style elements based on their state or position.

### Common Pseudo-Classes

Pseudo-classes select elements based on their state or position.

```css
/* Hover state - when user hovers over element */
.button:hover {
    background-color: #0056b3;
    cursor: pointer;
}

/* Focus state - when element is focused (clicked or tabbed to) */
input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* First child element */
.menu li:first-child {
    border-top: none;
}

/* Last child element */
.menu li:last-child {
    border-bottom: none;
}

/* Even/odd rows for tables */
tr:nth-child(even) {
    background-color: #f8f9fa;
}

/* Required form fields */
input:required {
    border-left: 3px solid #dc3545;
}

/* Valid form fields */
input:valid {
    border-left: 3px solid #28a745;
}

/* Invalid form fields */
input:invalid {
    border-left: 3px solid #dc3545;
}
```

### Common Pseudo-Elements

Pseudo-elements create virtual elements that don't exist in HTML.

```css
/* Add content before an element */
.required::before {
    content: "* ";
    color: red;
}

/* Add content after an element */
.external-link::after {
    content: " ↗";
    font-size: 12px;
}

/* Style the first line of a paragraph */
p::first-line {
    font-weight: bold;
}

/* Style the first letter of a paragraph */
p::first-letter {
    font-size: 2em;
    float: left;
}
```

## Practical Example: Styling a Complete Form

Let's apply CSS selectors to style the contact form from Lesson 02:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Styled Contact Form</title>
    <style>
        /* Universal selector - reset margins and padding */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Element selector - body styling */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }

        /* Class selector - container */
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        /* Element selector - heading */
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
        }

        /* Class selector - form groups */
        .form-group {
            margin-bottom: 20px;
        }

        /* Element selector - labels */
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }

        /* Multiple element selectors - all form inputs */
        input, textarea, select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }

        /* Pseudo-class - focus state for inputs */
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        /* Attribute selector - required fields */
        [required] {
            border-left: 4px solid #e74c3c;
        }

        /* Pseudo-class - valid required fields */
        [required]:valid {
            border-left: 4px solid #27ae60;
        }

        /* Class selector - submit button */
        .submit-btn {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 18px;
            transition: background-color 0.3s ease;
        }

        /* Pseudo-class - button hover state */
        .submit-btn:hover {
            background-color: #0056b3;
        }

        /* Pseudo-class - button active state */
        .submit-btn:active {
            transform: translateY(1px);
        }

        /* Pseudo-element - add asterisk to required field labels */
        .required-label::after {
            content: " *";
            color: #e74c3c;
        }

        /* Class selector - error messages */
        .error-message {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }

        /* Show error messages when parent has error class */
        .form-group.error .error-message {
            display: block;
        }

        /* Style invalid inputs when parent has error class */
        .form-group.error input,
        .form-group.error textarea {
            border-color: #e74c3c;
            background-color: #fdf2f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Contact Us</h1>
        <form action="/contact" method="post" data-testid="contact-form">
            <div class="form-group">
                <label for="name" class="required-label">Name</label>
                <input type="text" id="name" name="name" required data-testid="name-input">
                <div class="error-message">Please enter your name</div>
            </div>

            <div class="form-group">
                <label for="email" class="required-label">Email</label>
                <input type="email" id="email" name="email" required data-testid="email-input">
                <div class="error-message">Please enter a valid email address</div>
            </div>

            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" data-testid="subject-input">
            </div>

            <div class="form-group">
                <label for="message" class="required-label">Message</label>
                <textarea id="message" name="message" rows="5" required data-testid="message-textarea"></textarea>
                <div class="error-message">Please enter your message</div>
            </div>

            <div class="form-group">
                <button type="submit" class="submit-btn" data-testid="submit-button">Send Message</button>
            </div>
        </form>
    </div>
</body>
</html>
```

## CSS Selectors in Testing Context

Understanding CSS selectors is crucial for QA automation because many testing frameworks use them to locate elements.

### Common Testing Scenarios

**1. Selecting Form Elements:**
```css
/* Test framework might use these selectors */
input[type="email"]           /* Find email inputs */
button[type="submit"]         /* Find submit buttons */
.error-message               /* Find error messages */
[data-testid="login-form"]   /* Find specific test elements */
```

**2. Checking Element States:**
```css
input:required               /* Find required fields */
input:disabled              /* Find disabled inputs */
.button:hover               /* Test hover states */
tr:nth-child(odd)           /* Select alternating table rows */
```

**3. Navigating Element Relationships:**
```css
form input                  /* Find inputs within forms */
.modal > .close-button      /* Find direct child close buttons */
li:first-child              /* Find first list item */
```

### Best Practices for Test-Friendly CSS

**1. Use data-testid attributes:**
```html
<button data-testid="submit-btn" class="btn btn-primary">Submit</button>
```
```css
[data-testid="submit-btn"] { /* Styling */ }
```

**2. Maintain stable class names:**
```css
/* Good - descriptive and stable */
.user-profile-form { }
.navigation-menu { }
.error-alert { }

/* Avoid - implementation-specific or likely to change */
.red-text { }
.column-3 { }
.temp-fix { }
```

**3. Use semantic class names:**
```css
/* Good - describes purpose */
.primary-action { }
.warning-message { }
.user-input { }

/* Avoid - describes appearance */
.blue-button { }
.small-text { }
.left-aligned { }
```

## Common Mistakes and How to Avoid Them

### 1. Overusing IDs
**Problem**: Too many IDs make CSS hard to reuse
```css
/* Avoid */
#header-title { }
#sidebar-title { }
#footer-title { }
```

**Solution**: Use classes for reusable styles
```css
/* Better */
.section-title { }
```

### 2. Overly Specific Selectors
**Problem**: Hard to override and maintain
```css
/* Avoid - too specific */
div.container div.content div.article p.text { }
```

**Solution**: Keep selectors as simple as possible
```css
/* Better */
.article .text { }
```

### 3. Not Understanding Specificity
**Problem**: Styles don't apply as expected
```css
.button { color: blue; }        /* Specificity: 10 */
#submit { color: red; }         /* Specificity: 100 - wins */
```

**Solution**: Understand the specificity hierarchy and plan accordingly

### 4. Forgetting the Cascade
**Problem**: Later rules override earlier ones unexpectedly
```css
.button { color: blue; }
.button { color: red; }    /* This wins - same specificity, but later */
```

**Solution**: Organize CSS logically and use specificity intentionally

## Summary

CSS selectors are fundamental tools for both styling web pages and identifying elements in automated testing. In this lesson, you learned:

### Key Concepts:
- **Five Basic Selector Types**: Element, class, ID, attribute, and universal selectors each serve different purposes
- **Selector Combinations**: Descendant, child, and multiple selectors allow precise element targeting
- **Specificity Rules**: Understanding the hierarchy helps predict which styles will be applied
- **Pseudo-Classes and Pseudo-Elements**: Enable styling based on element states and virtual content
- **Testing Applications**: CSS selectors are essential for reliable element identification in automated tests

### Best Practices:
- Use semantic, descriptive class names that won't change frequently
- Keep selectors as simple as possible while maintaining functionality
- Leverage data-testid attributes for testing-specific element identification
- Understand specificity to write maintainable CSS
- Consider both styling and testing needs when choosing selectors

### Connection to QA Automation:
CSS selectors bridge the gap between web development and testing automation. They provide:
- **Reliable element identification** for test scripts
- **Readable locator strategies** that team members can understand
- **Stable references** that are less likely to break with UI changes
- **Semantic meaning** that makes tests more maintainable

### Looking Ahead:
In the next lesson, you'll explore advanced CSS selector techniques and combinations that provide even more precise control over element selection and styling. These advanced techniques are particularly valuable when working with complex web applications that require sophisticated testing strategies.

The foundation you've built with basic CSS selectors will serve you well as you progress through more advanced topics like XPath, browser developer tools, and automated testing frameworks.