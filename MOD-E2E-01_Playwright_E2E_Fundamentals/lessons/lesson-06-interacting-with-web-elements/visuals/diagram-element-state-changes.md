# Element State Changes Visual Guide

## 🔄 Visual Representation of Element State Transitions

This guide provides visual representations of how elements change states during interactions, helping learners understand the dynamic nature of web elements and how to handle state transitions in tests.

---

## 🎛️ Button State Transitions

### Interactive Button States

```
┌─────────────────────────────────────────────────────────────┐
│                🎛️ BUTTON STATE LIFECYCLE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INITIAL STATE: Enabled Button                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────┐  ← Enabled, clickable          │   │
│  │  │     Submit      │  ← Background: Blue             │   │
│  │  │                 │  ← Cursor: Pointer              │   │
│  │  └─────────────────┘  ← Border: Solid               │   │
│  │                                                     │   │
│  │  await expect(page.getByRole('button',              │   │
│  │    { name: 'Submit' })).toBeEnabled();              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER INTERACTION                         │
│                           ↓                                 │
│  LOADING STATE: Processing                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────┐  ← Disabled during processing  │   │
│  │  │  ⟳ Processing   │  ← Background: Gray             │   │
│  │  │                 │  ← Cursor: Not-allowed          │   │
│  │  └─────────────────┘  ← Spinner animation           │   │
│  │                                                     │   │
│  │  await expect(page.getByRole('button',              │   │
│  │    { name: 'Submit' })).toBeDisabled();             │   │
│  │  await expect(page.getByText('Processing'))         │   │
│  │    .toBeVisible();                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    PROCESSING COMPLETE                      │
│                           ↓                                 │
│  SUCCESS STATE: Completed                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────┐  ← Success indication          │   │
│  │  │  ✓ Completed    │  ← Background: Green            │   │
│  │  │                 │  ← Cursor: Default              │   │
│  │  └─────────────────┘  ← Check mark icon             │   │
│  │                                                     │   │
│  │  await expect(page.getByText('✓ Completed'))        │   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByRole('button'))             │   │
│  │    .toHaveClass(/success/);                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    TIMEOUT OR RESET                         │
│                           ↓                                 │
│  RESET STATE: Back to Initial                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────┐  ← Returns to enabled state    │   │
│  │  │     Submit      │  ← Background: Blue             │   │
│  │  │                 │  ← Ready for next interaction   │   │
│  │  └─────────────────┘                                │   │
│  │                                                     │   │
│  │  await page.waitForTimeout(2000);                   │   │
│  │  await expect(page.getByRole('button',              │   │
│  │    { name: 'Submit' })).toBeEnabled();              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Form Field State Transitions

### Input Field Validation States

```
┌─────────────────────────────────────────────────────────────┐
│               📝 INPUT FIELD STATE CHANGES                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EMPTY STATE: Initial Field                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Address                                      │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ Enter your email address...             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Placeholder text visible                        │   │
│  │  ↑ Border: Gray (neutral)                          │   │
│  │  ↑ Background: White                               │   │
│  │                                                     │   │
│  │  await expect(page.getByLabel('Email'))             │   │
│  │    .toBeEmpty();                                    │   │
│  │  await expect(page.getByLabel('Email'))             │   │
│  │    .toHaveAttribute('placeholder',                  │   │
│  │      'Enter your email address...');                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER STARTS TYPING                       │
│                           ↓                                 │
│  FOCUSED STATE: Active Input                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Address                                      │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ user@exam|                              │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Cursor blinking                                 │   │
│  │  ↑ Border: Blue (focused)                          │   │
│  │  ↑ Placeholder hidden                              │   │
│  │                                                     │   │
│  │  await page.getByLabel('Email').focus();            │   │
│  │  await expect(page.getByLabel('Email'))             │   │
│  │    .toBeFocused();                                  │   │
│  │  await page.getByLabel('Email')                     │   │
│  │    .fill('user@exam');                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    VALIDATION TRIGGERED                     │
│                           ↓                                 │
│  INVALID STATE: Validation Error                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Address                                      │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ user@exam                               │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Border: Red (error)                             │   │
│  │  ↑ Background: Light red                           │   │
│  │  ⚠️ Please enter a valid email address             │   │
│  │  ↑ Error message visible                           │   │
│  │                                                     │   │
│  │  await page.getByLabel('Email').blur();             │   │
│  │  await expect(page.getByText('Please enter a valid'))│   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByLabel('Email'))             │   │
│  │    .toHaveClass(/error/);                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER CORRECTS INPUT                      │
│                           ↓                                 │
│  VALID STATE: Validation Success                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Address                                      │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ user@example.com                        │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Border: Green (success)                         │   │
│  │  ↑ Background: Light green                         │   │
│  │  ✓ Valid email address                             │   │
│  │  ↑ Success message visible                         │   │
│  │                                                     │   │
│  │  await page.getByLabel('Email')                     │   │
│  │    .fill('user@example.com');                       │   │
│  │  await expect(page.getByText('✓ Valid'))            │   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByLabel('Email'))             │   │
│  │    .toHaveClass(/success/);                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ☑️ Checkbox State Transitions

