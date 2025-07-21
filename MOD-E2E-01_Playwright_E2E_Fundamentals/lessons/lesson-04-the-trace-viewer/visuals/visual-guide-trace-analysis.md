# Visual Guide for Trace Analysis

## 📊 Step-by-Step Guide to Interpreting Trace Viewer Data

This guide provides visual examples and walkthroughs for analyzing trace files, helping you to interpret the data effectively and diagnose test failures.

---

## 📈 Reading the Timeline

### Understanding Action Durations and Sequence

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    📈 TIMELINE ANALYSIS                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  [A] Short, Fast Actions      [B] A Moderately Slow Action      [C] A Very Slow Action     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │ ████ ████ ████           │  │ ████████████████████████████ │  │ ████████████████████████ │ │
│  │ page.fill() (50ms)       │  │ page.click() (500ms)         │  │ expect(...) (5000ms)     │ │
│  │ expect() (20ms)          │  │ - Waiting for element        │  │ - Retrying assertion     │ │
│  │ page.click() (80ms)      │  │ - Scrolling into view        │  │ - Waiting for timeout    │ │
│  └──────────────────────────┘  └──────────────────────────────┘  └──────────────────────────┘ │
│                                                                                            │
│  Analysis:                                                                                 │
│  - [A] Healthy, fast interactions. The test is performing as expected.                     │
│  - [B] The click action took some time. Hover over it to see why. It might be waiting for   │
│        an element to become stable or visible. This is often normal.                       │
│  - [C] The assertion took a long time. This indicates a potential problem. The condition    │
│        being asserted might never have become true, causing Playwright to wait until the   │
│        timeout was reached. This is a common sign of a test failure.                       │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## DOM Snapshot Analysis

### Comparing Before and After States

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 🔍 DOM SNAPSHOT ANALYSIS                                 │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Action: `page.click('button#login')`                                                      │
│                                                                                            │
│  [A] BEFORE Snapshot                                [B] AFTER Snapshot                     │
│  ┌──────────────────────────────────────────┐       ┌────────────────────────────────────┐ │
│  │ <html>                                   │       │ <html>                             │ │
│  │   <body>                                 │       │   <body>                           │ │
│  │     <form>                               │       │     <div class="loading-overlay">  │ │
│  │       <input id="user" value="test">     │       │       <div class="spinner"></div>    │ │
│  │       <input id="pass" value="pass">     │       │     </div>                           │ │
│  │       <button id="login">Login</button>  │       │     <form>...</form>                 │ │
│  │     </form>                              │       │   </body>                            │ │
│  │   </body>                                │       │ </html>                            │ │
│  │ </html>                                  │       │                                    │ │
│  └──────────────────────────────────────────┘       └────────────────────────────────────┘ │
│                                                                                            │
│  Analysis:                                                                                 │
│  - The state of the page *before* the click is shown in [A]. The login button is visible    │
│    and enabled.                                                                            │
│  - The state of the page *after* the click is shown in [B]. A loading overlay has appeared, │
│    covering the form.                                                                      │
│                                                                                            │
│  Conclusion:                                                                               │
│  - The click action successfully triggered a loading state. If the next action in the test │
│    fails because it can't find an element, it's likely because this overlay is blocking    │
│    interaction. The test needs to wait for this overlay to disappear.                      │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Network Request Analysis

