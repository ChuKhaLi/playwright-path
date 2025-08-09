# Lesson 23: API Documentation and Testing Tools

## Learning Objectives

By the end of this lesson, you will be able to:
-   Understand the importance of API documentation for testing.
-   Recognize the structure of Swagger/OpenAPI documentation.
-   Identify key information from API documentation needed for testing (endpoints, methods, parameters, responses).
-   Name popular GUI-based tools for manual API testing (e.g., Postman, Insomnia).
-   Understand the role of libraries like Playwright's API testing module for automating API tests.

## Introduction

To test an API effectively, you can't just guess how it works. You need a map, and that map is the **API documentation**. Good documentation tells you everything you need to know to interact with the API correctly. Once you understand the API, you can use specialized tools to send requests and validate responses, both manually and through automation.

## 1. Understanding API Documentation

API documentation is the single source of truth for how an API behaves. It's a contract between the server and the client. As a tester, it's your primary reference.

### The OpenAPI Specification (Formerly Swagger)
The most common standard for documenting REST APIs is the **OpenAPI Specification**. A UI that presents this documentation in an interactive way is often called **Swagger UI**.

When you look at Swagger/OpenAPI documentation, you will find:

-   **Endpoints (Paths):** The list of available URIs (e.g., `/users`, `/users/{id}`).
-   **HTTP Methods:** The allowed actions for each endpoint (e.g., `GET`, `POST`, `DELETE`).
-   **Parameters:** The data you can send with a request. This includes:
    -   **Path Parameters:** (e.g., the `{id}` in `/users/{id}`).
    -   **Query Parameters:** (e.g., `?status=active` in `/users?status=active`).
    -   **Request Body:** The JSON object sent with `POST`, `PUT`, or `PATCH` requests, including the required fields and their data types.
-   **Responses:** The possible responses the server can send back for each endpoint. This includes:
    -   **Status Codes:** (e.g., `200 OK`, `404 Not Found`).
    -   **Response Body:** An example of the JSON data the server will return for each status code.
-   **Authentication:** Information on how to authenticate with the API (e.g., what kind of API key or token is needed).

As a tester, your job is to verify that the API behaves *exactly* as the documentation claims.

## 2. GUI-Based API Testing Tools

Before you automate API tests, it's incredibly useful to explore and test them manually. GUI (Graphical User Interface) tools make this easy.

### Postman
**Postman** is the most popular and powerful tool for API testing. It allows you to:
-   Create and send any type of HTTP request (`GET`, `POST`, etc.).
-   Easily manage headers and authentication.
-   Organize requests into "collections" to group related endpoints.
-   Use "environments" to manage variables (e.g., base URLs, API keys) for different test environments (like staging vs. production).
-   Write simple JavaScript tests to assert that the response is correct (e.g., `pm.test("Status code is 200", function () { pm.response.to.have.status(200); });`).

### Insomnia
**Insomnia** is a strong competitor to Postman. It has a cleaner, more minimalist interface and is praised for its ease of use. Its core functionality is very similar to Postman's.

**Why use these tools?**
-   **Speed:** Quickly test an endpoint without writing any code.
-   **Isolation:** Test the backend API in isolation from the frontend UI.
-   **Debugging:** Easily inspect the full request and response, including headers and body, to debug issues.
-   **Collaboration:** Share collections of requests with developers and other testers.

## 3. Automating API Tests in Code

While GUI tools are great for exploration, the ultimate goal is to automate your API tests so they can run as part of your CI/CD pipeline.

### Playwright for API Testing
You've been learning about Playwright for browser automation, but it also has a powerful built-in module for API testing.

**Key Features:**
-   **`request` object:** Playwright provides a `request` object that can be used to make HTTP requests.
-   **Shared Context:** You can make an API call to log in and get an auth token, and then use that same token to visit a webpage in the browser, all within the same test file. This is incredibly powerful for E2E testing.
-   **Assertions:** You can use Playwright's standard `expect` library to make assertions about the API response.

**Simple Example using Playwright:**

```typescript
import { test, expect } from '@playwright/test';

test('should get a specific user from the API', async ({ request }) => {
  // Send a GET request to the API endpoint
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

  // Assert that the response was successful (status code 200-299)
  expect(response.ok()).toBeTruthy();

  // Parse the JSON response body
  const responseBody = await response.json();

  // Assert that the response body contains the correct data
  expect(responseBody.id).toBe(1);
  expect(responseBody.name).toBe('Leanne Graham');
  expect(responseBody.email).toBe('Sincere@april.biz');
});
```

This code does programmatically what you would do manually in Postman. It sends a request, checks the status, and validates the content of the response body.

## Summary

API documentation is your guide, GUI tools like Postman are your manual testing workbench, and libraries like Playwright's `request` object are your tools for automation. A comprehensive testing strategy uses all three. You read the documentation to understand what to test, use Postman to explore and quickly verify behavior, and then write robust, automated tests in code to ensure the API remains stable and correct over time.