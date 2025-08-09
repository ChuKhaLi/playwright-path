# Lesson 19: Web Application Architecture - Hands-On Practice

## Objective

This exercise is a thought experiment designed to help you apply your understanding of web application architecture to a practical testing scenario. You will analyze a simple application and map its features to architectural components.

## Setup

**The Application:** Imagine a simple "To-Do List" web application with the following features:
1.  A user can see a list of their to-do items when the page loads.
2.  A user can type a new to-do item into a text box and click "Add".
3.  The new item appears in the list without the page reloading.
4.  A user can click a "Complete" button next to an item, which strikes through the text of that item.

**The Architecture:** This application uses a standard architecture:
-   **Frontend:** A JavaScript application running in your browser.
-   **Backend:** A single server (a monolith) that handles all logic.
-   **API:** The frontend and backend communicate via a REST API.
-   **Database:** A database stores the to-do items.

## Tasks

For each feature, answer the following questions.

---

### Feature 1: Viewing the To-Do List on Page Load

1.  **Client Action:** The page loads.
2.  **Architectural Flow:** Describe the journey of this request. What does the client do? What API call might it make? What does the server do? What does the database do?
3.  **Key Testing Point:** If the list doesn't load, where is the *most likely* point of failure? (e.g., frontend rendering, API call, server logic, database query).
4.  **Testing Strategy:** How could you use browser DevTools to determine if the problem is on the frontend or the backend?

---

### Feature 2: Adding a New To-Do Item

1.  **Client Action:** The user types "Buy milk" and clicks "Add".
2.  **Architectural Flow:** Describe the journey. What information does the client send to the server in the API request? What does the server do with this information? What happens in the database? What does the server send back to the client?
3.  **Key Testing Point:** If the new item doesn't appear in the list, what are two different places the bug could be? (e.g., one frontend possibility, one backend possibility).
4.  **Testing Strategy:** You would write a UI test for this with Playwright. What is one API test you could also write to test the backend logic more directly?

---

### Feature 3: Marking an Item as Complete

1.  **Client Action:** The user clicks the "Complete" button next to "Buy milk".
2.  **Architectural Flow:** Describe the journey. How does the server know *which* item to mark as complete? What information must be sent in the API call? How does the database record this change?
3.  **Key Testing Point:** If the item is still marked as complete after you refresh the page, but it wasn't struck through initially, where is the bug most likely located?
4.  **Testing Strategy:** Besides checking that the text has a line-through, what is another way you could verify in a test that the item was successfully marked as complete? (Hint: Think about what might change in the DOM).

## Solutions

<details>
<summary>Click to view solutions</summary>

### Feature 1: Viewing the To-Do List

2.  **Flow:** Client loads -> Client JS sends a `GET /api/todos` request -> Server receives request -> Server queries database for all to-do items -> Database returns items -> Server formats items into JSON and sends response -> Client receives JSON and renders the HTML list.
3.  **Likely Failure:** The initial `GET` request to the API.
4.  **Strategy:** Open the Network tab in DevTools. If the `GET /api/todos` call has a red status (like 500) or never returns data, the bug is on the backend. If the call returns the correct JSON data but it doesn't appear on the page, the bug is in the frontend rendering logic.

### Feature 2: Adding a New To-Do Item

2.  **Flow:** Client sends `POST /api/todos` with a JSON payload like `{"task": "Buy milk"}` -> Server receives request -> Server validates the data -> Server inserts the new task into the database -> Database confirms insertion -> Server sends back a success response, often with the newly created item including its ID, e.g., `{"id": 123, "task": "Buy milk", "completed": false}` -> Client JS receives the response and adds the new item to the list in the DOM.
3.  **Possible Bugs:**
    -   **Frontend:** The "Add" button's click handler is broken and never sends the API request.
    -   **Backend:** The server fails to save the item to the database and returns an error.
4.  **API Test:** Send a `POST` request directly to `/api/todos` with a valid payload. Assert that the HTTP response status is `201 Created` and that the response body contains the item you sent.

### Feature 3: Marking an Item as Complete

2.  **Flow:** The client must send the unique ID of the item. The API call might be `PUT /api/todos/123` with a payload of `{"completed": true}`. The server receives this, finds the item with ID 123 in the database, and updates its `completed` status. It then sends a success response back to the client.
3.  **Likely Location:** The frontend JavaScript. The backend successfully updated the data (proven by the refresh), but the client-side code failed to update the UI immediately after the API call returned.
4.  **Other Verification:** You could check that the "Complete" button becomes disabled or hidden, or that a class like `class="completed-item"` is added to the list item's element, which the CSS then uses to apply the line-through style.

</details>