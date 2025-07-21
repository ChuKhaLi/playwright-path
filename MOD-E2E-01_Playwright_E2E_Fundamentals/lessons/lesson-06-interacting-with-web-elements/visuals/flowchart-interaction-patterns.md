# Element Interaction Patterns Flowchart

## 🎯 Visual Guide to Choosing the Right Interaction Method

This flowchart helps you select the most appropriate interaction method for different element types and scenarios in Playwright E2E testing.

---

## 🔄 Main Interaction Decision Flow

```
                    🎯 ELEMENT TO INTERACT WITH
                              |
                              v
                    ┌─────────────────────┐
                    │ What type of        │
                    │ interaction do      │
                    │ you need?           │
                    └─────────────────────┘
                              |
        ┌─────────────────────┼─────────────────────┐
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ CLICK   │         │ TEXT INPUT  │       │ FORM        │
   │ ACTION  │         │ & TYPING    │       │ ELEMENTS    │
   └─────────┘         └─────────────┘       └─────────────┘
        |                     |                     |
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ Button? │         │ Clear field │       │ Checkbox?   │
   │ Link?   │         │ first?      │       │ Radio?      │
   │ Menu?   │         └─────────────┘       │ Select?     │
   └─────────┘                |              └─────────────┘
        |                ┌────┴────┐                |
        v                v         v                v
   ┌─────────┐      ┌─────────┐ ┌─────────┐   ┌─────────────┐
   │ Use     │      │   YES   │ │   NO    │   │ Use         │
   │ click() │      └─────────┘ └─────────┘   │ specialized │
   └─────────┘           |         |         │ methods     │
        |                v         v         └─────────────┘
        |         ┌─────────┐ ┌─────────┐           |
        |         │ Use     │ │ Use     │           |
        |         │ fill()  │ │ type()  │           |
        |         └─────────┘ └─────────┘           |
        |                |         |               |
        └────────────────┼─────────┼───────────────┘
                         |         |
                         v         v
                  ┌─────────────────────┐
                  │ ✅ INTERACTION      │
                  │    COMPLETED        │
                  └─────────────────────┘
```

---

## 🖱️ Click Interaction Decision Tree

```
                    🖱️ CLICK INTERACTION NEEDED
                              |
                              v
                    ┌─────────────────────┐
                    │ What type of        │
                    │ click is needed?    │
                    └─────────────────────┘
                              |
        ┌─────────────────────┼─────────────────────┐
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ SINGLE  │         │ DOUBLE      │       │ RIGHT       │
   │ CLICK   │         │ CLICK       │       │ CLICK       │
   └─────────┘         └─────────────┘       └─────────────┘
        |                     |                     |
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ Standard│         │ Edit mode   │       │ Context     │
   │ button  │         │ activation  │       │ menu        │
   │ or link │         │ File/folder │       │ operations  │
   └─────────┘         │ opening     │       └─────────────┘
        |              └─────────────┘              |
        v                     |                     v
   ┌─────────┐               v               ┌─────────────┐
   │ await   │         ┌─────────────┐       │ await       │
   │ element │         │ await       │       │ element     │
   │ .click()│         │ element     │       │ .click({    │
   └─────────┘         │ .dblclick() │       │ button:     │
                       └─────────────┘       │ 'right' })  │
                                            └─────────────┘
```

### Click Method Examples

