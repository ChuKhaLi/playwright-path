# Lesson 10: API Testing Architecture Capstone Project Brief

## 1. Project Mission

Your mission is to design, build, and document a comprehensive, enterprise-grade API testing solution for the "BookSpot" online bookstore application. You will need to apply the principles, patterns, and strategies learned throughout this entire module to create a solution that is robust, scalable, and maintainable.

## 2. The Application Architecture: BookSpot Microservices

BookSpot is composed of three distinct microservices. You will be provided with an OpenAPI 3.0 specification for each service.

-   **`UserService`**:
    -   **Responsibilities:** User registration, login (issuing JWTs), and profile management.
    -   **Endpoints:** `POST /register`, `POST /login`, `GET /users/{id}`, `PUT /users/{id}`.

-   **`BookService`**:
    -   **Responsibilities:** Managing the book inventory, including details like title, author, price, and stock levels.
    -   **Endpoints:** `GET /books`, `GET /books/{id}`, `POST /books`, `PUT /books/{id}`, `GET /books/search`.

-   **`OrderService`**:
    -   **Responsibilities:** Creating and managing customer orders.
    -   **Dependencies:** It communicates with the `UserService` to validate user identity and with the `BookService` to check book availability and price.
    -   **Endpoints:** `POST /orders`, `GET /orders`, `GET /orders/{id}`.

## 3. Core Project Requirements

Your final submission must include the following components:

### a. Test Framework Architecture
-   **Structure:** A well-organized directory structure that separates concerns (clients, repositories, factories, fixtures, config, etc.).
-   **Base Client:** A `BaseApiClient` that includes robust error handling and a retry mechanism.
-   **Configuration:** A configuration system that supports multiple environments (e.g., `development`, `staging`).
-   **Design Patterns:**
    -   Implement **Repositories** for the `User`, `Book`, and `Order` domains.
    -   Implement **Factories** for generating test data for users, books, and orders.
    -   Implement at least one **Builder** for a complex request object (e.g., a book search query).
-   **Custom Fixtures:** Create custom Playwright fixtures to provide initialized repositories to your tests.

### b. Testing Strategy Implementation

You must implement tests that cover different levels of the testing pyramid.

1.  **Schema Validation Tests:**
    -   Implement a mechanism to validate API responses against the provided OpenAPI specifications.
    -   Write at least one test for each service that explicitly performs schema validation.

2.  **Consumer-Driven Contract Tests (Pact):**
    -   The `OrderService` is a **consumer** of both the `UserService` and the `BookService`.
    -   Write a consumer test for the `OrderService` that defines its interactions with the `UserService` (to get user details) and the `BookService` (to get book details).
    -   Generate pact files for these interactions.
    -   *Bonus: Describe how you would set up the provider verification for the `UserService` and `BookService`.*

3.  **Functional API Tests:**
    -   Write functional tests for the most critical business flows. Your tests should use the framework you've built (repositories, factories, fixtures).
    -   **Critical Flows to Test:**
        -   A user can successfully register and then log in.
        -   An authenticated user can create an order for an in-stock book.
        -   An attempt to order an out-of-stock book fails with a specific error.
        -   A user can view their own order history.

### c. Documentation

-   **`README.md`:** A high-level `README.md` in the root of your project directory.
-   **Strategy Document:** A short (1-page) document (`TESTING_STRATEGY.md`) that explains your architectural decisions, the overall testing strategy, and how to run the tests.

## 4. Deliverables

Your completed project should be a Git repository containing:

1.  A `/framework` directory containing your complete, working API testing framework code.
2.  A `/tests` directory containing all your test files (schema, contract, functional).
3.  The `TESTING_STRATEGY.md` document.
4.  A root `README.md` explaining the project and how to set it up.
5.  The provided `openapi` specifications for the three services.

## 5. Getting Started

1.  **Review the Specs:** Thoroughly read the OpenAPI specifications for all three services to understand their functionality.
2.  **Design First:** Before writing code, sketch out your framework structure and testing strategy.
3.  **Build Incrementally:**
    -   Start with the core framework (config, base client).
    -   Implement the clients and repositories for one service (e.g., `UserService`) and write a simple functional test.
    -   Layer in schema validation.
    -   Implement the contract tests.
    -   Build out the remaining services and tests.
4.  **Document as You Go:** Don't leave the documentation until the end.

This capstone project is the ultimate test of your skills as an API Test Architect. Good luck!