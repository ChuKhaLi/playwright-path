# Lesson 8: Assessment

## Instructions

Read each question carefully and select the best answer. These questions are designed to test your practical understanding of HTML, CSS, and JavaScript from a tester's perspective.

---

### Question 1

You are inspecting a button in the browser's developer tools and see the following HTML: `<button id="user-login-btn" class="submit-button">Login</button>`. What is the BEST and most reliable CSS selector to find this specific button?

a) `.submit-button`
b) `button`
c) `#user-login-btn`
d) `button.submit-button`

---

### Question 2

What is the main difference between an `id` attribute and a `class` attribute in HTML?

a) An `id` must be unique on a page, while a `class` can be used on multiple elements.
b) A `class` must be unique on a page, while an `id` can be used on multiple elements.
c) Only `id` can be used for testing.
d) They are functionally identical.

---

### Question 3

How do you open the browser's developer tools to inspect an element on a webpage?

a) By pressing `Ctrl+C`.
b) By right-clicking the element and selecting "Inspect".
c) By refreshing the page twice.
d) By typing "inspect" into the address bar.

---

### Question 4

You see the following HTML: `<form onsubmit="validateAndSend()">`. What does the `onsubmit` attribute signify?

a) It's the unique ID of the form.
b) It's a CSS class for styling the form.
c) It's a JavaScript event that will fire when the form is submitted.
d) It's a comment for the developer.

---

### Question 5

Which CSS selector would find an element with the HTML `<p class="warning-text"></p>`?

a) `#warning-text`
b) `p`
c) `.warning-text`
d) Both b and c could work, but c is more specific.

---

## Answer Key

1. **c) `#user-login-btn`**
   - *Explanation: The `id` is the most unique and stable identifier for an element, making it the preferred choice for selectors.*

2. **a) An `id` must be unique on a page, while a `class` can be used on multiple elements.**
   - *Explanation: This uniqueness is what makes the `id` so valuable for precise targeting in tests.*

3. **b) By right-clicking the element and selecting "Inspect".**
   - *Explanation: This is the most direct way to open the developer tools and immediately see the HTML for a specific element.*

4. **c) It's a JavaScript event that will fire when the form is submitted.**
   - *Explanation: Attributes starting with "on" (like `onclick`, `onsubmit`) typically represent JavaScript events that your test will trigger.*

5. **d) Both b and c could work, but c is more specific.**
   - *Explanation: While a `p` selector would find all paragraph tags, the `.warning-text` class selector is more specific and therefore a better choice for a test.*