```
┌─────────────────────────────────────────────────────────────┐
│                    🖱️ CLICK METHOD EXAMPLES                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Single Click - Standard Interaction                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Basic button click                               │   │
│  │ await page.getByRole('button',                      │   │
│  │   { name: 'Submit' }).click();                      │   │
│  │                                                     │   │
│  │ // Link navigation                                  │   │
│  │ await page.getByRole('link',                        │   │
│  │   { name: 'Home' }).click();                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Double Click - Edit Mode Activation                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Edit text inline                                 │   │
│  │ await page.getByText('Editable Text').dblclick();   │   │
│  │                                                     │   │
│  │ // Open folder/file                                 │   │
│  │ await page.getByText('Documents').dblclick();       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Right Click - Context Menu                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Open context menu                                │   │
│  │ await page.getByText('File.txt').click({            │   │
│  │   button: 'right'                                   │   │
│  │ });                                                 │   │
│  │                                                     │   │
│  │ // Select context menu option                       │   │
│  │ await page.getByText('Delete').click();             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ⌨️ Text Input Decision Flow

```
                    ⌨️ TEXT INPUT NEEDED
                              |
                              v
                    ┌─────────────────────┐
                    │ Do you need to      │
                    │ clear existing      │
                    │ content first?      │
                    └─────────────────────┘
                              |
                    ┌─────────┴─────────┐
                    v                   v
               ┌─────────┐         ┌─────────┐
               │   YES   │         │   NO    │
               │ (Most   │         │ (Append │
               │ cases)  │         │ text)   │
               └─────────┘         └─────────┘
                    |                   |
                    v                   v
               ┌─────────┐         ┌─────────┐
               │ Use     │         │ Use     │
               │ fill()  │         │ type()  │
               │ method  │         │ method  │
               └─────────┘         └─────────┘
                    |                   |
                    v                   v
               ┌─────────┐         ┌─────────┐
               │ Fast    │         │ Slower  │
               │ Reliable│         │ Realistic│
               │ Clears  │         │ Preserves│
               │ first   │         │ content │
               └─────────┘         └─────────┘
                    |                   |
                    └─────────┬─────────┘
                              v
                    ┌─────────────────────┐
                    │ Need special keys?  │
                    │ (Enter, Tab, etc.)  │
                    └─────────────────────┘
                              |
                    ┌─────────┴─────────┐
                    v                   v
               ┌─────────┐         ┌─────────┐
               │   YES   │         │   NO    │
               └─────────┘         └─────────┘
                    |                   |
                    v                   v
               ┌─────────┐         ┌─────────┐
               │ Use     │         │ Input   │
               │ press() │         │ complete│
               │ method  │         └─────────┘
               └─────────┘
```

### Text Input Method Examples

```
┌─────────────────────────────────────────────────────────────┐
│                  ⌨️ TEXT INPUT METHOD EXAMPLES              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  fill() - Clear and Replace (Recommended)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Form field input                                 │   │
│  │ await page.getByLabel('Email')                      │   │
│  │   .fill('user@example.com');                        │   │
│  │                                                     │   │
│  │ // Search box                                       │   │
│  │ await page.getByPlaceholder('Search...')            │   │
│  │   .fill('playwright testing');                      │   │
│  │                                                     │   │
│  │ // Clear field                                      │   │
│  │ await page.getByLabel('Comments').fill('');         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  type() - Append Text (Character by Character)             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Append to existing text                          │   │
│  │ await page.getByLabel('Notes')                      │   │
│  │   .type(' - Additional info');                      │   │
│  │                                                     │   │
│  │ // Simulate realistic typing                        │   │
│  │ await page.getByLabel('Message')                    │   │
│  │   .type('Hello world', { delay: 100 });            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  press() - Special Keys and Shortcuts                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Submit form with Enter                           │   │
│  │ await page.getByLabel('Search')                     │   │
│  │   .press('Enter');                                  │   │
│  │                                                     │   │
│  │ // Keyboard shortcuts                               │   │
│  │ await page.press('body', 'Control+A');              │   │
│  │ await page.press('body', 'Control+C');              │   │
│  │                                                     │   │
│  │ // Navigation keys                                  │   │
│  │ await page.press('body', 'Tab');                    │   │
│  │ await page.press('body', 'Escape');                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Form Element Interaction Flow

```
                    📋 FORM ELEMENT INTERACTION
                              |
                              v
                    ┌─────────────────────┐
                    │ What type of        │
                    │ form element?       │
                    └─────────────────────┘
                              |
        ┌─────────────────────┼─────────────────────┐
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │CHECKBOX │         │ RADIO       │       │ SELECT      │
   │         │         │ BUTTON      │       │ DROPDOWN    │
   └─────────┘         └─────────────┘       └─────────────┘
        |                     |                     |
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ Need to │         │ Which       │       │ How to      │
   │ check   │         │ option      │       │ select      │
   │ or      │         │ to select?  │       │ option?     │
   │ uncheck?│         └─────────────┘       └─────────────┘
   └─────────┘                |                     |
        |                     v               ┌─────┴─────┐
   ┌────┴────┐         ┌─────────────┐       v           v
   v         v         │ Use check() │  ┌─────────┐ ┌─────────┐
┌─────────┐ ┌─────────┐ │ method      │  │ BY TEXT │ │BY VALUE │
│ CHECK   │ │ UNCHECK │ └─────────────┘  └─────────┘ └─────────┘
└─────────┘ └─────────┘        |              |         |
     |           |             v              v         v
     v           v      ┌─────────────┐ ┌─────────┐ ┌─────────┐
┌─────────┐ ┌─────────┐ │ await       │ │ select  │ │ select  │
│ Use     │ │ Use     │ │ element     │ │ Option  │ │ Option  │
│ check() │ │uncheck()│ │ .check()    │ │ ('US')  │ │({value: │
└─────────┘ └─────────┘ └─────────────┘ └─────────┘ │ 'us'})  │
     |           |                           |      └─────────┘
     └─────┬─────┘                           |           |
           v                                 └─────┬─────┘
    ┌─────────────┐                               v
    │ Conditional │                        ┌─────────────┐
    │ setChecked  │                        │ await       │
    │ (boolean)   │                        │ element     │
    └─────────────┘                        │ .selectOption│
                                          └─────────────┘
```

