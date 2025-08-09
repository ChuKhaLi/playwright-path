# Lesson 7: Introduction to Web Technologies - Hands-on Exercises

## Overview

These exercises are designed to get you comfortable with the fundamental building blocks of the web: HTML, CSS, and JavaScript. You will use your browser's developer tools to inspect a live website and see these technologies in action.

**Target Website for all exercises:** [http://books.toscrape.com/](http://books.toscrape.com/) (A safe and legal website designed for scraping and testing).

---

### Exercise 1: Exploring the DOM with Developer Tools (Basic)

**Learning Objective:** To become familiar with using browser developer tools to inspect the HTML structure (the DOM) of a webpage.

**Prerequisites:**
- A modern web browser (Chrome or Firefox recommended).
- Basic knowledge of what HTML is.

**Instructions:**

1.  **Open the target website:** Navigate to [http://books.toscrape.com/](http://books.toscrape.com/).
2.  **Open Developer Tools:** Right-click anywhere on the page and select "Inspect" (or press F12). This will open the developer tools panel. Make sure you are on the "Elements" (or "Inspector") tab.
3.  **Find the page title:**
    *   In the Elements panel, expand the `<head>` section of the HTML.
    *   Find the `<title>` element.
    *   **Question:** What is the full title of the webpage?
4.  **Inspect a specific element:**
    *   Use the "element selector" tool (it usually looks like a mouse cursor in a box) in the top-left of the developer tools panel.
    *   Click on the price of the first book on the page ("A Light in the Attic").
    *   The Elements panel will automatically highlight the HTML code for that price.
    *   **Question:** What is the HTML tag used for the price (e.g., `<div>`, `<p>`, `<span>`)? What is the `class` attribute of that tag?
5.  **Record your answers:** Write down the answers to the two questions above.

**Expected Outcome:**
A short document with the correct answers for the page title, the HTML tag of the price element, and its class.

**Validation:**
- Did you correctly identify the content of the `<title>` tag?
- Did you correctly identify the tag and class for the book's price?

---

### Exercise 2: Understanding CSS Styling (Intermediate)

**Learning Objective:** To use developer tools to see how CSS is used to style a webpage and to dynamically change styles.

**Prerequisites:**
- Completion of Exercise 1.
- Basic understanding of what CSS is.

**Instructions:**

1.  **Inspect the "Add to basket" button:**
    *   On the [http://books.toscrape.com/](http://books.toscrape.com/) website, use the element selector to inspect the "Add to basket" button of the first book.
2.  **Analyze its styles:**
    *   With the button's HTML highlighted in the Elements panel, look at the "Styles" (or "Rules") panel, which is usually to the right. This panel shows all the CSS rules applied to the selected element.
    *   Find the `background-color` property for the button.
    *   **Question 1:** What is the color code (e.g., hex code or `rgb` value) for the button's background?
3.  **Change a style dynamically:**
    *   In the Styles panel, find the `background-color` property you just identified.
    *   Click on the color value. A color picker should appear.
    *   Change the background color of the button to something different (e.g., red, `#FF0000`). Observe the change live on the webpage. (Note: This change is temporary and will be gone if you refresh the page).
    *   Now, find the `font-size` property or add it if it's not there. Change the font size to `20px`.
    *   **Question 2:** Describe the changes you were able to make to the button's appearance using the Styles panel.

**Expected Outcome:**
A document with the correct background color code and a description of the style changes you successfully applied to the button.

**Validation:**
- Did you correctly identify the `background-color` from the Styles panel?
- Were you able to successfully modify the button's styles in the browser?

---

### Exercise 3: Finding JavaScript in Action (Advanced/Challenge)

**Learning Objective:** To identify where JavaScript is being used on a webpage and understand its role.

**Prerequisites:**
- Completion of the previous exercises.
- Basic understanding that JavaScript is used for interactivity.

**Instructions:**

1.  **Look for interactivity:** The star rating system on `books.toscrape.com` is static (just for display). Let's find some real interactivity on a different site. Navigate to [https://www.google.com](https://www.google.com).
2.  **Analyze the search bar:**
    *   Open the developer tools (F12).
    *   Go to the "Network" tab. This tab shows all the requests the browser makes.
    *   Click the "XHR/Fetch" filter. This will show you requests that are typically made by JavaScript after the page has loaded.
    *   Go to the Google search bar and start typing a search query (e.g., "Playwright testing").
3.  **Observe the Network tab:**
    *   As you type, you should see new items appearing in the Network tab. These are JavaScript-driven API requests being sent to Google's servers to get search suggestions.
    *   Click on one of these new requests in the Network tab.
    *   Look at the "Headers" and "Response" or "Preview" tabs for that request.
    *   **Question 1:** What is the "Request URL" that your browser is sending these requests to?
    *   **Question 2:** Look at the "Response" or "Preview". Can you see the search suggestions you saw on the screen reflected in the data that came back? Briefly describe what you see.

**Expected Outcome:**
A document that identifies the Request URL for Google's search suggestions and briefly describes how the text you typed is related to the data returned in the response. This demonstrates an understanding of how JavaScript fetches data dynamically to create an interactive user experience.

**Validation:**
- Did you correctly identify that JavaScript was making network requests as you typed?
- Were you able to find the URL for the suggestion service?
- Did you connect the response data to the suggestions shown in the UI?