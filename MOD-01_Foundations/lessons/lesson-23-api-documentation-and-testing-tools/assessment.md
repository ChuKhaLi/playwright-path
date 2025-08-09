# Lesson 23: API Documentation and Tools - Assessment

## Multiple Choice Questions

1.  **What is the most common standard for documenting REST APIs, often visualized with Swagger UI?**
    a.  JSON Schema
    b.  WSDL
    c.  OpenAPI Specification
    d.  GraphQL Schema

2.  **In API documentation, what does the "endpoint" or "path" typically represent?**
    a.  The action to be performed.
    b.  The resource you are interacting with (e.g., `/users`).
    c.  The required authentication token.
    d.  The format of the response.

3.  **Which of the following is a primary benefit of using a GUI tool like Postman or Insomnia?**
    a.  It automatically generates a full regression suite.
    b.  It allows for quick, manual exploration and testing of an API without writing code.
    c.  It can only be used for `GET` requests.
    d.  It replaces the need for any automated testing.

4.  **When automating API tests with Playwright, what is the main object used to send HTTP requests?**
    a.  `page`
    b.  `browser`
    c.  `expect`
    d.  `request`

5.  **You need to test an API in both a "staging" and a "production" environment, which have different base URLs. What feature in Postman is designed to handle this?**
    a.  Collections
    b.  Environments
    c.  Monitors
    d.  History

## Short Answer Questions

1.  **List three key pieces of information you would look for in API documentation before you start testing a `POST /users` endpoint.**
2.  **What is the advantage of using Playwright for both UI and API testing within the same test suite?**
3.  **Explain the typical workflow of using API tools: start with the documentation, then a GUI tool, then automation.**

## Practical Application

**Scenario:** You are given the following snippet from a Swagger/OpenAPI documentation for an endpoint.

---
**`GET /products/{id}`**

**Description:** Retrieves a single product by its ID.

**Parameters:**
-   `id` (path, integer, required): The unique ID of the product.

**Responses:**
-   **`200 OK`**:
    -   **Content:** `application/json`
    -   **Schema:**
        ```json
        {
          "id": 101,
          "name": "Super Widget",
          "price": 19.99,
          "inStock": true
        }
        ```
-   **`404 Not Found`**:
    -   **Description:** The product with the specified ID was not found.
---

1.  **Task:** You want to test this endpoint manually in Postman. What **HTTP Method** and **URL** would you use to request the product with an ID of `101`? (Assume the base URL is `https://api.example.com`).
2.  **Task:** After sending the request from Task 1, what **Status Code** and what **`name`** would you expect in the response body to confirm the test passed?
3.  **Task:** You are writing an automated test for the "not found" scenario. What assertion would you make about the response status after requesting a product with an ID that doesn't exist (e.g., `999`)?