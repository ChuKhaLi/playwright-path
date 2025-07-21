# Locator Strategy Decision Tree

## Visual Guide: Choosing the Right Locator Strategy

This decision tree helps you select the most appropriate locator strategy for any element in your E2E tests.

```
                    🎯 ELEMENT TO LOCATE
                           |
                           v
                    ┌─────────────────┐
                    │ What type of    │
                    │ element is it?  │
                    └─────────────────┘
                           |
        ┌──────────────────┼──────────────────┐
        v                  v                  v
   ┌─────────┐      ┌─────────────┐    ┌─────────────┐
   │ BUTTON  │      │ FORM INPUT  │    │ OTHER       │
   │ LINK    │      │ CHECKBOX    │    │ ELEMENT     │
   │ DIALOG  │      │ RADIO       │    │             │
   └─────────┘      └─────────────┘    └─────────────┘
        |                  |                  |
        v                  v                  v
   ┌─────────┐      ┌─────────────┐    ┌─────────────┐
   │ Use     │      │ Has label   │    │ Has visible │
   │ getBy   │      │ text?       │    │ text?       │
   │ Role()  │      └─────────────┘    └─────────────┘
   └─────────┘            |                  |
        |            ┌────┴────┐        ┌────┴────┐
        |            v         v        v         v
        |       ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
        |       │   YES   │ │   NO    │ │   YES   │ │   NO    │
        |       └─────────┘ └─────────┘ └─────────┘ └─────────┘
        |            |         |            |         |
        |            v         v            v         v
        |       ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
        |       │ Use     │ │ Has     │ │ Use     │ │ Has     │
        |       │ getBy   │ │ place   │ │ getBy   │ │ test-id │
        |       │ Label() │ │ holder? │ │ Text()  │ │ attr?   │
        |       └─────────┘ └─────────┘ └─────────┘ └─────────┘
        |            |         |            |         |
        |            |    ┌────┴────┐       |    ┌────┴────┐
        |            |    v         v       |    v         v
        |            |  ┌─────────┐ ┌─────────┐ |  ┌─────────┐ ┌─────────┐
        |            |  │   YES   │ │   NO    │ |  │   YES   │ │   NO    │
        |            |  └─────────┘ └─────────┘ |  └─────────┘ └─────────┘
        |            |       |         |       |       |         |
        |            |       v         v       |       v         v
        |            |  ┌─────────┐ ┌─────────┐ |  ┌─────────┐ ┌─────────┐
        |            |  │ Use     │ │ Use     │ |  │ Use     │ │ Use CSS │
        |            |  │ getBy   │ │ getBy   │ |  │ getBy   │ │ Selector│
        |            |  │Placeholder│TestId() │ |  │TestId() │ │ with    │
        |            |  │   ()    │ │ or CSS  │ |  │         │ │locator()│
        |            |  └─────────┘ └─────────┘ |  └─────────┘ └─────────┘
        |            |                         |
        └────────────┴─────────────────────────┘
                     |
                     v
              ┌─────────────┐
              │ ✅ LOCATOR  │
              │  SELECTED   │
              └─────────────┘
```

## Decision Criteria Explained

### 🎯 **Step 1: Element Type Classification**

**Interactive Elements (Buttons, Links, Dialogs)**
- **Best Choice**: [`getByRole()`](../examples/locator-strategies.spec.ts:15)
- **Why**: Semantic, accessibility-focused, user-centric
- **Example**: `page.getByRole('button', { name: 'Submit' })`

**Form Elements (Inputs, Checkboxes, Radios)**
- **Primary Choice**: [`getByLabel()`](../examples/locator-strategies.spec.ts:35)
- **Fallback**: [`getByPlaceholder()`](../examples/locator-strategies.spec.ts:45)
- **Why**: Matches how users identify form fields

**Content Elements (Text, Headings, Messages)**
- **Best Choice**: [`getByText()`](../examples/locator-strategies.spec.ts:25)
- **Why**: Content-based selection is intuitive and stable

### 🔍 **Step 2: Attribute Availability Check**

**Has Label Text?**
```html
<label for="email">Email Address</label>
<input id="email" type="email" />
```
✅ Use: `page.getByLabel('Email Address')`

