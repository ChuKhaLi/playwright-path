# Lesson 9: Hands-on Practice - API Testing

## Objective

To use Playwright's API testing capabilities to interact with a public API and to combine API and UI testing in a practical scenario.

## Scenario

You will be using the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/), a fake online REST API for testing and prototyping.

## Instructions

### Part 1: Pure API Test - CRUD Operations

1.  **Create a new test file:** `tests/specs/api/posts.api.spec.ts`.
    -   *Note:* Using a `.api.spec.ts` suffix is a good convention to separate pure API tests from UI tests.

2.  **Test 1: GET all posts**
    -   Write a test that sends a `GET` request to `/posts`.
    -   Assert that the status code is `200`.
    -   Assert that the response body is an array.
    -   Assert that the array contains 100 posts.

3.  **Test 2: GET a single post**
    -   Write a test that sends a `GET` request to `/posts/1`.
    -   Assert that the status code is `200`.
    -   Assert that the response body is an object containing an `id` of `1`.

4.  **Test 3: CREATE a new post**
    -   Write a test that sends a `POST` request to `/posts`.
    -   Include a `data` payload with `title`, `body`, and `userId`.
    -   Assert that the status code is `201` (Created).
    -   Assert that the response body contains the same `title` you sent.

5.  **Test 4: UPDATE a post**
    -   Write a test that sends a `PUT` request to `/posts/1`.
    -   Include a `data` payload to update the post.
    -   Assert that the status code is `200`.
    -   Assert that the response body contains the updated data.

6.  **Test 5: DELETE a post**
    -   Write a test that sends a `DELETE` request to `/posts/1`.
    -   Assert that the status code is `200`.

### Part 2: Combined API + UI Test

For this part, you'll need a simple `index.html` file to act as your UI.

1.  **Create a local HTML file:** Create a file named `posts.html` in the root of your project.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Posts</title>
    </head>
    <body>
        <h1>My Blog Posts</h1>
        <ul id="posts-list">
            <!-- Posts will be loaded here by JavaScript -->
        </ul>
        <script>
            // Simple script to fetch and display posts
            fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
                .then(response => response.json())
                .then(posts => {
                    const list = document.getElementById('posts-list');
                    posts.forEach(post => {
                        const listItem = document.createElement('li');
                        listItem.textContent = post.title;
                        listItem.id = `post-${post.id}`;
                        list.appendChild(listItem);
                    });
                });
        </script>
    </body>
    </html>
    ```

2.  **Create a new test file:** `tests/specs/ui/posts.ui.spec.ts`.

3.  **Write the combined test:**
    -   The goal is to create a new post via the API and then verify it appears on our local webpage. *However*, since our local page only fetches posts for `userId=1`, we can't easily do this.
    -   Instead, we will do the reverse: **Verify that a post we see in the UI exists in the backend via an API call.**

4.  **Implement the test logic:**
    -   Write a test titled `'should verify a UI element exists in the backend'`.
    -   Navigate to your local `posts.html` file.
        -   *Hint:* `await page.goto('file://' + require('path').resolve('posts.html'));`
    -   Wait for the list to be populated. A good way is to wait for a specific post to be visible, e.g., `await expect(page.locator('#post-1')).toBeVisible();`.
    -   Get the text content of the first post (`#post-1`).
    -   Now, use the `request` fixture to make a `GET` request to `/posts/1`.
    -   Assert that the `title` from the API response matches the text content you extracted from the UI.

## Bonus Challenge

-   Create an "API Page Object" class. This class would not take a `page` object, but instead the `request` object. It would have methods like `getPost(id)` and `createPost(data)` that encapsulate the API logic, returning the response.
-   Use this new API Page Object in your tests to make them even cleaner.