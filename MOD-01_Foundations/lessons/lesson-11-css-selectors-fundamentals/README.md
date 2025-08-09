# Lesson 1.3: CSS Selectors Fundamentals

## 📚 Lesson Overview

CSS selectors are the foundation of web automation testing. This lesson teaches you how to identify and target HTML elements using various CSS selector strategies, which directly translate to effective element location in automation frameworks like Playwright.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Master** basic CSS selector types (element, class, ID, attribute)
- **Apply** CSS selector combinators (descendant, child, sibling)
- **Implement** pseudo-classes and pseudo-elements for dynamic content
- **Create** robust selectors that work reliably in automation tests
- **Understand** selector specificity and performance implications
- **Practice** selector testing using browser developer tools

### ⏱️ Duration
**1.5-2 hours** | **Type**: Foundation

### 🔗 Prerequisites
- Completion of Lesson 1.1: HTML Document Structure
- Completion of Lesson 1.2: HTML Forms and Input Elements
- Basic understanding of HTML elements and attributes
- Browser developer tools familiarity

---

## 📖 Lesson Content

### Understanding CSS Selectors

CSS selectors are patterns used to select and style HTML elements. In automation testing, these same patterns help us locate elements for interaction and verification. A well-crafted selector is:

- **Specific**: Targets the intended element precisely
- **Stable**: Continues to work when the page changes
- **Readable**: Easy to understand and maintain
- **Performant**: Executes quickly in the browser

### Basic Selector Types

#### 1. Element Selectors

Target elements by their HTML tag name:

```css
/* Select all paragraph elements */
p {
    color: blue;
}

/* Select all button elements */
button {
    background-color: green;
}

/* Select all input elements */
input {
    border: 1px solid gray;
}
```

**Automation Usage**:
```typescript
// Playwright examples
const allButtons = page.locator('button');
const firstParagraph = page.locator('p').first();
const allInputs = page.locator('input');
```

#### 2. Class Selectors

Target elements by their CSS class attribute:

```css
/* Select elements with class="primary-button" */
.primary-button {
    background-color: blue;
}

/* Select elements with class="error-message" */
.error-message {
    color: red;
}

/* Select elements with multiple classes */
.btn.large {
    font-size: 18px;
}
```

**HTML Example**:
```html
<button class="primary-button">Submit</button>
<div class="error-message">Invalid input</div>
<button class="btn large primary-button">Large Submit</button>
```

**Automation Usage**:
```typescript
// Target by single class
const submitButton = page.locator('.primary-button');

// Target by multiple classes
const largeButton = page.locator('.btn.large');

// More specific targeting
const errorDiv = page.locator('div.error-message');
```

#### 3. ID Selectors

Target elements by their unique ID attribute:

```css
/* Select element with id="login-form" */
#login-form {
    width: 400px;
}

/* Select element with id="submit-button" */
#submit-button {
    background-color: green;
}
```

**HTML Example**:
```html
<form id="login-form">
    <input id="username" type="text">
    <input id="password" type="password">
    <button id="submit-button">Login</button>
</form>
```

**Automation Usage**:
```typescript
// IDs are unique and highly specific
const loginForm = page.locator('#login-form');
const usernameInput = page.locator('#username');
const submitButton = page.locator('#submit-button');
```

#### 4. Attribute Selectors

Target elements by their attributes and values:

```css
/* Select elements with a specific attribute */
[data-testid] {
    border: 2px solid blue;
}

/* Select elements with specific attribute value */
[type="email"] {
    background-color: lightblue;
}

/* Select elements with attribute containing value */
[class*="button"] {
    cursor: pointer;
}

/* Select elements with attribute starting with value */
[id^="user-"] {
    font-weight: bold;
}

/* Select elements with attribute ending with value */
[src$=".jpg"] {
    border-radius: 5px;
}
```

**HTML Example**:
```html
<input type="email" data-testid="email-input">
<button class="primary-button" data-testid="submit-btn">Submit</button>
<img src="profile.jpg" alt="Profile">
<div id="user-profile">Profile</div>
<div id="user-settings">Settings</div>
```

**Automation Usage**:
```typescript
// Highly recommended for automation
const emailInput = page.locator('[data-testid="email-input"]');
const submitButton = page.locator('[data-testid="submit-btn"]');

// Attribute pattern matching
const allUserDivs = page.locator('[id^="user-"]');
const allImages = page.locator('[src$=".jpg"]');
const allButtons = page.locator('[class*="button"]');
```

### CSS Combinators

Combinators define relationships between elements:

#### 1. Descendant Combinator (Space)

Selects elements that are descendants of another element:

```css
/* Select all paragraphs inside articles */
article p {
    line-height: 1.6;
}

/* Select all buttons inside forms */
form button {
    margin-top: 10px;
}

/* Select inputs inside divs with class form-group */
.form-group input {
    width: 100%;
}
```

**HTML Example**:
```html
<article>
    <h2>Article Title</h2>
    <p>This paragraph will be selected</p>
    <div>
        <p>This nested paragraph will also be selected</p>
    </div>
</article>
```

**Automation Usage**:
```typescript
// Find buttons within a specific form
const formButton = page.locator('form button');

// Find inputs within form groups
const formInput = page.locator('.form-group input');

// More specific targeting
const articleParagraph = page.locator('article p').first();
```

#### 2. Child Combinator (>)

Selects direct children only:

```css
/* Select only direct paragraph children of articles */
article > p {
    font-size: 18px;
}

/* Select direct list items of navigation */
nav > ul > li {
    display: inline-block;
}
```