### Checkbox Interaction States

```
┌─────────────────────────────────────────────────────────────┐
│                ☑️ CHECKBOX STATE CHANGES                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  UNCHECKED STATE: Default                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ☐ I agree to the terms and conditions             │   │
│  │  ↑ Empty checkbox                                   │   │
│  │  ↑ Label text clickable                             │   │
│  │  ↑ Background: White                                │   │
│  │  ↑ Border: Gray                                     │   │
│  │                                                     │   │
│  │  await expect(page.getByLabel('I agree'))           │   │
│  │    .not.toBeChecked();                              │   │
│  │  await expect(page.getByRole('checkbox'))           │   │
│  │    .toHaveAttribute('aria-checked', 'false');       │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER CLICKS CHECKBOX                     │
│                           ↓                                 │
│  CHECKED STATE: Selected                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ☑ I agree to the terms and conditions             │   │
│  │  ↑ Checkmark visible                                │   │
│  │  ↑ Background: Blue                                 │   │
│  │  ↑ Border: Blue                                     │   │
│  │  ↑ White checkmark icon                             │   │
│  │                                                     │   │
│  │  await page.getByLabel('I agree').check();          │   │
│  │  await expect(page.getByLabel('I agree'))           │   │
│  │    .toBeChecked();                                  │   │
│  │  await expect(page.getByRole('checkbox'))           │   │
│  │    .toHaveAttribute('aria-checked', 'true');        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER CLICKS AGAIN                        │
│                           ↓                                 │
│  UNCHECKED STATE: Deselected                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ☐ I agree to the terms and conditions             │   │
│  │  ↑ Returns to empty state                           │   │
│  │  ↑ Background: White                                │   │
│  │  ↑ Border: Gray                                     │   │
│  │                                                     │   │
│  │  await page.getByLabel('I agree').uncheck();        │   │
│  │  await expect(page.getByLabel('I agree'))           │   │
│  │    .not.toBeChecked();                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  INDETERMINATE STATE: Partial Selection (Rare)             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ☑ Select All Items                                │   │
│  │  ↑ Dash/line instead of checkmark                   │   │
│  │  ↑ Background: Blue                                 │   │
│  │  ↑ Indicates partial selection                      │   │
│  │                                                     │   │
│  │  // Set indeterminate state programmatically       │   │
│  │  await page.evaluate(() => {                        │   │
│  │    document.querySelector('#selectAll')             │   │
│  │      .indeterminate = true;                         │   │
│  │  });                                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Dropdown State Transitions

### Select Element State Changes

```
┌─────────────────────────────────────────────────────────────┐
│               📋 DROPDOWN STATE TRANSITIONS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CLOSED STATE: Default Dropdown                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Country                                            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ Select a country...                     ▼ │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Placeholder text visible                        │   │
│  │  ↑ Dropdown arrow pointing down                    │   │
│  │  ↑ Options hidden                                  │   │
│  │                                                     │   │
│  │  await expect(page.getByLabel('Country'))           │   │
│  │    .toHaveValue('');                                │   │
│  │  await expect(page.locator('.dropdown-options'))    │   │
│  │    .toBeHidden();                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER CLICKS DROPDOWN                     │
│                           ↓                                 │
│  OPEN STATE: Options Visible                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Country                                            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ Select a country...                     ▲ │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ United States                           │     │   │
│  │  │ Canada                                  │     │   │
│  │  │ United Kingdom                          │     │   │
│  │  │ Germany                                 │     │   │
│  │  │ France                                  │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Options list expanded                            │   │
│  │  ↑ Dropdown arrow pointing up                      │   │
│  │  ↑ Options are clickable                           │   │
│  │                                                     │   │
│  │  await page.getByLabel('Country').click();          │   │
│  │  await expect(page.locator('.dropdown-options'))    │   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByText('United States'))      │   │
│  │    .toBeVisible();                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER HOVERS OVER OPTION                  │
│                           ↓                                 │
│  HOVER STATE: Option Highlighted                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Country                                            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ Select a country...                     ▲ │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ United States                           │     │   │
│  │  │ ████ Canada ████████████████████████████ │     │   │
│  │  │ United Kingdom                          │     │   │
│  │  │ Germany                                 │     │   │
│  │  │ France                                  │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ "Canada" highlighted with background color      │   │
│  │  ↑ Hover effect visible                            │   │
│  │                                                     │   │
│  │  await page.getByText('Canada').hover();            │   │
│  │  await expect(page.getByText('Canada'))             │   │
│  │    .toHaveClass(/highlighted/);                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER SELECTS OPTION                      │
│                           ↓                                 │
│  SELECTED STATE: Option Chosen                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Country                                            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ Canada                                  ▼ │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Selected value displayed                        │   │
│  │  ↑ Dropdown closed                                 │   │
│  │  ↑ Arrow pointing down again                       │   │
│  │                                                     │   │
│  │  await page.getByText('Canada').click();            │   │
│  │  await expect(page.getByLabel('Country'))           │   │
│  │    .toHaveValue('canada');                          │   │
│  │  await expect(page.locator('.dropdown-options'))    │   │
│  │    .toBeHidden();                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Loading State Transitions

