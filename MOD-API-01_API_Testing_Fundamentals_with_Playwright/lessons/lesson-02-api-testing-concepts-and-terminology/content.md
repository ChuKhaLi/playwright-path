# Lesson 2: API Testing Concepts and Terminology

## What is an API? The Power Outlet Analogy

An **API (Application Programming Interface)** is a set of rules that allows different software applications to communicate with each other.

Think of a power outlet on the wall.
- You don't need to know how the power plant or the building's wiring works.
- You just need to know that if you plug in a device with the correct plug (the interface), you will get electricity (the service).

The power outlet is an API. It provides a standardized way for your devices (applications) to get a service (data or functionality) from the power grid (the server or another application).

In software, an API exposes certain functionalities of an application without revealing the underlying complexity. For example, a weather app on your phone uses an API to get forecast data from a weather service.

## Why is API Testing So Important?

UI (User Interface) tests are essential, but they can be slow, brittle, and expensive to maintain. API tests are a powerful complement that addresses these weaknesses. This is often visualized with the **Testing Pyramid**.

```
      /_\
     / | \
    / E2E \   <-- Slow, Expensive (UI Tests)
   /_______\
  /         \
 /   API   \  <-- Faster, More Stable (Service/API Tests)
/___________\
/             \
/ Unit Tests  \ <-- Fastest, Cheapest (Code-level Tests)
/_______________\
```

### Key Benefits of API Testing:

1.  **Speed**: API tests are much faster than UI tests because they don't need to render a user interface. You can run thousands of API tests in the time it takes to run a few dozen UI tests.
2.  **Stability**: APIs change less frequently than UIs. This means your tests are less likely to break due to cosmetic changes, making them more stable and reliable.
3.  **Early Feedback**: You can start testing the business logic of an application through its APIs long before a UI is even built. This allows you to find and fix bugs earlier in the development cycle, which is much cheaper.
4.  **Improved Test Coverage**: You can test edge cases, error conditions, and security vulnerabilities at the API layer that are difficult or impossible to simulate through a UI.

## Types of API Testing

API testing isn't just one thing. It's a category that includes several types of tests:

-   **Functional Testing**: Verifies that the API behaves according to its requirements. Does it return the correct data? Does it handle inputs correctly? (This is the main focus of this module).
-   **Load Testing**: Checks how the API performs under a high volume of requests. Can it handle 1,000 users at once?
-   **Security Testing**: Identifies vulnerabilities in the API. Can a user access data they shouldn't be able to?
-   **Integration Testing**: Verifies that the API works correctly with other parts of the system or with third-party services.

## Essential API Testing Terminology

Let's define the key terms you'll use every day.

### Endpoint
An **endpoint** is a specific URL where an API can be accessed. It's the "address" you send your request to.
-   **Example**: `https://api.example.com/users/123`

### Resource
A **resource** is an object or representation of something that the API can provide information about. In the endpoint example above, the resource is the user with the ID `123`.

### Payload
The **payload** is the data you send to the API in the body of a request, or the data the API sends back to you in the body of a response. It's usually in JSON format.
-   **Request Payload**: The JSON you send in a `POST` or `PUT` request.
-   **Response Payload**: The JSON you receive in a `GET` response.

### Parameters
Parameters are used to modify a request.
-   **Query Parameters**: Appended to the URL to filter or sort results.
    -   **Example**: `GET /api/users?status=active` (Here, `status` is a query parameter).
-   **Path Parameters**: Part of the URL path itself, used to identify a specific resource.
    -   **Example**: `GET /api/users/123` (Here, `123` is a path parameter).

### API Contract
The **API Contract** is the official documentation that describes how to interact with an API. It's the "rulebook" that defines the available endpoints, expected request formats, and possible response formats. Common formats for API contracts include OpenAPI (formerly Swagger) and RAML.

**Why it matters for testing**: Your tests are essentially verifying that the API adheres to its contract.

### Serialization / Deserialization
-   **Serialization**: The process of converting a complex data object (like a class instance in your code) into a format that can be easily sent over a network, like a JSON string.
-   **Deserialization**: The reverse process of converting a JSON string from an API response back into a data object that your code can use.

Playwright's `request` fixture handles this for you automatically when you use the `data` option for requests and the `.json()` method for responses.

## The API Testing Lifecycle

API testing fits within the broader software development lifecycle.

1.  **Plan**: Understand the API requirements from the API contract (documentation). Design test cases for happy paths, error paths, and edge cases.
2.  **Develop**: Write your test scripts using a tool like Playwright.
3.  **Execute**: Run your tests, either locally or in a CI/CD pipeline.
4.  **Analyze**: Review the test results. If a test fails, analyze the response to understand the cause.
5.  **Report**: Log bugs for any failures, providing the request that was sent and the response that was received.

## Summary

-   An **API** is a set of rules for software communication.
-   **API testing** is crucial for a fast, stable, and efficient QA strategy, as shown by the Testing Pyramid.
-   Core terminology includes **Endpoint** (the URL), **Resource** (the data object), and **Payload** (the data sent/received).
-   The **API Contract** is your source of truth for how the API should behave.

Understanding these concepts provides the foundation you need to start designing and writing meaningful API tests.

## Next Steps

With this conceptual framework in place, you are now ready to dive deeper into the most common type of API architecture you'll encounter:
-   **Lesson 3**: Introduction to REST APIs