**Has Placeholder Text?**
```html
<input type="email" placeholder="Enter your email" />
```
✅ Use: `page.getByPlaceholder('Enter your email')`

**Has Test ID?**
```html
<button data-testid="submit-btn">Submit</button>
```
✅ Use: `page.getByTestId('submit-btn')`

**Has Visible Text?**
```html
<button>Sign In</button>
<h1>Welcome Back</h1>
```
✅ Use: `page.getByText('Sign In')` or `page.getByText('Welcome Back')`

### ⚠️ **Step 3: Fallback Strategies**

**When Built-in Locators Aren't Sufficient**
- Use CSS selectors with [`page.locator()`](../examples/locator-strategies.spec.ts:75)
- Combine multiple selectors for precision
- Use attribute matching for dynamic content

## Priority Hierarchy (Most to Least Preferred)

```
1. 🥇 getByRole()        - Semantic, accessible, user-centric
2. 🥈 getByLabel()       - Form-specific, clear intent
3. 🥉 getByText()        - Content-based, intuitive
4. 🏅 getByPlaceholder() - Input-specific fallback
5. 🎖️ getByTestId()      - Developer-controlled, stable
6. 🏆 CSS Selectors      - Flexible but implementation-dependent
7. ⚠️ XPath             - Last resort, avoid when possible
```

## Common Decision Scenarios

### Scenario 1: Login Form
```html
<form>
  <label for="username">Username</label>
  <input id="username" type="text" />
  
  <label for="password">Password</label>
  <input id="password" type="password" />
  
  <button type="submit">Login</button>
</form>
```

**Decision Path**:
- Username input: `getByLabel('Username')` ✅
- Password input: `getByLabel('Password')` ✅  
- Submit button: `getByRole('button', { name: 'Login' })` ✅

### Scenario 2: Dynamic Content
```html
<div class="user-card" data-user-id="123">
  <h3>John Doe</h3>
  <button class="edit-btn">Edit</button>
</div>
```

**Decision Path**:
- User card: `getByText('John Doe')` or `locator('[data-user-id="123"]')` ✅
- Edit button: `getByRole('button', { name: 'Edit' })` ✅

### Scenario 3: Complex UI Component
```html
<div class="dropdown-menu" data-testid="user-menu">
  <button class="dropdown-toggle">
    <img src="avatar.jpg" alt="User Avatar" />
    <span>John Doe</span>
  </button>
</div>
```

**Decision Path**:
- Dropdown: `getByTestId('user-menu')` or `getByRole('button', { name: /John Doe/ })` ✅

## Best Practices Summary

### ✅ **DO**
- Start with semantic locators ([`getByRole()`](../examples/locator-strategies.spec.ts:15), [`getByLabel()`](../examples/locator-strategies.spec.ts:35))
- Use content-based selection ([`getByText()`](../examples/locator-strategies.spec.ts:25)) for stable text
- Add test IDs for complex components
- Cache frequently used locators
- Validate locator uniqueness

### ❌ **DON'T**
- Rely on implementation details (CSS classes, complex selectors)
- Use XPath unless absolutely necessary
- Create overly specific selectors that break easily
- Ignore accessibility implications
- Skip locator validation in tests

## Quick Reference Card

| Element Type | First Choice | Fallback | Example |
|--------------|-------------|----------|---------|
| Button | `getByRole('button')` | `getByTestId()` | `getByRole('button', { name: 'Submit' })` |
| Link | `getByRole('link')` | `getByText()` | `getByRole('link', { name: 'Home' })` |
| Text Input | `getByLabel()` | `getByPlaceholder()` | `getByLabel('Email Address')` |
| Checkbox | `getByRole('checkbox')` | `getByLabel()` | `getByRole('checkbox', { name: 'Agree' })` |
| Heading | `getByRole('heading')` | `getByText()` | `getByRole('heading', { name: 'Welcome' })` |
| Generic Element | `getByText()` | `getByTestId()` | `getByText('User Profile')` |

This decision tree ensures you always choose the most reliable, maintainable, and user-centric locator strategy for your Playwright tests.