# Lesson 8: Basic HTML, CSS, & JavaScript for Testers - Hands-on Exercises

## Overview

These exercises will give you hands-on practice creating and modifying a simple webpage. You will work directly with HTML to structure content, CSS to style it, and a tiny bit of JavaScript to add interactivity. This is crucial for understanding the application structure you will be testing.

**Setup:**

1.  Create a new folder on your computer for this exercise.
2.  Inside that folder, create the three files provided: `login.html`, `style.css`, and `app.js`.
3.  You can open the `login.html` file in your web browser to see your changes live.

---

### Exercise 1: Building a Basic HTML Form (Basic)

**Learning Objective:** To practice writing HTML by creating a simple login form structure.

**Prerequisites:**
- A text editor (like VS Code, Sublime Text, or even Notepad).
- A web browser.

**Instructions:**

1.  **Open the `login.html` file.** It will have some basic boilerplate code.
2.  **Add form elements:** Inside the `<body>` tag, create a login form. Your form should include the following, in order:
    *   A heading (`<h1>`) that says "Login".
    *   A form element (`<form>`). All the following elements should be inside this tag.
    *   A label for the username input.
    *   A text input field for the username. Give it an `id` of "username".
    *   A label for the password input.
    *   A password input field. Give it an `id` of "password".
    *   A submit button that says "Log In".
3.  **Save and view:** Save the `login.html` file and open it in your browser. You should see your form.

**Starter Code (`login.html`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Your form code goes here -->
</body>
</html>
```

**Expected Outcome:**
A simple, unstyled webpage displaying a login form with username and password fields and a button.

---

### Exercise 2: Styling the Form with CSS (Intermediate)

**Learning Objective:** To apply basic CSS to make the login form visually appealing and to practice using selectors.

**Prerequisites:**
- Completion of Exercise 1.

**Instructions:**

1.  **Open the `style.css` file.** It will be empty.
2.  **Add CSS rules:** Write CSS rules to achieve the following:
    *   Center the entire form on the page.
    *   Give the form a light grey background color and some padding.
    *   Style the `<h1>` heading (e.g., change its color and center the text).
    *   Make the input fields take up the full width of the form.
    *   Style the button with a different background color, white text, and no border.
3.  **Link the stylesheet (if you haven't already):** Make sure your `login.html` file has the `<link rel="stylesheet" href="style.css">` tag in the `<head>` section.
4.  **Save and refresh:** Save both files and refresh the `login.html` page in your browser to see the styles applied.

**Starter Code (`style.css`):**
```css
/* Your CSS rules go here */
```

**Expected Outcome:**
Your login form should now be centered, have a background color, and have styled inputs and a button, making it look more like a real login page.

---

### Exercise 3: Adding Basic Interactivity with JavaScript (Advanced/Challenge)

**Learning Objective:** To use basic JavaScript to respond to a user action.

**Prerequisites:**
- Completion of the previous exercises.

**Instructions:**

1.  **Open the `app.js` file.**
2.  **Write the JavaScript code:** Your goal is to show an alert message when the user clicks the login button.
    *   Get a reference to the login form.
    *   Add an "event listener" to the form that listens for the "submit" event.
    *   When the form is submitted, prevent the default form submission behavior (which refreshes the page).
    *   Then, display an `alert()` message that says "Login button clicked!".
3.  **Link the script:** In your `login.html` file, add a `<script>` tag just before the closing `</body>` tag to link your `app.js` file. It should look like this: `<script src="app.js"></script>`.
4.  **Save and test:** Save all files and refresh the `login.html` page. When you click the "Log In" button, you should see the alert pop up.

**Starter Code (`app.js`):**
```javascript
// Your JavaScript code goes here
```

**Expected Outcome:**
When the "Log In" button is clicked, the page will not refresh, and an alert box will appear with the message "Login button clicked!".