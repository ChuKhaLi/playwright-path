# Lesson 24: Module Recap and Next Steps - Hands-On Practice

## Objective

This final exercise for Module 1 is a capstone review. It will prompt you to connect the concepts you've learned—from testing fundamentals and web technologies to API principles and practical tool usage—by outlining a test plan for a simple feature.

## The Scenario: A "Contact Us" Form

Imagine you are the sole QA engineer responsible for testing a new "Contact Us" form on a website.

**The form has the following fields:**
-   Your Name (text input, required)
-   Your Email (email input, required, must be a valid email format)
-   Message (textarea, required, must be at least 10 characters)
-   A "Submit" button.

**How it works (according to the developer):**
-   When a user clicks "Submit", the frontend performs basic validation (checks for empty required fields).
-   If frontend validation passes, it sends a `POST` request to the `/api/contact` endpoint.
-   The backend API performs its own validation.
-   If backend validation passes, the server saves the message to a database and returns a `201 Created` status with the body `{"status": "success", "messageId": "some-unique-id"}`.
-   Upon receiving a successful response, the frontend hides the form and displays a "Thank you for your message!" confirmation.

---

## Your Task: Create a High-Level Test Plan

You don't need to write any code. Instead, for each section below, write a few bullet points outlining what you would test and what tools or concepts you would use.

### 1. UI/E2E Test Cases (Using Playwright)

*What are the key user scenarios you would automate with Playwright?*

-   **Happy Path:**
    -   (e.g., Fill out all fields with valid data, click submit, and assert that the "Thank you" message is visible.)
-   **Frontend Validation:**
    -   (e.g., Try to submit with the "Your Name" field empty and assert that an error message appears next to the field.)
    -   (e.g., ...)
-   **Edge Cases:**
    -   (e.g., Enter a message that is exactly 10 characters long.)
    -   (e.g., ...)

### 2. API Test Cases (Using Postman or Playwright's `request` object)

*How would you test the `/api/contact` endpoint directly, without using the UI?*

-   **Happy Path:**
    -   (e.g., Send a `POST` request with a valid JSON body. Assert the status code is `201` and the response body contains a `messageId`.)
-   **Backend Validation (Bad Requests):**
    -   (e.g., Send a request with a missing `email` field. Assert the status code is `400 Bad Request`.)
    -   (e.g., Send a request with an invalid email format. Assert the status code is `400`.)
    -   (e.g., ...)

### 3. Connecting Concepts

*Answer these short questions to connect what you've learned.*

1.  **DevTools:** If a UI test fails because the "Thank you" message doesn't appear, how would you use the **Network** tab in your browser's DevTools to determine if it's a frontend or backend bug?
2.  **HTML/Selectors:** To fill in the "Your Email" field, you need a selector. If the input field's HTML is `<input type="email" name="customer_email" id="contact-email">`, what would be a good, robust **CSS selector** to use?
3.  **Architecture:** Is the process described (frontend validation, API call, backend validation, database save) more indicative of a **Monolithic** or **Microservices** architecture? Why?

## Example Solutions

<details>
<summary>Click to view solutions</summary>

### 1. UI/E2E Test Cases
-   **Happy Path:**
    -   Fill out all fields with valid data, click submit, and assert that the "Thank you" message is visible.
-   **Frontend Validation:**
    -   Try to submit with the "Your Name" field empty and assert that an error message appears.
    -   Try to submit with an invalid email format (e.g., "test@test") and assert an error message appears.
    -   Try to submit with a message that is only 9 characters long and assert an error message appears.
-   **Edge Cases:**
    -   Enter a message that is exactly 10 characters long.
    -   Enter a very long message to test character limits.
    -   Test submitting the form by pressing "Enter" in the last field instead of clicking the button.

### 2. API Test Cases
-   **Happy Path:**
    -   Send a `POST` request to `/api/contact` with a valid JSON body. Assert the status code is `201` and the response body contains a `messageId`.
-   **Backend Validation (Bad Requests):**
    -   Send a request with a missing `email` field. Assert the status code is `400 Bad Request`.
    -   Send a request with an invalid email format. Assert the status code is `400`.
    -   Send a request where the `message` is less than 10 characters. Assert the status code is `400`.
    -   Send a request using the `GET` method instead of `POST`. Assert the status code is `405 Method Not Allowed`.

### 3. Connecting Concepts
1.  **DevTools:** I would check the `/api/contact` request in the Network tab. If the request shows a success status (like `201`), the backend worked correctly, and the bug is in the frontend JavaScript that was supposed to show the message. If the request shows an error status (like `500`), the bug is on the backend.
2.  **Selector:** `#contact-email` would be the best selector because IDs are meant to be unique and are less likely to change than class names or other attributes.
3.  **Architecture:** It could be either, but as described, it fits a **Monolithic** architecture well because a single `/api/contact` endpoint appears to handle all the logic. In a microservices world, it might call a separate "Notification Service" or "Message Storage Service", but from the outside, the initial interaction is with a single API.

</details>