### Correlating Network Activity with UI Changes

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 🌐 NETWORK REQUEST ANALYSIS                                │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Scenario: A test fails to find user data on a dashboard page.                             │
│                                                                                            │
│  [1] Action List & Timeline                  [2] Network Tab                               │
│  ┌────────────────────────────────────────┐  ┌───────────────────────────────────────────┐ │
│  │ ▷ page.goto('/dashboard')            │  │ ▷ GET /dashboard (200 OK)                 │ │
│  │ ▷ page.waitForLoadState('networkidle') │  │ ▷ GET /api/user/123 (404 Not Found)     │ │
│  │ ▷ expect(page.getByText('John Doe')) │  │   - Request Headers: ...                  │ │
│  │   - Error: Timeout waiting for text  │  │   - Response Body: {"error": "User not found"}│ │
│  └────────────────────────────────────────┘  └───────────────────────────────────────────┘ │
│                                                                                            │
│  Analysis:                                                                                 │
│  1. The test navigates to the dashboard and waits for the network to be idle.              │
│  2. The test then fails because it cannot find the text "John Doe".                        │
│  3. Looking at the Network tab, we see that the request to `/api/user/123` failed with a   │
│     404 Not Found error.                                                                   │
│  4. The response body confirms that the user was not found.                                │
│                                                                                            │
│  Conclusion:                                                                               │
│  - The root cause is not a locator or timing issue within the test itself. The backend     │
│    service failed to provide the necessary user data.                                      │
│  - This could be due to a problem with the test data setup (user 123 doesn't exist) or a   │
│    bug in the API. The test correctly identified an application issue.                     │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Console Log Analysis

### Using Console Output for Deeper Insights

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 🖥️ CONSOLE LOG ANALYSIS                                   │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Scenario: A form submission button remains disabled, causing the test to fail.            │
│                                                                                            │
│  [1] Action List & DOM Snapshot            [2] Console Tab                                 │
│  ┌────────────────────────────────────────┐  ┌───────────────────────────────────────────┐ │
│  │ ▷ page.fill('#email', 'test@test.com') │  │ > [Log] Form validation started...        │ │
│  │ ▷ page.fill('#password', 'password')   │  │ > [Error] Uncaught TypeError:           │ │
│  │ ▷ expect(button).toBeEnabled()       │  │   Cannot read properties of undefined     │ │
│  │   - Error: Timeout waiting for enabled │  │   (reading 'validatePassword')          │ │
│  │                                        │  │   at validateForm (app.js:105)          │ │
│  │ DOM: <button disabled>Submit</button>  │  └───────────────────────────────────────────┘ │
│  └────────────────────────────────────────┘                                                │
│                                                                                            │
│  Analysis:                                                                                 │
│  1. The test fills out the email and password fields.                                      │
│  2. It then fails when asserting that the submit button should be enabled. The DOM snapshot│
│     confirms the button has the `disabled` attribute.                                      │
│  3. The Console tab reveals an "Uncaught TypeError" related to a `validatePassword`        │
│     function.                                                                              │
│                                                                                            │
│  Conclusion:                                                                               │
│  - A JavaScript error on the page is preventing the form validation logic from completing │
│    successfully.                                                                           │
│  - Because the validation script crashed, the submit button was never enabled.             │
│  - This is a critical application bug that the E2E test has successfully uncovered. The    │
│    trace provides all the necessary information to report the bug to developers.           │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Putting It All Together: A Complete Analysis Walkthrough

### From Failure to Root Cause

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                         🧩 COMPLETE DEBUGGING WALKTHROUGH                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  **Failure**: Test fails to add an item to the cart. `expect(cartCount).toHaveText('1')` fails.│
│                                                                                            │
│  1. **Examine Failed Action**: The assertion failed. The cart count was not '1'.           │
│     - Go to the action right before the assertion: `page.click('.add-to-cart')`.           │
│                                                                                            │
│  2. **Analyze Click Action**:                                                              │
│     - **Timeline**: The click action was very fast (e.g., 30ms). This suggests it didn't   │
│       wait for anything.                                                                   │
│     - **DOM Snapshot**: The "Add to Cart" button was visible and enabled. The click seems  │
│       to have happened correctly.                                                          │
│     - **Console Tab**: No JavaScript errors are visible.                                   │
│                                                                                            │
│  3. **Check Network Tab**:                                                                 │
│     - A `POST /api/cart/add` request was sent after the click.                             │
│     - The request status is `500 Internal Server Error`.                                   │
│     - The response body contains `{"error": "Database connection failed"}`.                │
│                                                                                            │
│  4. **Synthesize Findings**:                                                               │
│     - The test correctly located and clicked the "Add to Cart" button.                     │
│     - The click triggered an API call to the backend.                                      │
│     - The backend API failed with a server error.                                          │
│     - Because the API failed, the cart UI was not updated.                                 │
│     - The final assertion failed because the UI did not reflect the added item.            │
│                                                                                            │
│  **Root Cause**: Backend server error (database connection issue).                          │
│                                                                                            │
│  **Action**: Report the bug to the backend team, providing the trace file and a screenshot │
│            of the network request failure as evidence.                                     │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