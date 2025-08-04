# Lesson 2: Assessment

## Knowledge Check

1.  **Question:** What is "Design for Testability" in the context of APIs?
    -   a) A testing technique for designing APIs.
    -   b) The practice of designing APIs in a way that makes them easier to test, leading to more robust and reliable automation.
    -   c) A software tool that automatically designs tests for your API.
    -   d) A policy that states only developers can design APIs.

2.  **Question:** Which of the following is a key benefit of an idempotent API operation for testing?
    -   a) It runs faster.
    -   b) It makes test cleanup and retries safer because repeated calls don't have unintended side effects.
    -   c) It returns more data in the response.
    -   d) It is more secure.

3.  **Question:** You are testing an API and you receive the status code `403`. What does this most likely indicate?
    -   a) The request was successful.
    -   b) The server encountered an unexpected error.
    -   c) The requested resource was not found.
    -   d) You are authenticated, but you do not have permission to access the requested resource.

4.  **Question:** What is the purpose of a `correlation ID` (e.g., `X-Request-ID`) in a testable API?
    -   a) It's a unique identifier for the test case.
    -   b) It's a secret key for authentication.
    -   c) It allows tracing a single request across multiple services and logs, which is crucial for debugging in distributed systems.
    -   d) It tells the API which version of the resource to return.

## Practical Exercise

### Objective

Review a fictional API design specification and provide feedback to the development team on how to improve its testability.

### Scenario

Your team is building a new "Tasks" API. You have been given the following preliminary design document.

---

### **Tasks API Specification (Draft)**

**Base URL:** `/api/tasks`

**Endpoints:**

1.  **Create a new task**
    -   **Method:** `POST /`
    -   **Request Body:** `{ "title": "My new task" }`
    -   **Success Response:** `200 OK`, with the new task object.
    -   **Failure Response:** `500` with the string "Failed to create task".

2.  **Get a task**
    -   **Method:** `GET /:taskId`
    -   **Success Response:** `200 OK`, with the task object.
    -   **Failure Response:** If the task doesn't exist, the API returns an empty `200 OK` response.

3.  **Delete a task**
    -   **Method:** `DELETE /:taskId`
    -   **Note:** This endpoint is not idempotent. Calling it a second time on the same ID will cause a server error.
    -   **Success Response:** `200 OK`.

4.  **Update a task**
    -   **Method:** `POST /:taskId`
    -   **Request Body:** `{ "title": "My updated task" }`
    -   **Success Response:** `200 OK`, with the updated task object.

---

### Your Task

Write a brief review of this API design. Your review should be structured as a list of feedback points. For each point, you should:

1.  **Identify** a specific design choice in the specification that harms testability.
2.  **Explain** *why* it is a problem for testing.
3.  **Suggest** a specific, actionable improvement based on the principles learned in this lesson.

**Example Feedback Point Format:**

> **Endpoint:** Create a new task
> **Issue:** The success response uses a `200 OK` status code.
> **Problem for Testing:** While `200 OK` is a success code, the standard for resource creation is `201 Created`. Using the correct code makes our tests more precise and aligned with web standards.
> **Suggestion:** Change the success status code to `201 Created`.

### Expected Outcome

A document containing a list of feedback points that would help the development team improve the Tasks API design for testability. You should identify at least 4-5 distinct issues with the provided specification. This exercise simulates the real-world task of collaborating with a development team to improve API quality.