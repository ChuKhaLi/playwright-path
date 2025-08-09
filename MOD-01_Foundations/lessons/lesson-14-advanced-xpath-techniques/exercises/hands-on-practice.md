# Lesson 14: Advanced XPath Techniques - Hands-On Practice

## Objective

This exercise will challenge you to apply advanced XPath techniques to locate complex and dynamic elements on a sample web page. You will practice using complex predicates, advanced functions, and relative selection with axes.

## Setup

1.  **Open the Practice Page:**
    Save the following HTML as `advanced-xpath-practice.html` and open it in your browser.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Advanced XPath Practice</title>
        <style>
            body { font-family: Arial, sans-serif; }
            .product-grid { display: flex; flex-wrap: wrap; gap: 20px; }
            .product-card { border: 1px solid #ccc; padding: 15px; width: 200px; }
            .product-card.featured { border-color: #007bff; }
            .status { font-weight: bold; }
            .status.active { color: green; }
            .status.pending { color: orange; }
        </style>
    </head>
    <body>
        <h1>Dynamic Product Dashboard</h1>

        <div id="user-table">
            <h2>User List</h2>
            <table>
                <thead>
                    <tr><th>Username</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>user_one</td>
                        <td><span class="status active">Active</span></td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                    <tr>
                        <td>user_two</td>
                        <td><span class="status pending">Pending</span></td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                    <tr>
                        <td>user_three</td>
                        <td><span class="status active">Active</span></td>
                        <td><a href="#">Edit</a></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="product-section">
            <h2>Products</h2>
            <div class="product-grid">
                <div id="prod-101" class="product-card featured">
                    <h3>Laptop Pro</h3>
                    <p>Price: $1200</p>
                    <button>Buy Now</button>
                </div>
                <div id="prod-102" class="product-card">
                    <h3>Mouse Pad</h3>
                    <p>Price: $15</p>
                    <button>Buy Now</button>
                </div>
                <div id="prod-103" class="product-card featured">
                    <h3>Webcam HD</h3>
                    <p>Price: $80</p>
                    <button disabled>Out of Stock</button>
                </div>
            </div>
        </div>
    </body>
    </html>
    ```

2.  **Open Developer Tools:**
    Use your browser's developer tools (`Ctrl+F` or `Cmd+F` in the Elements panel) to test your XPath expressions.

## Tasks

Write a single XPath expression for each task.

1.  **Select the "Edit" link for the user with the username "user_two".**
    *Hint: Find the `td` with the username, then navigate to the correct link.*

2.  **Select all `product-card` divs that are "featured" AND contain a button that is NOT disabled.**
    *Hint: You'll need to chain predicates with `and` and `not()`.*

3.  **Select the `span` element with the status "Active" for the user "user_three".**
    *Hint: Find the row containing "user_three" first.*

4.  **Select the `h3` element for the product whose `id` starts with "prod-" and is a featured product.**
    *Hint: Use `starts-with()` and check for the `featured` class.*

5.  **Select all `product-card` divs that are NOT featured.**
    *Hint: Use `not()` with `contains()` on the class attribute.*

6.  **Select the price `<p>` tag for the "Webcam HD".**
    *Hint: Find the `h3` with the product name, then find the sibling `<p>`.*

## Solutions

<details>
<summary>Click to view solutions</summary>

1.  `//td[text()='user_two']/following-sibling::td/a[text()='Edit']`
2.  `//div[contains(@class, 'product-card') and contains(@class, 'featured') and .//button[not(@disabled)]]`
3.  `//tr[td[text()='user_three']]//span[contains(@class, 'active')]`
4.  `//div[starts-with(@id, 'prod-') and contains(@class, 'featured')]/h3`
5.  `//div[contains(@class, 'product-card') and not(contains(@class, 'featured'))]`
6.  `//h3[text()='Webcam HD']/following-sibling::p`

</details>