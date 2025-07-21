# Visual Guide: Locator Types and Examples

## Interactive Visual Reference for Playwright Locators

This guide provides visual representations of different locator types with real HTML examples and their corresponding Playwright code.

---

## 🎭 Built-in Locators: The Semantic Approach

### 1. `getByRole()` - The Accessibility Champion

```
┌─────────────────────────────────────────────────────────────┐
│                    🎯 ARIA ROLES MAPPING                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HTML Element          ARIA Role         Playwright Code    │
│  ─────────────         ─────────         ───────────────    │
│                                                             │
│  <button>              button           getByRole('button') │
│  ┌─────────────┐                                            │
│  │   Submit    │  ←──────────────────→  page.getByRole(    │
│  └─────────────┘                         'button',         │
│                                          { name: 'Submit' })│
│                                                             │
│  <a href="...">        link             getByRole('link')  │
│  ┌─────────────┐                                            │
│  │    Home     │  ←──────────────────→  page.getByRole(    │
│  └─────────────┘                         'link',           │
│                                          { name: 'Home' })  │
│                                                             │
│  <input type="text">   textbox          getByRole('textbox')│
│  ┌─────────────┐                                            │
│  │ [_________] │  ←──────────────────→  page.getByRole(    │
│  └─────────────┘                         'textbox',        │
│                                          { name: 'Email' }) │
│                                                             │
│  <input type="checkbox"> checkbox       getByRole('checkbox')│
│  ┌─────────────┐                                            │
│  │ ☑ Remember  │  ←──────────────────→  page.getByRole(    │
│  └─────────────┘                         'checkbox',       │
│                                          { name: 'Remember'})│
└─────────────────────────────────────────────────────────────┘
```

**Visual Benefits of `getByRole()`:**
- 🎯 **User-Centric**: Matches how screen readers announce elements
- 🔒 **Stable**: Works even if CSS classes change
- 📱 **Accessible**: Ensures your app works for all users
- 🧠 **Semantic**: Clear intent in test code

---

### 2. `getByLabel()` - The Form Specialist

```
┌─────────────────────────────────────────────────────────────┐
│                   📝 LABEL ASSOCIATIONS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Explicit Association (for/id):                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <label for="email">Email Address</label>           │   │
│  │ <input id="email" type="email" />                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│           page.getByLabel('Email Address')                  │
│                                                             │
│  Implicit Association (nesting):                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <label>                                             │   │
│  │   Password                                          │   │
│  │   <input type="password" />                        │   │
│  │ </label>                                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│              page.getByLabel('Password')                    │
│                                                             │
│  Visual Representation:                                     │
│                                                             │
│  Email Address                                              │
│  ┌─────────────────────────────────┐                       │
│  │ user@example.com                │ ← getByLabel('Email   │
│  └─────────────────────────────────┘   Address')           │
│                                                             │
│  Password                                                   │
│  ┌─────────────────────────────────┐                       │
│  │ ••••••••••••••••                │ ← getByLabel('Password')│
│  └─────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. `getByText()` - The Content Hunter

```
┌─────────────────────────────────────────────────────────────┐
│                    📄 TEXT CONTENT MATCHING                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Exact Text Match:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Sign In                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│              page.getByText('Sign In')                      │
│                                                             │
│  Partial Text Match:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Welcome back, John!                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│        page.getByText('Welcome back', { exact: false })     │
│                                                             │
│  Regular Expression Match:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Order #12345                           │   │
│  │              Order #67890                           │   │
│  │              Order #54321                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│            page.getByText(/Order #\d+/)                     │
│                                                             │
│  Case-Insensitive Match:                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                SUBMIT                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│     page.getByText('submit', { exact: false })              │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. `getByPlaceholder()` - The Input Guide

```
┌─────────────────────────────────────────────────────────────┐
│                   💭 PLACEHOLDER TEXT TARGETING             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Search Input:                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Search products...                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│        page.getByPlaceholder('Search products...')          │
│                                                             │
│  Email Input:                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Enter your email address                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│     page.getByPlaceholder('Enter your email address')       │
│                                                             │
│  Message Textarea:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Type your message here...                           │   │
│  │                                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│      page.getByPlaceholder('Type your message here...')     │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. `getByTestId()` - The Developer's Choice

```
┌─────────────────────────────────────────────────────────────┐
│                  🏷️ TEST ID TARGETING                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HTML with Test IDs:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <button data-testid="submit-btn">Submit</button>    │   │
│  │ <div data-testid="error-msg">Invalid input</div>    │   │
│  │ <form data-testid="login-form">...</form>           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Playwright Code:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ page.getByTestId('submit-btn')                      │   │
│  │ page.getByTestId('error-msg')                       │   │
│  │ page.getByTestId('login-form')                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Visual Component Structure:                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              🏷️ data-testid="header"                │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │        🏷️ data-testid="logo"               │    │   │
│  │  │  ┌─────────────────────────────────────┐    │    │   │
│  │  │  │          MyApp                      │    │    │   │
│  │  │  └─────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │     🏷️ data-testid="nav-menu"             │    │   │
│  │  │  [Home] [About] [Contact]               │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 CSS Selectors: The Flexible Approach

