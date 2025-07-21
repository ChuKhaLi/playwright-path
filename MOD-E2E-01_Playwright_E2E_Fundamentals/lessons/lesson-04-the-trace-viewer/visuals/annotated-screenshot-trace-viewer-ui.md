# Annotated Screenshot: Trace Viewer Interface

## 🖼️ Visual Guide to the Playwright Trace Viewer UI

This guide provides an annotated screenshot of the Playwright Trace Viewer interface, explaining each component and its function to help you master this powerful debugging tool.

---

## 📍 Main Interface Overview

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PLAYWRIGHT TRACE VIEWER                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  [1] TIMELINE ────────────────────────────────────────────────────────────────────────────────── │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ █ page.goto(...) ██ page.fill(...) ██ page.click(...) ██ expect(...) ██ page.screenshot() │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                  │
│  [2] ACTION LIST (Left Panel)      [3] DOM SNAPSHOT (Center Panel)      [4] DETAILS (Right Panel)│
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐  ┌─────────────────────┐│
│  │ ▷ page.goto(...)           │  │ <html>                           │  │ Action: page.click  ││
│  │ ▷ page.fill(...)           │  │   <head>...</head>                │  │ Selector: #submit   ││
│  │ ▶ page.click(...)          │  │   <body>                         │  │ Time: 150ms         ││
│  │   - before                 │  │     <div class="container">      │  │                     ││
│  │   - action                 │  │       <form>                     │  │ [5] METADATA        ││
│  │   - after                  │  │         <input id="username">    │  │ ▷ Browser: Chromium ││
│  │ ▷ expect(...)              │  │         <input id="password">    │  │ ▷ Viewport: 1280x720││
│  │ ▷ page.screenshot()        │  │         <button id="submit">     │  │                     ││
│  └──────────────────────────────┘  │       </form>                    │  │ [6] CONSOLE         ││
│                                    │     </div>                       │  │ > log message...    ││
│                                    │   </body>                        │  │                     ││
│                                    │ </html>                          │  │ [7] NETWORK         ││
│                                    └──────────────────────────────────┘  │ ▷ GET /api/data     ││
│                                                                          └─────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Component Annotations

### [1] Timeline

The timeline provides a high-level overview of the test execution flow.

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ █ page.goto(...) ██ page.fill(...) ██ page.click(...) ██ expect(...) ██ page.screenshot() │
│ ▲                ▲                  ▲                   ▲                 ▲                  │
│ │                │                  │                   │                 │                  │
│ └─ Navigation   └─ Text Input     └─ Click Action    └─ Assertion     └─ Screenshot       │
│                                                                                            │
│ HOVER to see action details and duration.                                                  │
│ CLICK to jump to that point in time.                                                       │
│ SCROLL to zoom in and out for more or less detail.                                         │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### [2] Action List

The action list provides a detailed, chronological log of every Playwright action.

```
┌──────────────────────────────┐
│ ▷ page.goto(...)           │  ← Navigation action
│ ▷ page.fill(...)           │  ← Form filling action
│ ▶ page.click(...)          │  ← Currently selected action
│   - before                 │  ← DOM state BEFORE the click
│   - action                 │  ← The click event itself
│   - after                  │  ← DOM state AFTER the click
│ ▷ expect(...)              │  ← Assertion/validation
│ ▷ page.screenshot()        │  ← Screenshot action
└──────────────────────────────┘
```

### [3] DOM Snapshot

The DOM snapshot shows a fully interactive rendering of the page at the selected point in time.

```
┌──────────────────────────────────┐
│ <html>                           │
│   <head>...</head>                │
│   <body>                         │
│     <div class="container">      │
│       <form>                     │
│         <input id="username">    │ ← Click to inspect
│         <input id="password">    │
│         <button id="submit">     │ ← Highlighted element
│       </form>                    │
│     </div>                       │
│   </body>                        │
│ </html>                          │
└──────────────────────────────────┘
```

