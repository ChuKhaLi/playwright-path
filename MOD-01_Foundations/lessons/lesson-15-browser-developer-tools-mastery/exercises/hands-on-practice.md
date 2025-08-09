# Lesson 15: Browser Developer Tools - Hands-On Practice

## Objective

This exercise will guide you through using the browser's developer tools to inspect elements, test selectors, monitor network activity, and check application storage. These are fundamental skills for any web automation engineer.

## Setup

1.  **Open the Practice Page:**
    Save the following HTML as `devtools-practice.html` and open it in your local browser.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>DevTools Practice</title>
        <style>
            body { font-family: sans-serif; max-width: 800px; margin: auto; padding: 20px; }
            .hidden { display: none; }
            .error { color: red; border: 1px solid red; padding: 10px; }
            #login-form { margin-top: 20px; }
        </style>
    </head>
    <body>
        <h1>Login Page</h1>
        <form id="login-form">
            <div>
                <label for="username">Username</label>
                <input type="text" id="username" name="user_name">
            </div>
            <br>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="user_pass">
            </div>
            <br>
            <button type="button" onclick="login()">Log In</button>
        </form>
        <div id="error-message" class="error hidden">
            Invalid credentials. Please try again.
        </div>
        <div id="success-message" class="hidden" style="color: green; border: 1px solid green; padding: 10px;">
            Welcome, user!
        </div>

        <script>
            function login() {
                // Simulate a network request
                console.log('Login function called.');
                fetch('https://jsonplaceholder.typicode.com/posts/1')
                    .then(response => response.json())
                    .then(json => {
                        console.log('API Response:', json);
                        const user = document.getElementById('username').value;
                        if (user === 'testuser') {
                            document.getElementById('success-message').classList.remove('hidden');
                            document.getElementById('error-message').classList.add('hidden');
                            localStorage.setItem('isLoggedIn', 'true');
                            sessionStorage.setItem('sessionStart', Date.now());
                            document.cookie = "session_id=xyz123; path=/";
                        } else {
                            document.getElementById('error-message').classList.remove('hidden');
                            document.getElementById('success-message').classList.add('hidden');
                        }
                    });
            }
        </script>
    </body>
    </html>
    ```

2.  **Open Developer Tools:**
    Right-click the page and select "Inspect" or press F12.

## Tasks

Follow these steps to practice using the DevTools.

### Task 1: Elements Panel

1.  **Inspect the "Username" input field.** What is its `id` and `name`?
2.  **Find a unique CSS selector** for the "Log In" button. Test it using the search bar (`Ctrl+F` or `Cmd+F`) in the Elements panel.
3.  **Manually trigger the error message.** In the Elements panel, find the `div` with the `id="error-message"`. Remove the `hidden` class from its class list. Does the error message appear on the page?
4.  **Change the button text.** Find the "Log In" button in the Elements panel and change its text to "Sign In".

### Task 2: Console Panel

1.  **Look for log messages.** Click the "Log In" button. Do you see the "Login function called" message in the Console?
2.  **Execute JavaScript.** In the console, type `document.getElementById('username').value = 'testuser';` and press Enter. Did it fill the username field?
3.  **Check for errors.** Leave the username blank and click "Log In". Are there any red error messages in the console? (There shouldn't be for this example, but it's good practice to check).

### Task 3: Network Panel

1.  **Monitor a request.** Go to the Network panel and make sure you are recording. You might want to filter by "Fetch/XHR".
2.  Click the "Log In" button on the page.
3.  A request to `jsonplaceholder.typicode.com` should appear. Click on it.
4.  **Inspect the request.** What was the **Request Method**? What was the **Status Code**?
5.  Click on the **Response** tab. What data did the server send back?

### Task 4: Application Panel

1.  **Trigger storage changes.** Enter "testuser" as the username and click "Log In".
2.  Go to the Application panel.
3.  Under **Storage**, expand **Local Storage** and click on the entry for your file. Do you see a key named `isLoggedIn` with a value of `true`?
4.  Now check **Session Storage**. What key and value do you see?
5.  Finally, check **Cookies**. Do you see a `session_id` cookie?

This exercise covers the core workflow of using DevTools to understand and debug a web application, which is essential before and during the process of writing automated tests.