### Dynamic Content Loading States

```
┌─────────────────────────────────────────────────────────────┐
│               🔄 LOADING STATE TRANSITIONS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INITIAL STATE: Empty Container                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │                                             │     │   │
│  │  │         No content loaded yet               │     │   │
│  │  │                                             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Empty content area                              │   │
│  │  ↑ Placeholder text or empty state                 │   │
│  │                                                     │   │
│  │  await expect(page.getByTestId('content-area'))     │   │
│  │    .toBeEmpty();                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER TRIGGERS LOAD                       │
│                           ↓                                 │
│  LOADING STATE: Spinner/Skeleton                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │                                             │     │   │
│  │  │              ⟳ Loading...                   │     │   │
│  │  │                                             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Loading spinner visible                         │   │
│  │  ↑ Loading text displayed                          │   │
│  │  ↑ Background may be dimmed                        │   │
│  │                                                     │   │
│  │  await page.getByRole('button',                     │   │
│  │    { name: 'Load Data' }).click();                  │   │
│  │  await expect(page.getByText('Loading...'))         │   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByTestId('spinner'))          │   │
│  │    .toBeVisible();                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    DATA LOADS SUCCESSFULLY                  │
│                           ↓                                 │
│  LOADED STATE: Content Visible                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │ • Item 1 - Description here                 │     │   │
│  │  │ • Item 2 - Another description              │     │   │
│  │  │ • Item 3 - More content                     │     │   │
│  │  │ • Item 4 - Additional data                  │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Actual content displayed                        │   │
│  │  ↑ Loading indicators hidden                       │   │
│  │  ↑ Content is interactive                          │   │
│  │                                                     │   │
│  │  await expect(page.getByText('Loading...'))         │   │
│  │    .toBeHidden();                                   │   │
│  │  await expect(page.getByText('Item 1'))             │   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByTestId('content-area'))     │   │
│  │    .not.toBeEmpty();                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    LOAD ERROR OCCURS                        │
│                           ↓                                 │
│  ERROR STATE: Failed to Load                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │                                             │     │   │
│  │  │  ⚠️ Failed to load content                  │     │   │
│  │  │     [Retry] [Cancel]                        │     │   │
│  │  │                                             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  │  ↑ Error message displayed                         │   │
│  │  ↑ Retry and cancel buttons available              │   │
│  │  ↑ Error styling (red background/border)           │   │
│  │                                                     │   │
│  │  await expect(page.getByText('Failed to load'))     │   │
│  │    .toBeVisible();                                  │   │
│  │  await expect(page.getByRole('button',              │   │
│  │    { name: 'Retry' })).toBeVisible();               │   │
│  │  await expect(page.getByTestId('content-area'))     │   │
│  │    .toHaveClass(/error/);                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎭 Modal Dialog State Transitions

### Modal Lifecycle States

```
┌─────────────────────────────────────────────────────────────┐
│               🎭 MODAL DIALOG STATE CHANGES                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HIDDEN STATE: Modal Not Visible                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Main Page Content                                  │   │
│  │  ┌─────────────────┐                                │   │
│  │  │ Open Modal      │ ← Trigger button visible       │   │
│  │  └─────────────────┘                                │   │
│  │                                                     │   │
│  │  ↑ Modal is not in DOM or hidden                    │   │
│  │  ↑ Page content is fully interactive                │   │
│  │  ↑ No overlay present                               │   │
│  │                                                     │   │
│  │  await expect(page.getByRole('dialog'))             │   │
│  │    .toBeHidden();                                   │   │
│  │  await expect(page.getByTestId('modal-overlay'))     │   │
│  │    .not.toBeVisible();                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    USER CLICKS TRIGGER                      │
│                           ↓                                 │
│  OPENING STATE: Animation In Progress                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ████████████████████████████████████████████████     │   │
│  │  ██                                            ██     │   │
│  │  ██    ┌─────────────────────────────────┐     ██     │   │
│  │  ██    │                                 │     ██     │   │
│  │  ██    │        Modal Opening...         │     ██     │   │
│  │  ██    │                                 │     ██     │   │
│  │  ██    └─────────────────────────────────┘     ██     │   │
│  │  ██                                            ██     │   │
│  │  ████████████████████████████████████████████████     │   │
│  │  ↑ Semi-transparent overlay                        │   │
│  │  ↑ Modal sliding/fading in                         │   │
│  │  ↑ Background content dimmed                       │   │
│  │                                                     │   │
│  │  await page.getByRole('button',                     │   │
│  │    { name: 'Open Modal' }).click();                 │   │
│  │  await expect(page.getByTestId('modal-overlay'))     │   │
│  │    .toBeVisible();                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│                    ANIMATION COMPLETES                      │
│                           ↓                                 │
│  OPEN STATE: Modal Fully Visible                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ████████████████████████████████████████████████     │   │
│  │  ██                                            ██     │   │
│  │  ██    ┌─────────────────────────────────┐     ██     │   │
│  │  ██    │ Confirm Action              ✕   │     ██     │   │
│  │  ██    │                                 │     ██     │   │
│  │  ██    │ Are you sure you want to        │     ██     │   │
│  │  ██    │ delete this item?               