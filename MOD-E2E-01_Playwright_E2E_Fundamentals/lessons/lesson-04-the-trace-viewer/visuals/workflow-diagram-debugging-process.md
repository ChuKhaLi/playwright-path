# Debugging Process Workflow Diagram

## ⚙️ Step-by-Step Visual Guide to Debugging with the Trace Viewer

This guide provides a systematic workflow for debugging test failures using the Playwright Trace Viewer, helping you identify the root cause of issues quickly and efficiently.

---

## 🕵️‍♂️ Main Debugging Workflow

### Systematic Approach to Resolving Test Failures

```
┌─────────────────────────────────────────────────────────────┐
│                🕵️‍♂️ MAIN DEBUGGING WORKFLOW                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  START: Test Failure Occurs                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Test fails in local dev or CI/CD environment     │   │
│  │ 2. Trace file is generated (`on-first-retry` or     │   │
│  │    `retain-on-failure`)                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 1: Open the Trace File                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ npx playwright show-trace <path-to-trace.zip>       │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 2: Identify the Failed Action                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Locate the red action in the Action List         │   │
│  │ 2. Read the error message in the Details Panel      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 3: Analyze the State at Failure                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Examine the DOM Snapshot for the failed action   │   │
│  │ 2. Check the Console tab for JavaScript errors      │   │
│  │ 3. Check the Network tab for failed API requests    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 4: Time-Travel to Previous Actions                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Step back through the Action List one by one     │   │
│  │ 2. Compare "Before" and "After" DOM snapshots       │   │
│  │ 3. Look for the point where the state diverged      │   │
│  │    from expectations                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 5: Formulate a Hypothesis                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Based on the analysis, determine the likely cause:  │   │
│  │ - Incorrect locator?                                │   │
│  │ - Timing issue (element not ready)?                 │   │
│  │ - Unexpected application state?                     │   │
│  │ - Failed network request?                           │   │
│  │ - JavaScript error on the page?                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 6: Implement and Verify Fix                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Modify the test code based on the hypothesis     │   │
│  │ 2. Rerun the test locally to confirm the fix        │   │
│  │ 3. If it passes, the issue is resolved              │   │
│  │ 4. If it fails, return to Step 3 and re-analyze     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  END: Test Passes Successfully                              │
└─────────────────────────────────────────────────────────────┘
```

---

##  сценарий 1: Element Not Found Workflow

### Debugging "Element Not Found" Errors

