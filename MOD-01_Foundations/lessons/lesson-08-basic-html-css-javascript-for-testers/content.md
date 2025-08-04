# Lesson 8: Basic HTML, CSS, & JavaScript for Testers

## Learning Objectives

- Identify common HTML tags and attributes used for testable elements (e.g., `id`, `class`, `name`).
- Understand the structure of an HTML document (`head`, `body`).
- Learn to write basic CSS selectors to find elements.
- Understand the difference between an `id` and a `class`.
- Recognize common JavaScript events (e.g., `onclick`, `onsubmit`).
- Use browser developer tools to inspect the HTML and CSS of a live website.

---

## 1. A Tester's View of HTML: Tags and Attributes

As a tester, you don't need to be an expert HTML coder, but you do need to be an expert HTML *reader*. You need to look at the HTML and understand how to find the elements you want to interact with.

Let's look at a typical HTML element for a button:
```html
<button id="login-button" class="btn btn-primary" name="submit_button">Log In</button>
```

This element has:
- A **tag name:** `button`
- **Attributes:** `id`, `class`, and `name`. Attributes provide extra information about an element.
- **Content:** "Log In"

The attributes are your best friends for finding elements.
- **`id`:** This **should be unique** for every element on a page. It's the best and most reliable way to find an element.
- **`class`:** This can be used on **multiple elements**. It's used for styling groups of elements the same way, but we can also use it for testing.
- **`name`:** Often used with form elements.

Other important tags for testers include:
- `<input>`: For text fields, checkboxes, radio buttons.
- `<a>`: For links (anchor tags).
- `<select>` and `<option>`: For dropdown menus.
- `<div>` and `<span>`: Generic containers used for layout.

## 2. Inspecting the DOM with Browser Developer Tools

Every modern browser comes with "Developer Tools" that let you look at a website's code live. This is your most important tool for figuring out how to test a page.

**How to Open Developer Tools:**
- **Right-click** on any element on a webpage and select **"Inspect"**.
- Or, press `F12` on your keyboard.

A new panel will open up showing you the HTML (the DOM). As you move your mouse over the HTML in the panel, the corresponding element will be highlighted on the page. This is how you find the tags and attributes you need for your test scripts.

**Practice:**
1. Go to any website (e.g., `www.github.com`).
2. Right-click the main sign-in button and choose "Inspect".
3. Look at the HTML for that button. What is its tag name? Does it have an `id` or a `class`? This is the information you would use in your Playwright script.

## 3. CSS Selectors for Testers

Playwright uses **locators** to find elements, and one of the most common types of locators is a CSS selector. A CSS selector is a pattern that the browser engine uses to find one or more HTML elements.

Here are the most basic selectors you will use constantly:

- **By `id`:** Use a hash symbol (`#`) followed by the id. This is the best and most preferred selector.
  - **HTML:** `<button id="submit-btn">Submit</button>`
  - **Selector:** `#submit-btn`

- **By `class`:** Use a dot (`.`) followed by the class name.
  - **HTML:** `<p class="error-message">Invalid password</p>`
  - **Selector:** `.error-message`
  - **Note:** If an element has multiple classes, like `class="btn btn-primary"`, you can select it with either class: `.btn` or `.btn-primary`.

- **By Tag Name:** Just use the name of the tag. This is very general and will often match many elements.
  - **HTML:** `<h1>Welcome</h1>`
  - **Selector:** `h1`

You can also combine selectors. For example, to find a `button` with the class `login`, you could use `button.login`. We will cover more advanced selectors later.

## 4. The Power of `id` vs. `class`

It's crucial to understand the difference:

| Feature | `id` | `class` |
| :--- | :--- | :--- |
| **Uniqueness** | Must be unique per page. | Can be used on many elements. |
| **CSS Selector** | `#my-id` | `.my-class` |
| **Best for Testing?** | **Yes!** It's the most stable and specific way to find an element. | Good, but less specific than an `id`. |

When you are working with a development team, always encourage them to add unique `id` attributes to important, testable elements. A common practice is to use a special attribute just for testing, like `data-testid`. For example: `<button data-testid="main-login-button">Login</button>`. Playwright has first-class support for this!

## 5. JavaScript Events You Will Encounter

You don't need to write JavaScript yet, but you need to recognize the events that your tests will trigger. When you see these as attributes in the HTML, it's a clue that some dynamic action will happen.

- **`onclick`:** The most common event. It fires when a user clicks an element.
  - Example: `<button onclick="showPopup()">Show Details</button>`
- **`onsubmit`:** Fires when a form is submitted.
  - Example: `<form onsubmit="validateForm()">`
- **`onchange`:** Fires when the value of an element (like a text field or dropdown) changes.
- **`onmouseover`:** Fires when the mouse pointer moves over an element.

Your Playwright script will perform the action (e.g., `page.click()`), which will trigger the event. Your test will then check if the expected outcome (like the popup appearing) happened correctly.