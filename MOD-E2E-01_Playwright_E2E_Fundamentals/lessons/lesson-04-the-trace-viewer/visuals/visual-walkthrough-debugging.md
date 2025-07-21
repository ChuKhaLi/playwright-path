# Visual Walkthrough: Debugging a Test Failure

## 🕵️‍♂️ Step-by-Step Guide to Debugging with the Trace Viewer

This guide provides a step-by-step visual walkthrough of a real debugging scenario, showing you how to use the Trace Viewer to find the root cause of a common test failure.

---

### The Scenario

**Test Goal**: The test should log into a web application.
**Failure**: The test fails with the error `Timeout waiting for expect(locator).toBeVisible()`. The dashboard element is never found after login.

---

### Step 1: Open the Trace

First, open the generated trace file from the failed test run.

```bash
npx playwright show-trace test-results/login-test-chromium/trace.zip
```

You are now presented with the Trace Viewer interface.

---

### Step 2: Identify the Failed Action

Locate the action that failed. It will be highlighted in red in the **Action List**.

```
┌─────────────────────────────────────────────────────────────┐
│                [Step 2] IDENTIFY FAILED ACTION              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Action List                                                │
│  ┌───────────────────────────────────────────────────┐      │
│  │ ▷ page.goto('https://example.com/login')          │      │
│  │ ▷ page.fill('#username', 'testuser')              │      │
│  │ ▷ page.fill('#password', 'wrongpassword')         │      │
│  │ ▷ page.click('#login-button')                     │      │
│  │ ▶ expect(page.locator('.dashboard')).toBeVisible() │      │  ← FAILED ACTION (RED)
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  Details Panel                                              │
│  ┌───────────────────────────────────────────────────┐      │
│  │ Error: Timeout 5000ms exceeded.                   │      │
│  │ Expected: visible                                 │      │
│  │ Received: hidden                                  │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  **Analysis**: The test timed out waiting for the `.dashboard`│
│  element to become visible after clicking the login button. │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 3: Analyze the State at the Point of Failure

With the failed action selected, examine the state of the application.

```
┌─────────────────────────────────────────────────────────────┐
│              [Step 3] ANALYZE STATE AT FAILURE              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DOM Snapshot                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │ <html>                                            │      │
│  │   <body>                                          │      │
│  │     <div class="login-page">                      │      │
│  │       <div class="error-message">                 │      │  ← UNEXPECTED ELEMENT
│  │         Invalid username or password.             │      │
│  │       </div>                                      │      │
│  │       ...                                         │      │
│  │     </div>                                        │      │
│  │   </body>                                         │      │
│  │ </html>                                           │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  **Analysis**: Instead of a dashboard, the DOM shows an     │
│  error message: "Invalid username or password." The test   │
│  is still on the login page.                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 4: Time-Travel to the Previous Action

Let's step back to the `page.click('#login-button')` action to see what happened.

```
┌─────────────────────────────────────────────────────────────┐
│             [Step 4] TIME-TRAVEL TO PREVIOUS ACTION         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Action List                                                │
│  ┌───────────────────────────────────────────────────┐      │
│  │ ▷ page.goto('https://example.com/login')          │      │
│  │ ▷ page.fill('#username', 'testuser')              │      │
│  │ ▷ page.fill('#password', 'wrongpassword')         │      │
│  │ ▶ page.click('#login-button')                     │      │  ← NOW SELECTED
│  │ ▷ expect(page.locator('.dashboard')).toBeVisible() │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  **Action**: Now, let's check the Network tab for this step.│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 5: Inspect Network Activity

With the click action selected, check the **Network** tab to see the API request that was triggered.

```
┌─────────────────────────────────────────────────────────────┐
│               [Step 5] INSPECT NETWORK ACTIVITY             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Network Tab                                                │
│  ┌───────────────────────────────────────────────────┐      │
│  │ ▷ GET /login (200)                                │      │
│  │ ▶ POST /api/login (401 Unauthorized)              │      │  ← FAILED API REQUEST
│  │   - Request Payload:                               │      │
│  │     {                                             │      │
│  │       "username": "testuser",                     │      │
│  │       "password": "wrongpassword"                  │      │
│  │     }                                             │      │
│  │   - Response Body:                                 │      │
│  │     {                                             │      │
│  │       "error": "Invalid credentials"               │      │
│  │     }                                             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  **Analysis**: The login button click triggered a `POST`    │
│  request to `/api/login`. This request failed with a 401    │
│  Unauthorized status. The response body confirms "Invalid  │
│  credentials".                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 6: Review Console Logs (Optional but good practice)

Check the **Console** tab for any client-side errors that might provide more context.

```
┌─────────────────────────────────────────────────────────────┐
│                 [Step 6] REVIEW CONSOLE LOGS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Console Tab                                                │
│  ┌───────────────────────────────────────────────────┐      │
│  │ > [Log] Attempting login for user: testuser       │      │
│  │ > [Warn] Login API failed with status 401         │      │  ← CONFIRMS THE ISSUE
│  │ > [Log] Displaying error message to user          │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  **Analysis**: The console logs confirm that the application│
│  handled the 401 error and intentionally displayed an error │
│  message. There are no unexpected JavaScript errors.        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 7: Formulate the Conclusion (Root Cause Analysis)

Now, we combine all our findings to determine the root cause.

```
┌─────────────────────────────────────────────────────────────┐
│              [Step 7] FORMULATE THE CONCLUSION              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. **What did the test do?**                               │
│     - It filled the username with "testuser" and the       │
│       password with "wrongpassword".                       │
│                                                             │
│  2. **What was the immediate result?**                      │
│     - The `/api/login` call failed with a 401 error.       │
│                                                             │
│  3. **How did the application respond?**                    │
│     - It displayed the error message "Invalid username or  │
│       password."                                           │
│                                                             │
│  4. **Why did the assertion fail?**                         │
│     - Because the login failed, the application never      │
│       navigated to the dashboard. The `.dashboard` element │
│       was therefore never visible.                         │
│                                                             │
│  **ROOT CAUSE**: The test is using incorrect login          │
│  credentials ("wrongpassword"). The application is behaving │
│  correctly by showing an error message. The test assertion │
│  is incorrect for this negative test case.                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 8: Determine the Fix

Based on the root cause, we can decide how to fix the test.

```
┌─────────────────────────────────────────────────────────────┐
│                  [Step 8] DETERMINE THE FIX                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  **Option A: Fix the test data for a "happy path" test.**   │
│  - Change the password to the correct one.                  │
│  - The existing assertion `expect(...).toBeVisible()` will │
│    then pass.                                               │
│                                                             │
│  **Option B: Change the test to be a "negative path" test.**│
│  - Keep the incorrect password.                             │
│  - Change the assertion to verify the error message:        │
│    `expect(page.getByText('Invalid...')).toBeVisible()`     │
│  - Rename the test to reflect that it's testing a failure │
│    scenario, e.g., "should show an error on invalid login". │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

This walkthrough demonstrates how the Trace Viewer provides a complete, multi-faceted view of your test's execution, allowing you to quickly move from a high-level failure to the specific root cause by analyzing the DOM, network, and console data in tandem.