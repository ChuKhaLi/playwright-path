# Lesson 15: Browser Developer Tools Mastery - Assessment

## Multiple Choice Questions

1.  **What is the most common keyboard shortcut to open Browser Developer Tools?**
    a.  Ctrl+S
    b.  F5
    c.  F12
    d.  Ctrl+P

2.  **Which DevTools panel would you use to inspect and test a CSS selector or XPath expression?**
    a.  Console
    b.  Network
    c.  Elements
    d.  Application

3.  **To monitor API requests (like Fetch/XHR) made by a webpage, which panel is the most appropriate?**
    a.  Performance
    b.  Memory
    c.  Console
    d.  Network

4.  **You want to see if a session token is correctly stored in a cookie after logging in. Which panel should you check?**
    a.  Elements
    b.  Application
    c.  Security
    d.  Network

5.  **What is the primary purpose of the Console panel for a QA engineer?**
    a.  To edit HTML and CSS.
    b.  To view and execute JavaScript and check for error messages.
    c.  To throttle the network speed.
    d.  To inspect the DOM tree.

## Short Answer Questions

1.  **Describe the steps you would take in the Elements panel to find a unique selector for a "Submit" button on a form.**
2.  **You are testing a feature, and after you click a button, nothing happens on the UI. Name at least two DevTools panels you would investigate to debug the issue, and explain what you would look for in each.**
3.  **What is the difference between Local Storage and Session Storage, and where can you inspect them in DevTools?**

## Practical Application

**Scenario:** You are testing a login page.

1.  **Task:** You need to automate filling in the username field. The field has no `id` but has a `class` of "login-input username". How would you use the Elements panel to confirm that `input.login-input.username` is a unique and correct CSS selector?
2.  **Task:** After you click the "Login" button, you are redirected to the wrong page. How would you use the Network panel to investigate what might be going wrong? What specific information would you look for in the request details?
3.  **Task:** A developer tells you that a successful login should store a `user_id` in Local Storage. Describe the exact steps you would take within DevTools to verify this.