**HTML Example**:
```html
<article>
    <p>Direct child - will be selected</p>
    <div>
        <p>Nested paragraph - will NOT be selected</p>
    </div>
</article>
```

**Automation Usage**:
```typescript
// Target direct children only
const directParagraph = page.locator('article > p');
const navItems = page.locator('nav > ul > li');
```

#### 3. Adjacent Sibling Combinator (+)

Selects the immediately following sibling:

```css
/* Select paragraph immediately after h2 */
h2 + p {
    margin-top: 0;
}

/* Select input immediately after label */
label + input {
    margin-left: 10px;
}
```

**HTML Example**:
```html
<h2>Heading</h2>
<p>This paragraph will be selected</p>
<p>This paragraph will NOT be selected</p>

<label>Username:</label>
<input type="text"> <!-- This input will be selected -->
```

**Automation Usage**:
```typescript
// Target elements following specific elements
const paragraphAfterHeading = page.locator('h2 + p');
const inputAfterLabel = page.locator('label + input');
```

#### 4. General Sibling Combinator (~)

Selects all following siblings:

```css
/* Select all paragraphs that follow h2 */
h2 ~ p {
    color: gray;
}

/* Select all inputs that follow a label */
label ~ input {
    border: 1px solid blue;
}
```

**Automation Usage**:
```typescript
// Target all following siblings
const allFollowingParagraphs = page.locator('h2 ~ p');
const allFollowingInputs = page.locator('label ~ input');
```

### Pseudo-Classes

Pseudo-classes select elements based on their state or position:

#### Structural Pseudo-Classes

```css
/* First child element */
li:first-child {
    font-weight: bold;
}

/* Last child element */
li:last-child {
    border-bottom: none;
}

/* Nth child (odd/even, formulas) */
tr:nth-child(odd) {
    background-color: #f0f0f0;
}

tr:nth-child(2n+1) {
    background-color: white;
}

/* First of type */
p:first-of-type {
    font-size: 20px;
}
```

**Automation Usage**:
```typescript
// Target specific positioned elements
const firstListItem = page.locator('li:first-child');
const lastListItem = page.locator('li:last-child');
const oddRows = page.locator('tr:nth-child(odd)');
const thirdRow = page.locator('tr:nth-child(3)');
```

#### State Pseudo-Classes

```css
/* Hover state */
button:hover {
    background-color: darkblue;
}

/* Focus state */
input:focus {
    outline: 2px solid blue;
}

/* Disabled state */
input:disabled {
    opacity: 0.5;
}

/* Checked state */
input:checked {
    transform: scale(1.1);
}
```

**Automation Usage**:
```typescript
// Target elements in specific states
const disabledInputs = page.locator('input:disabled');
const checkedBoxes = page.locator('input:checked');
const focusedElement = page.locator(':focus');
```

### Selector Best Practices for Automation

#### 1. Use Data Attributes (Recommended)

```html
<!-- Best practice for automation -->
<button data-testid="submit-button">Submit</button>
<input data-testid="email-input" type="email">
<div data-testid="error-message">Error text</div>
```

```typescript
// Stable and clear selectors
const submitButton = page.locator('[data-testid="submit-button"]');
const emailInput = page.locator('[data-testid="email-input"]');
const errorMessage = page.locator('[data-testid="error-message"]');
```

#### 2. Combine Selectors for Specificity

```typescript
// More specific and stable
const submitButton = page.locator('form[data-testid="login-form"] button[type="submit"]');
const emailInput = page.locator('.form-group input[type="email"]');
```

#### 3. Avoid Fragile Selectors

```typescript
// ❌ Fragile - depends on structure
const badSelector = page.locator('div > div > div > button');

// ❌ Fragile - depends on styling
const badSelector2 = page.locator('.btn-primary.large.rounded');

// ✅ Stable - semantic and specific
const goodSelector = page.locator('[data-testid="submit-button"]');
const goodSelector2 = page.locator('button[type="submit"]');
```

### Testing Selectors in Browser

Use browser developer tools to test selectors:

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Test CSS selectors**:

```javascript
// Test if selector finds elements
document.querySelectorAll('.primary-button');

// Test specific selector
document.querySelector('[data-testid="submit-button"]');

// Count matching elements
document.querySelectorAll('input[type="text"]').length;
```

4. **Use Elements tab**:
   - Right-click element → Copy → Copy selector
   - Use Ctrl+F to search with CSS selectors

---

## 🎯 Key Takeaways

1. **CSS selectors are fundamental** to web automation testing
2. **Data attributes** (`data-testid`) provide the most stable selectors
3. **Combine selectors** for better specificity and reliability
4. **Avoid fragile selectors** that depend on styling or deep nesting
5. **Test selectors** in browser developer tools before using in automation
6. **Understand selector performance** - simpler selectors are generally faster

---

## 📚 Additional Resources

- [MDN CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [CSS Selector Specificity Calculator](https://specificity.keegan.st/)
- [Playwright Locator Documentation](https://playwright.dev/docs/locators)
- [CSS Selector Tester Tool](https://www.w3schools.com/cssref/trysel.asp)

---

## 🔄 Next Steps

After completing this lesson:
1. **Practice** writing CSS selectors for different HTML structures
2. **Complete** the hands-on exercises to reinforce learning
3. **Take** the knowledge check assessment
4. **Proceed** to Lesson 1.4: Advanced CSS Selectors and Combinators

---

**Estimated Completion Time**: 1.5-2 hours  
**Difficulty Level**: Beginner to Intermediate  
**Prerequisites**: HTML fundamentals, browser developer tools