### CSS Selector Patterns Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 CSS SELECTOR PATTERNS                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Element Selector:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <button>Click Me</button>                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│              page.locator('button')                         │
│                                                             │
│  Class Selector:                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <button class="btn-primary">Submit</button>         │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│            page.locator('.btn-primary')                     │
│                                                             │
│  ID Selector:                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <input id="email-input" type="email" />             │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│            page.locator('#email-input')                     │
│                                                             │
│  Attribute Selector:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <input type="submit" value="Send" />                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│          page.locator('[type="submit"]')                    │
│                                                             │
│  Combined Selectors:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <button class="btn btn-primary active">Save</button>│   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│        page.locator('.btn.btn-primary.active')              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Dynamic Content Handling

### Flexible Matching Strategies

```
┌─────────────────────────────────────────────────────────────┐
│                  🔄 DYNAMIC CONTENT PATTERNS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dynamic IDs (Contains):                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <div id="user-123">John Doe</div>                   │   │
│  │ <div id="user-456">Jane Smith</div>                 │   │
│  │ <div id="user-789">Bob Johnson</div>                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│            page.locator('[id*="user-"]')                    │
│                                                             │
│  Dynamic Classes (Starts With):                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <button class="btn-primary-xl">Large Button</button>│   │
│  │ <button class="btn-secondary-sm">Small Button</button>│ │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│            page.locator('[class^="btn-"]')                  │
│                                                             │
│  Dynamic Content (Ends With):                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <img src="profile-photo.jpg" />                     │   │
│  │ <img src="banner-image.png" />                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│            page.locator('[src$=".jpg"]')                    │
│                                                             │
│  Locator Chaining:                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <div class="user-card">                             │   │
│  │   <h3>John Doe</h3>                                 │   │
│  │   <button class="edit-btn">Edit</button>            │   │
│  │ </div>                                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  page.locator('.user-card')                                 │
│    .filter({ hasText: 'John Doe' })                        │
│    .locator('.edit-btn')                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Locator Performance Hierarchy

### Speed and Reliability Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                  ⚡ PERFORMANCE HIERARCHY                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🥇 FASTEST & MOST RELIABLE                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ID Selectors: #unique-id                            │   │
│  │ ⚡⚡⚡⚡⚡ Speed: Excellent                           │   │
│  │ 🔒🔒🔒🔒🔒 Stability: Excellent                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🥈 FAST & RELIABLE                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Test ID Selectors: [data-testid="value"]            │   │
│  │ ⚡⚡⚡⚡ Speed: Very Good                             │   │
│  │ 🔒🔒🔒🔒🔒 Stability: Excellent                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🥉 GOOD BALANCE                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Built-in Locators: getByRole(), getByLabel()        │   │
│  │ ⚡⚡⚡ Speed: Good                                    │   │
│  │ 🔒🔒🔒🔒🔒 Stability: Excellent                     │   │
│  │ 👥👥👥👥👥 User-Centric: Excellent                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🏅 MODERATE                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Class Selectors: .class-name                        │   │
│  │ ⚡⚡⚡ Speed: Good                                    │   │
│  │ 🔒🔒🔒 Stability: Moderate                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ⚠️ USE WITH CAUTION                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Complex CSS: .parent > .child:nth-child(2)          │   │
│  │ ⚡⚡ Speed: Moderate                                  │   │
│  │ 🔒🔒 Stability: Poor                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🚫 AVOID WHEN POSSIBLE                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ XPath: //div[@class='complex']//button[2]           │   │
│  │ ⚡ Speed: Slow                                       │   │
│  │ 🔒 Stability: Poor                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Debugging Guide

### Common Locator Issues and Solutions

```
┌─────────────────────────────────────────────────────────────┐
│                    🔍 DEBUGGING SCENARIOS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ❌ PROBLEM: Element Not Found                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Error: locator.click: Timeout 30000ms exceeded     │   │
│  │ waiting for selector ".submit-btn" to be visible   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ✅ SOLUTION: Use Built-in Locator                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ page.getByRole('button', { name: 'Submit' })        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ❌ PROBLEM: Multiple Elements Found                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Error: strict mode violation: locator('button')    │   │
│  │ resolved to 5 elements                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ✅ SOLUTION: Be More Specific                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ page.getByRole('button', { name: 'Submit' }).first()│   │
│  │ // or                                               │   │
│  │ page.locator('.form').getByRole('button')           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ❌ PROBLEM: Brittle Selector                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ page.locator('.MuiButton-root.css-1a2b3c')         │   │
│  │ // Breaks when CSS framework updates               │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ✅ SOLUTION: Use Semantic Approach                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ page.getByRole('button', { name: 'Save Changes' }) │   │
│  │ // or add test ID                                   │   │
│  │ page.getByTestId('save-button')                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

This visual guide provides a comprehensive reference for understanding and choosing the right locator strategy for any element in your Playwright tests. Use it as a quick reference during test development and debugging.