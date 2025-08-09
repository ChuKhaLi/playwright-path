# BookSpot API Testing Strategy

## 1. Architectural Decisions

The test framework for the BookSpot application is built upon a layered architecture to ensure separation of concerns, maintainability, and scalability.

-   **Layered Design:** The framework is divided into distinct layers:
    -   **Test Layer:** Contains the Playwright test files (`*.spec.ts`). Tests are written in a declarative, business-focused way.
    -   **Repository Layer:** Abstracts the API interactions into business-level operations (e.g., `userRepository.create()`). This decouples tests from the underlying HTTP requests.
    -   **API Client Layer:** Contains raw API clients for each service (`UserService`, `BookService`, `OrderService`). These clients are responsible for constructing and sending HTTP requests.
    -   **Core Framework Layer:** Includes a `BaseApiClient` with shared logic for error handling, retries, and logging, as well as configuration management and custom fixtures.

-   **Design Patterns:**
    -   **Repository Pattern:** Used to provide a clean interface for tests and to decouple them from the API implementation.
    -   **Factory Pattern:** Used via `Faker.js` to generate dynamic and realistic test data, ensuring test isolation.
    -   **Builder Pattern:** Used for constructing complex query objects, such as for book searches.

-   **Configuration:** The framework is configuration-driven, loading environment-specific settings from `.env` files. This allows the same test suite to be run against local, staging, and potentially production environments without code changes.

## 2. Testing Strategy

Our testing strategy for the BookSpot microservices follows the principles of the testing pyramid, emphasizing tests at the lowest possible level.

-   **Schema Validation:**
    -   **Purpose:** To act as a first line of defense, ensuring that the structure of API responses conforms to the official OpenAPI contract.
    -   **Implementation:** We use an `OpenApiValidator` helper that leverages the `Ajv` library to validate responses against the schemas defined in the `openapi.yaml` files for each service. These checks are integrated into our functional tests.

-   **Consumer-Driven Contract Testing (Pact):**
    -   **Purpose:** To guarantee that the `OrderService` (consumer) can safely integrate with its providers (`UserService` and `BookService`). This prevents breaking changes from being deployed by the provider services.
    -   **Implementation:** We have created Pact consumer tests within the `OrderService`'s hypothetical codebase. These tests generate a contract (`pact.json`) that defines the exact expectations the `OrderService` has of its providers. The provider verification would then be run in the CI/CD pipelines of the `UserService` and `BookService`.

-   **Functional API Tests:**
    -   **Purpose:** To test critical end-to-end business workflows from the perspective of an API consumer.
    -   **Implementation:** These tests are written using Playwright and our custom framework fixtures (`userRepository`, etc.). They focus on validating business logic, such as:
        -   User registration and authentication flow.
        -   Creating an order with a valid user and an in-stock book.
        -   Handling business rule violations (e.g., ordering an out-of-stock book).

## 3. How to Run the Tests

### Prerequisites
-   Node.js and npm installed.
-   Run `npm install` to install dependencies.

### Running Tests
-   **Run all tests:**
    ```bash
    npx playwright test
    ```
-   **Run a specific test file:**
    ```bash
    npx playwright test tests/api/functional/user.spec.ts
    ```
-   **View the HTML report:**
    ```bash
    npx playwright show-report
    ```