### Form Element Examples

```
┌─────────────────────────────────────────────────────────────┐
│                 📋 FORM ELEMENT EXAMPLES                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Checkbox Interactions                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Check a checkbox                                 │   │
│  │ await page.getByLabel('I agree to terms')          │   │
│  │   .check();                                         │   │
│  │                                                     │   │
│  │ // Uncheck a checkbox                               │   │
│  │ await page.getByLabel('Subscribe to newsletter')    │   │
│  │   .uncheck();                                       │   │
│  │                                                     │   │
│  │ // Conditional checking                             │   │
│  │ await page.getByLabel('Remember me')                │   │
│  │   .setChecked(shouldRemember);                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Radio Button Selection                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Select radio button option                       │   │
│  │ await page.getByLabel('Credit Card').check();       │   │
│  │ await page.getByLabel('PayPal').check();            │   │
│  │                                                     │   │
│  │ // Verify selection                                 │   │
│  │ await expect(page.getByLabel('PayPal'))             │   │
│  │   .toBeChecked();                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Select Dropdown Options                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Select by visible text                           │   │
│  │ await page.getByLabel('Country')                    │   │
│  │   .selectOption('United States');                   │   │
│  │                                                     │   │
│  │ // Select by value                                  │   │
│  │ await page.getByLabel('Country')                    │   │
│  │   .selectOption({ value: 'us' });                   │   │
│  │                                                     │   │
│  │ // Select multiple options                          │   │
│  │ await page.getByLabel('Skills')                     │   │
│  │   .selectOption(['javascript', 'typescript']);      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎭 Advanced Interaction Patterns

```
                    🎭 ADVANCED INTERACTIONS
                              |
                              v
                    ┌─────────────────────┐
                    │ What advanced       │
                    │ interaction is      │
                    │ needed?             │
                    └─────────────────────┘
                              |
        ┌─────────────────────┼─────────────────────┐
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ HOVER   │         │ DRAG &      │       │ FILE        │
   │ ACTIONS │         │ DROP        │       │ UPLOAD      │
   └─────────┘         └─────────────┘       └─────────────┘
        |                     |                     |
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ Tooltip │         │ Reorder     │       │ Single or   │
   │ Menu    │         │ items?      │       │ multiple    │
   │ reveal? │         │ Move files? │       │ files?      │
   └─────────┘         └─────────────┘       └─────────────┘
        |                     |                     |
        v                     v                     v
   ┌─────────┐         ┌─────────────┐       ┌─────────────┐
   │ Use     │         │ Use dragTo()│       │ Use         │
   │ hover() │         │ method      │       │ setInput    │
   │ method  │         └─────────────┘       │ Files()     │
   └─────────┘                |              └─────────────┘
        |                     v                     |
        v              ┌─────────────┐              v
   ┌─────────┐         │ await       │       ┌─────────────┐
   │ await   │         │ source      │       │ await       │
   │ element │         │ .dragTo     │       │ element     │
   │ .hover()│         │ (target)    │       │ .setInput   │
   └─────────┘         └─────────────┘       │ Files(path) │
                                            └─────────────┘