### [4] Details Panel

The details panel provides context-specific information about the selected action.

```
┌─────────────────────┐
│ Action: page.click  │ ← The executed action
│ Selector: #submit   │ ← The locator used
│ Time: 150ms         │ ← Execution duration
│                     │
│ [5] METADATA        │ ← Test environment details
│ ▷ Browser: Chromium │
│ ▷ Viewport: 1280x720│
│                     │
│ [6] CONSOLE         │ ← Browser console output
│ > log message...    │
│                     │
│ [7] NETWORK         │ ← Network request logs
│ ▷ GET /api/data     │
└─────────────────────┘
```

### [5] Metadata Tab

The metadata tab shows important information about the test execution environment.

```
┌─────────────────────┐
│ METADATA            │
│ ------------------- │
│ Browser: Chromium   │ ← Browser engine used
│ Viewport: 1280x720  │ ← Screen resolution
│ Device Scale: 1     │ ← Pixel density
│ Is Mobile: false    │ ← Mobile emulation status
│ Has Touch: false    │ ← Touch event support
│ Start Time: ...     │ ← Test start timestamp
│ Duration: 2.5s      │ ← Total test duration
└─────────────────────┘
```

### [6] Console Tab

The console tab displays all browser console messages logged during the test.

```
┌─────────────────────┐
│ CONSOLE             │
│ ------------------- │
│ > TRACE: Starting...│ ← Custom log from test
│ > [Error] Failed... │ ← JavaScript error
│ > [Warning] Dep...  │ ← Browser warning
│ > Navigated to...   │ ← Navigation log
└─────────────────────┘
```

### [7] Network Tab

The network tab provides a complete log of all network requests made during the test.

```
┌─────────────────────┐
│ NETWORK             │
│ ------------------- │
│ ▷ GET /login        │ ← Initial page load
│   - Status: 200 OK  │
│   - Time: 120ms     │
│ ▷ POST /api/login   │ ← Form submission
│   - Status: 401     │
│   - Time: 250ms     │
│ ▷ GET /styles.css   │ ← Asset loading
│   - Status: 200 OK  │
│   - Time: 50ms      │
└─────────────────────┘
```

---

## ⚙️ Time-Travel Debugging Controls

### Before/After Action Views

When an action is selected, you can toggle between the DOM state *before* and *after* the action.

```
┌─────────────────────────────────────────────────────────────┐
│                 ⚙️ TIME-TRAVEL CONTROLS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Action: page.fill('#username', 'testuser')                 │
│                                                             │
│  BEFORE Snapshot:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Username:                                           │   │
│  │ ┌─────────────────────────────────────────────┐     │   │
│  │ │                                             │     │   │
│  │ └─────────────────────────────────────────────┘     │   │
│  │ ↑ Input field is empty                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↕                                 │
│  AFTER Snapshot:                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Username:                                           │   │
│  │ ┌─────────────────────────────────────────────┐     │   │
│  │ │ testuser                                    │     │   │
│  │ └─────────────────────────────────────────────┘     │   │
│  │ ↑ Input field contains "testuser"                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  This allows you to see the immediate impact of each action.│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Practical Usage Tips

- **Start with the Failed Action**: When a test fails, always start by clicking the last (red) action in the list.
- **Work Backwards**: If the final state is incorrect, use the timeline to step back through each action and see where things went wrong.
- **Check Network and Console**: Don't forget to check the Network and Console tabs for hidden issues like failed API calls or JavaScript errors.
- **Use the DOM Snapshot**: Actively click on elements in the DOM snapshot to inspect their properties and verify your locators.
- **Correlate Information**: Use all panels together. A console error might explain why a network request failed, which in turn explains why the DOM didn't update as expected.

This annotated guide provides a solid foundation for navigating and understanding the Playwright Trace Viewer. Use it as a reference to build your debugging skills and resolve test failures more efficiently.