```
┌─────────────────────────────────────────────────────────────┐
│             🔍 ELEMENT NOT FOUND DEBUGGING FLOW             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ERROR: `Timeout waiting for selector "..."`                │
│                           ↓                                 │
│  Step 1: Analyze the Failed Action                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Select the failed action in the Trace Viewer     │   │
│  │ 2. Copy the selector from the Details Panel         │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 2: Inspect the DOM Snapshot                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Is the element present in the DOM at all?        │   │
│  │    - If NO, why wasn't it rendered? Check console/  │   │
│  │      network for errors.                            │   │
│  │                                                     │   │
│  │ 2. If YES, is the selector incorrect?               │   │
│  │    - Does it have a typo?                           │   │
│  │    - Did a class name or ID change?                 │   │
│  │    - Is the element hidden (`display: none`)?       │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 3: Check for Timing Issues                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Look at the "Before" snapshot. Was the element   │   │
│  │    present just before the action?                  │   │
│  │                                                     │   │
│  │ 2. Is the element part of dynamically loaded content?│   │
│  │    - Check the Network tab for related API calls.   │   │
│  │    - Did the API call fail or return empty data?    │   │
│  │                                                     │   │
│  │ 3. Was there a loading spinner or overlay present?  │   │
│  │    - The element might exist but not be actionable. │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 4: Formulate Solution                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ - **Fix Selector**: Correct the locator in the test.│   │
│  │ - **Add Wait**: Add an explicit wait for the element│   │
│  │   or for a network request to complete.             │   │
│  │ - **Handle Overlay**: Add a step to wait for any   │   │
│  │   overlays to disappear.                            │   │
│  │ - **Improve Locator**: Switch to a more resilient  │   │
│  │   locator strategy (e.g., `getByRole`).             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timing and Synchronization Workflow

### Debugging Flaky Tests and Race Conditions

```
┌─────────────────────────────────────────────────────────────┐
│             ⏱️ TIMING & SYNC DEBUGGING FLOW                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SYMPTOM: Test passes locally but fails in CI, or fails     │
│           intermittently.                                   │
│                           ↓                                 │
│  Step 1: Analyze the Trace of a Failed Run                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Open the trace from the flaky failure.           │   │
│  │ 2. Pay close attention to the Timeline view.        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 2: Look for Race Conditions                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Are actions executing faster than the UI updates?│   │
│  │    - Example: Clicking a button before the         │   │
│  │      subsequent UI change has fully rendered.       │   │
│  │                                                     │   │
│  │ 2. Is the test interacting with an element that is  │   │
│  │    about to be removed or replaced in the DOM?      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 3: Check Network and Asynchronous Operations          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Go to the Network tab. Are there any API calls   │   │
│  │    that are slower in the failed run?               │   │
│  │                                                     │   │
│  │ 2. Does the test depend on the result of a network  │   │
│  │    request that hasn't completed yet?               │   │
│  │                                                     │   │
│  │ 3. Look for animations or transitions that might    │   │
│  │    delay element availability.                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 4: Formulate Solution                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ - **Use Web-First Assertions**: Replace manual waits│   │
│  │   with `expect(locator).toBeVisible()`. Playwright's│   │
│  │   auto-waiting will handle most timing issues.      │   │
│  │                                                     │   │
│  │ - **Wait for Network Requests**: Use                │   │
│  │   `page.waitForResponse()` or `waitForLoadState` to │   │
│  │   ensure data has loaded before proceeding.         │   │
│  │                                                     │   │
│  │ - **Wait for Element State**: Use `toBeEnabled`,    │   │
│  │   `toBeEditable`, etc., to ensure the element is    │   │
│  │   ready for interaction.                            │   │
│  │                                                     │   │
│  │ - **Avoid `waitForTimeout`**: Replace static waits  │   │
│  │   with condition-based waits.                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎭 Unexpected Application State Workflow

### Debugging When the Application Behaves Incorrectly

```
┌─────────────────────────────────────────────────────────────┐
│           🎭 UNEXPECTED STATE DEBUGGING FLOW               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SYMPTOM: The test fails because the application is in an   │
│           unexpected state (e.g., wrong page, incorrect    │
│           data displayed, modal doesn't appear).            │
│                           ↓                                 │
│  Step 1: Identify the Point of Divergence                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Open the trace and go to the failed action.      │   │
│  │ 2. Step backwards through the Action List.          │   │
│  │ 3. At each step, compare the DOM snapshot with your │   │
│  │    expected state.                                  │   │
│  │ 4. Find the first action where the "After" state is │   │
│  │    not what you expected.                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 2: Analyze the Divergent Action                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. What did this action do?                         │   │
│  │ 2. Check the Console tab for any JavaScript errors  │   │
│  │    that occurred during or after this action.       │   │
│  │ 3. Check the Network tab. Did this action trigger   │   │
│  │    an API call? Did that call succeed? Did it return│   │
│  │    the expected data?                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 3: Review Test Logic                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Is the test making a wrong assumption about the  │   │
│  │    application's behavior?                          │   │
│  │                                                     │   │
│  │ 2. Is the test data used in this step correct?      │   │
│  │                                                     │   │
│  │ 3. Is there a missing step or assertion before this │   │
│  │    point?                                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  Step 4: Formulate Solution                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ - **Add Assertions**: Add more assertions throughout│   │
│  │   the test to catch state deviations earlier.       │   │
│  │                                                     │   │
│  │ - **Fix Test Logic**: Correct the test steps to    │   │
│  │   match the actual application flow.                │   │
│  │                                                     │   │
│  │ - **Mock API Responses**: If the issue is due to    │   │
│  │   unreliable API data, mock the API response to     │   │
│  │   create a consistent state.                        │   │
│  │                                                     │   │
│  │ - **Report Application Bug**: If the analysis shows│   │
│  │   the application is at fault, file a bug report    │   │
│  │   with the trace file attached.                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