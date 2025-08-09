# Lesson 13: XPath Fundamentals - Hands-On Practice

## Objective

This exercise is designed to give you practical experience in writing XPath selectors to locate elements on a web page. You will use a practice page to find various elements using the XPath techniques covered in the lesson.

## Setup

1.  **Open the Practice Page:**
    You can use the following HTML file for your practice. Save it as `xpath-practice.html` and open it in your browser.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>XPath Practice Page</title>
        <style>
            body { font-family: sans-serif; }
            .container { width: 80%; margin: auto; }
            .header { background-color: #f0f0f0; padding: 10px; text-align: center; }
            .login-form { border: 1px solid #ccc; padding: 20px; margin-top: 20px; }
            .product-list { list-style: none; padding: 0; }
            .product-item { border-bottom: 1px solid #eee; padding: 10px; }
            .product-item span { font-weight: bold; }
            .error { color: red; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 id="main-title">Welcome to Our Store</h1>
            </div>

            <div id="login-section" class="login-form">
                <h2>User Login</h2>
                <form>
                    <div>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username">
                    </div>
                    <div>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">
                        <span class="error" style="display: none;">Invalid password</span>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>

            <div id="products">
                <h2>Our Products</h2>
                <ul class="product-list">
                    <li class="product-item">
                        <span>Laptop</span> - <span>$999</span>
                        <button>Add to Cart</button>
                    </li>
                    <li class="product-item">
                        <span>Mouse</span> - <span>$25</span>
                        <button>Add to Cart</button>
                    </li>
                    <li class="product-item">
                        <span>Keyboard</span> - <span>$75</span>
                        <button class="disabled" disabled>Out of Stock</button>
                    </li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    ```

2.  **Open Developer Tools:**
    Right-click on the page and select "Inspect" or "Inspect Element" to open your browser's developer tools. You can test your XPath expressions in the "Elements" panel by using `Ctrl+F` (or `Cmd+F` on Mac) and typing your XPath.

## Tasks

For each of the following tasks, write an XPath expression that correctly selects the specified element(s).

### Task 1: Basic Selection

1.  Select the `<h1>` element with the id "main-title".
2.  Select all `<li>` elements that are product items.
3.  Select the "Login" button.

### Task 2: Using Axes

1.  Select the parent `<div>` of the `<h2>` element with the text "User Login".
2.  Select the `<input>` element that is a following sibling of the `<label>` with the text "Username:".
3.  Select all `<span>` elements that are descendants of the `<li>` element containing the text "Laptop".

### Task 3: Using Predicates and Functions

1.  Select the second `<li>` element in the product list.
2.  Select the `<button>` element that contains the text "Add to Cart".
3.  Select the `<span>` element with the class "error" that is currently hidden.
4.  Select the `<li>` element for the product "Keyboard" by finding the `<span>` with its name.
5.  Select only the buttons that are *not* disabled.

## Solutions

<details>
<summary>Click to view solutions</summary>

### Task 1: Basic Selection

1.  `//h1[@id='main-title']`
2.  `//li[@class='product-item']`
3.  `//button[text()='Login']`

### Task 2: Using Axes

1.  `//h2[text()='User Login']/parent::div`
2.  `//label[text()='Username:']/following-sibling::input`
3.  `//li[contains(., 'Laptop')]/descendant::span`

### Task 3: Using Predicates and Functions

1.  `//ul[@class='product-list']/li[2]` or `//li[@class='product-item'][position()=2]`
2.  `//button[contains(text(),'Add to Cart')]`
3.  `//span[@class='error' and @style='display: none;']`
4.  `//li[span[text()='Keyboard']]`
5.  `//button[not(@disabled)]`

</details>