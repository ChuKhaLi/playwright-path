# Lesson 20: HTTP Protocol Fundamentals - Hands-On Practice

## Objective

This exercise will use your browser's developer tools to observe and analyze real HTTP requests and responses. This will solidify your understanding of HTTP methods, status codes, and headers in a practical context.

## Setup

You will be using a live public API testing website called **JSONPlaceholder** (https://jsonplaceholder.typicode.com/). It's a fake online REST API for testing and prototyping.

-   **Open your browser** and keep this instructions page open.
-   **Open a new tab** for the practice tasks.
-   **Open the Developer Tools** (F12 or Ctrl+Shift+I) and go to the **Network** tab.

## Tasks

For each task, perform the action and then analyze the results in the Network tab.

---

### Task 1: Analyzing a `GET` Request

1.  In your new browser tab, navigate to: **https://jsonplaceholder.typicode.com/posts/1**
2.  In the DevTools Network tab, you should see a request for a resource named `1`. Click on it.
3.  **Answer these questions:**
    -   **General:** What was the Request URL? What was the Request Method? What was the Status Code?
    -   **Response Headers:** What is the `content-type` of the response?
    -   **Response Body:** What is the `title` of the post that was returned?

---

### Task 2: Analyzing a `POST` Request (Simulated)

We will use the DevTools Console to simulate sending data to create a new post.

1.  Go to the **Console** tab in DevTools.
2.  Copy and paste the following JavaScript code into the console and press Enter. This code sends a `POST` request.

    ```javascript
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'My Test Post',
        body: 'This is the body of my post.',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log('Server Response:', json));
    ```

3.  Now, switch back to the **Network** tab. Find the new `posts` request in the list. Click on it.
4.  **Answer these questions:**
    -   **General:** What was the Request Method? What was the Status Code? (It should be `201 Created`).
    -   **Request Headers:** Find the `Content-Type` header. What is its value?
    -   **Request Payload/Body:** Click on the "Payload" or "Request Body" tab. Does it show the `title` and `body` that you sent?
    -   **Console:** Go back to the console. What did the server send back as a response? (It should include the data you sent plus a new `id`).

---

### Task 3: Analyzing a `PUT` Request (Simulated)

Now we'll update the post we just "created".

1.  Go back to the **Console** tab.
2.  Copy and paste the following code and press Enter. This sends a `PUT` request to update post #1.

    ```javascript
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      body: JSON.stringify({
        id: 1,
        title: 'My Updated Title',
        body: 'The body has been updated.',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log('Update Response:', json));
    ```

3.  Switch to the **Network** tab and find the new request to `posts/1`.
4.  **Answer these questions:**
    -   **General:** What was the Request Method? What was the Status Code?
    -   **Request Payload/Body:** Verify that the payload contains the updated title.
    -   **Console:** What does the response in the console show?

---

### Task 4: Analyzing a `DELETE` Request (Simulated)

Finally, let's delete a post.

1.  Go to the **Console** tab.
2.  Copy and paste the following code and press Enter.

    ```javascript
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE',
    });
    ```

3.  Switch to the **Network** tab and find the final request to `posts/1`.
4.  **Answer these questions:**
    -   **General:** What was the Request Method? What was the Status Code?
    -   **Response Body:** Is there any content in the response body? Why or why not? (Hint: think about the meaning of the status code).

---

### Task 5: Triggering a `404 Not Found`

1.  In your browser's address bar, try to navigate to a post that doesn't exist: **https://jsonplaceholder.typicode.com/posts/9999**
2.  Look at the request in the Network tab.
3.  **Answer this question:**
    -   What was the Status Code returned by the server?