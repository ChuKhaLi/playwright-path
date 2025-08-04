# Assessment: DELETE Requests and Cleanup

This assessment tests your understanding of how to delete resources and manage test data.

---

## Question 1: `DELETE` Request Status Code (Multiple Choice)

What is the most common and appropriate HTTP status code for a successful `DELETE` request that returns no data?
A) 200 OK
B) 202 Accepted
C) 204 No Content
D) 404 Not Found

---

## Question 2: Verifying Deletion (Multiple Choice)

What is the most reliable way to verify that a resource has been deleted?
A) Checking that the `DELETE` request returns a `204` status.
B) Checking the server logs for a deletion entry.
C) Making a subsequent `GET` request to the resource's endpoint and expecting a `404` status.
D) Making the same `DELETE` request a second time.

---

## Question 3: Test Cleanup (Short Answer)

Why is it important to clean up data created during your tests? Name two reasons.

---

## Question 4: Playwright Hooks (Short Answer)

Which Playwright test hook is most commonly used to perform cleanup actions after each test in a file?

---

## Question 5: Response Body (Fill in the Blank)

A `204 No Content` response means the response body will be ______.

---

## Answer Key

### Question 1
**C) 204 No Content**. This code signifies that the server successfully processed the request and there is no content to return.

### Question 2
**C) Making a subsequent `GET` request to the resource's endpoint and expecting a `404` status.** This confirms the resource is no longer accessible.

### Question 3
Any two of the following:
-   To prevent tests from interfering with each other.
-   To ensure tests are repeatable and reliable.
-   To keep the test environment clean and prevent it from filling with junk data.

### Question 4
The **`test.afterEach()`** hook.

### Question 5
A `204 No Content` response means the response body will be **empty**.