```

### Advanced Interaction Examples

```
┌─────────────────────────────────────────────────────────────┐
│                🎭 ADVANCED INTERACTION EXAMPLES             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Hover Interactions                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Hover to reveal dropdown menu                    │   │
│  │ await page.getByText('Products').hover();           │   │
│  │ await page.getByText('Software').click();           │   │
│  │                                                     │   │
│  │ // Hover to show tooltip                            │   │
│  │ await page.getByTitle('Help').hover();              │   │
│  │ await expect(page.getByText('Click for help'))      │   │
│  │   .toBeVisible();                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Drag and Drop Operations                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Simple drag and drop                             │   │
│  │ await page.getByText('Item 1')                      │   │
│  │   .dragTo(page.getByText('Drop Zone'));             │   │
│  │                                                     │   │
│  │ // Reorder list items                               │   │
│  │ await page.getByText('Task A')                      │   │
│  │   .dragTo(page.getByText('Task C'));                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  File Upload Handling                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Single file upload                               │   │
│  │ await page.getByLabel('Upload Document')            │   │
│  │   .setInputFiles('path/to/file.pdf');               │   │
│  │                                                     │   │
│  │ // Multiple file upload                             │   │
│  │ await page.getByLabel('Upload Images')              │   │
│  │   .setInputFiles(['img1.jpg', 'img2.png']);         │   │
│  │                                                     │   │
│  │ // Upload from buffer                               │   │
│  │ await page.getByLabel('Upload Data')                │   │
│  │   .setInputFiles({                                  │   │
│  │     name: 'data.json',                              │   │
│  │     mimeType: 'application/json',                   │   │
│  │     buffer: Buffer.from('{"test": true}')           │   │
│  │   });                                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timing and State Management

```
                    ⏱️ ELEMENT STATE MANAGEMENT
                              |
                              v
                    ┌─────────────────────┐
                    │ Is element ready    │
                    │ for interaction?    │
                    └─────────────────────┘
                              |
                    ┌─────────┴─────────┐
                    v                   v
               ┌─────────┐         ┌─────────┐
               │   YES   │         │   NO    │
               └─────────┘         └─────────┘
                    |                   |
                    v                   v
               ┌─────────┐         ┌─────────┐
               │ Proceed │         │ Wait    │
               │ with    │         │ for     │
               │ action  │         │ element │
               └─────────┘         └─────────┘
                    |                   |
                    |                   v
                    |            ┌─────────────┐
                    |            │ What state  │
                    |            │ to wait for?│
                    |            └─────────────┘
                    |                   |
                    |         ┌─────────┼─────────┐
                    |         v         v         v
                    |    ┌─────────┐ ┌─────────┐ ┌─────────┐
                    |    │ VISIBLE │ │ ENABLED │ │ STABLE  │
                    |    └─────────┘ └─────────┘ └─────────┘
                    |         |         |         |
                    |         v         v         v
                    |    ┌─────────┐ ┌─────────┐ ┌─────────┐
                    |    │ waitFor │ │ waitFor │ │ waitFor │
                    |    │({state: │ │ enabled │ │ stable  │
                    |    │'visible'│ │ state   │ │ state   │
                    |    │})       │ └─────────┘ └─────────┘
                    |    └─────────┘      |         |
                    |         |          |         |
                    └─────────┼──────────┼─────────┘
                              v          v
                    ┌─────────────────────┐
                    │ ✅ ELEMENT READY    │
                    │    FOR INTERACTION  │
                    └─────────────────────┘
```

### State Management Examples

```
┌─────────────────────────────────────────────────────────────┐
│                ⏱️ STATE MANAGEMENT EXAMPLES                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Wait for Element Visibility                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Wait for element to appear                       │   │
│  │ await page.getByText('Success Message')             │   │
│  │   .waitFor({ state: 'visible' });                   │   │
│  │                                                     │   │
│  │ // Wait for loading to disappear                    │   │
│  │ await page.getByText('Loading...')                  │   │
│  │   .waitFor({ state: 'hidden' });                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Wait for Element Interaction State                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Ensure button is enabled before clicking         │   │
│  │ const submitBtn = page.getByRole('button',           │   │
│  │   { name: 'Submit' });                              │   │
│  │ await expect(submitBtn).toBeEnabled();              │   │
│  │ await submitBtn.click();                            │   │
│  │                                                     │   │
│  │ // Wait for element to be stable (not moving)       │   │
│  │ await page.getByTestId('animated-element')          │   │
│  │   .waitFor({ state: 'visible' });                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Custom Wait Conditions                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ // Wait for specific content                        │   │
│  │ await page.waitForFunction(() => {                  │   │
│  │   const counter = document.querySelector('#counter');│   │
│  │   return counter && parseInt(counter.textContent) > 5;│ │
│  │ });                                                 │   │
│  │                                                     │   │
│  │ // Wait for network to be idle                      │   │
│  │ await page.waitForLoadState('networkidle');         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

This comprehensive flowchart provides a systematic approach to choosing the right interaction method for any element in your Playwright tests. Use it as a reference to ensure you're using the most appropriate and reliable interaction patterns.