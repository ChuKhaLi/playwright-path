# Assessment: Module Recap and Integration Testing

This final assessment covers the key concepts from the entire API Testing Fundamentals module.

---

## Question 1: Hybrid Testing (Multiple Choice)

What is the primary benefit of using an API call to set up state before a UI test?
A) It makes the test more realistic.
B) It's the only way to get data into the application.
C) It's significantly faster and more reliable than performing the setup through the UI.
D) It allows you to test the API and the UI at the same time.

---

## Question 2: The "UI -> API" Pattern (Multiple Choice)

In which scenario would the "UI for Action, API for Verification" pattern be most useful?
A) Testing that a user can log in.
B) Testing that a "Forgot Password" email was sent.
C) Testing that a product's image displays correctly.
D) Testing that submitting a complex form saves the correct data to the database.

---

## Question 3: Core Concepts (Matching)

Match the HTTP method with its primary CRUD (Create, Read, Update, Delete) operation.

| Method | Operation |
|---|---|
| 1. POST | A) Read |
| 2. GET | B) Update |
| 3. PUT | C) Delete |
| 4. DELETE | D) Create |

---

## Question 4: Status Codes (Short Answer)

What HTTP status code would you expect for each of the following successful operations?
1.  Creating a new resource.
2.  Deleting a resource.
3.  Reading a resource.

---

## Question 5: Authentication (Short Answer)

Briefly describe the "Login -> Get Token -> Use Token" pattern.

---

## Answer Key

### Question 1
**C) It's significantly faster and more reliable than performing the setup through the UI.**

### Question 2
**D) Testing that submitting a complex form saves the correct data to the database.** This pattern allows you to perform the UI action and then quickly and directly verify the backend state without further UI navigation.

### Question 3
1.  → D (Create)
2.  → A (Read)
3.  → B (Update)
4.  → C (Delete)

### Question 4
1.  **`201 Created`**
2.  **`204 No Content`**
3.  **`200 OK`**

### Question 5
You send a `POST` request with credentials to a login endpoint. The server responds with an authentication token. You then include that token in the `Authorization` header of all subsequent requests to protected resources.