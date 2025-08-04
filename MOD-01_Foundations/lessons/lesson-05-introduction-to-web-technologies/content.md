# Lesson 5: Introduction to Web Technologies

## Learning Objectives

- Describe the roles of HTML, CSS, and JavaScript in a web page.
- Understand the concept of the Document Object Model (DOM).
- Explain the client-server model of the web.
- Differentiate between a static and a dynamic website.
- Recognize why this knowledge is essential for test automation.

---

## 1. The Big Three: HTML, CSS, and JavaScript

Every modern website you visit is built using a combination of three core technologies. A great way to understand their roles is to use a house analogy.

- **HTML (HyperText Markup Language):** This is the **structure** of the house. It defines the essential components: the foundation, walls, roof, doors, and windows.
- **CSS (Cascading Style Sheets):** This is the **presentation** or style of the house. It's the paint color, the type of windows, the style of the front door, and the furniture inside.
- **JavaScript (JS):** This is the **interactivity** or functionality of the house. It's the electricity that makes the lights turn on, the plumbing that makes the faucets work, and the garage door opener.

As a test automation engineer, you will interact with all three of these layers. You will use HTML to find elements, you might check CSS to verify styling, and you will trigger JavaScript to test functionality.

## 2. HTML: The Structure of the Web

HTML is the standard markup language for creating web pages. It describes the structure of a web page using **elements** which are represented by **tags**.

For example, a simple paragraph is created with a `<p>` tag:
```html
<p>This is a paragraph.</p>
```

A heading is created with an `<h1>` tag:
```html
<h1>This is a main heading</h1>
```

HTML elements are the building blocks of a webpage. Your automation scripts will need to find these elements (like buttons, input fields, and links) to interact with them.

## 3. CSS: The Style of the Web

CSS is used to control the presentation, formatting, and layout of web pages. It tells the browser how to display the HTML elements.

For example, you could use CSS to make all paragraphs red and have a specific font:
```css
p {
  color: red;
  font-family: Arial, sans-serif;
}
```

While you won't write much CSS, you will use **CSS Selectors** extensively to find elements on a page for your tests. A selector is the part before the curly braces (`p` in the example above).

## 4. JavaScript: The Interactivity of the Web

JavaScript is a programming language that allows you to implement complex features on web pages. If a website does anything more than just display static information for you to look at—if it has interactive maps, animated graphics, or content that updates automatically—it's probably using JavaScript.

When you click a button and a pop-up appears, that's JavaScript. When you submit a form and see a "Success!" message without the page reloading, that's JavaScript.

Your test automation scripts will often trigger these JavaScript events and then verify that the application responds correctly.

## 5. The Document Object Model (DOM)

This is a critical concept for web automation. When a web page is loaded, the browser creates a **Document Object Model (DOM)** of the page.

The DOM is a tree-like structure of the HTML. Each HTML tag becomes a **node** in the tree.

*Analogy:* Think of the DOM as a family tree for the webpage. The `<html>` tag is the great-grandparent, and all other elements (like `<head>` and `<body>`) are its descendants.

**Why is this important?** Your test automation tool (Playwright) doesn't "see" the page like a human does. It interacts with the DOM. To click a button, your script tells Playwright to find the "button" node in the DOM tree and then trigger a "click" event on it. Understanding this helps you understand how your tools work under the hood.

## 6. How it All Works Together: The Client-Server Model

The web operates on a **client-server model**.

- **Client:** This is your web browser (e.g., Chrome, Firefox). It **requests** information.
- **Server:** This is a powerful computer somewhere in the world that **stores** the website's files (HTML, CSS, JS). It **responds** to requests.

Here's the flow:
1. You type a website address (e.g., `www.google.com`) into your browser (the client).
2. The browser sends a request over the internet to the Google server.
3. The Google server finds the necessary HTML, CSS, and JS files.
4. The server sends these files back to your browser.
5. Your browser receives the files, reads them, and renders the visual webpage on your screen.

This process also helps us understand the difference between:

- **Static Websites:** The content is fixed and doesn't change. The server just sends the same HTML file to every user.
- **Dynamic Websites:** The content can change based on user input, time of day, or other factors. The server might run some code to generate a custom HTML page just for you before sending it. Most modern web applications are dynamic.