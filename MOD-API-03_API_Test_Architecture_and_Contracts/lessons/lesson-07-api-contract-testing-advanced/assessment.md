# Lesson 7: Assessment

## Knowledge Check

1.  **Question:** What is the core principle of Consumer-Driven Contract Testing (CDCT)?
    -   a) The API provider defines the contract, and all consumers must adhere to it.
    -   b) The API consumer defines its expectations of the provider in a contract, and the provider must verify it can meet those expectations.
    -   c) It is a type of performance testing to see how many consumers an API can handle.
    -   d) It's a manual process where developers and QAs agree on a contract in a document.

2.  **Question:** In a Pact consumer test, what is the purpose of `Matchers` (e.g., `Matchers.integer()`)?
    -   a) To generate random data for the request body.
    -   b) To make the contract flexible by specifying the type or format of a value rather than the exact value itself.
    -   c) To match the consumer's code to the provider's code.
    -   d) To measure the time it takes for a response to be returned.

3.  **Question:** During provider verification in Pact, what is the role of a `stateHandler`?
    -   a) To handle the state of the consumer application.
    -   b) To check the current state of the Pact Broker.
    -   c) To set up the provider's database or dependencies into a specific state described in the contract before running the verification.
    -   d) To manage the state of the CI/CD pipeline.

4.  **Question:** What is the primary function of a Pact Broker?
    -   a) It runs the provider's API during tests.
    -   b) It acts as a central repository to store and share contracts between consumers and providers, and enables the `can-i-deploy` check.
    -   c) It is a performance monitoring tool for APIs.
    -   d) It automatically writes the consumer tests based on an OpenAPI specification.

## Practical Exercise

### Objective

Write a complete consumer-driven contract test using Pact. You will write the consumer test that generates a pact file, and then describe the corresponding provider verification setup.

### Scenario

You are working on a "Product Catalog" frontend application (the **Consumer**). It needs to fetch product information from a `ProductService` (the **Provider**).

### Part 1: Writing the Consumer Test

**Your Task:**

Write a Pact consumer test for your `ProductApiClient`. The test should define a contract for fetching a single product.

1.  **Set up the Pact provider:**
    -   Consumer name: `ProductCatalogWebApp`
    -   Provider name: `ProductService`

2.  **Define the interaction:**
    -   **State:** `'a product with ID 42 exists'`
    -   **Upon Receiving:** `'a request to get product 42'`
    -   **Request (`withRequest`):**
        -   Method: `GET`
        -   Path: `/products/42`
        -   Headers: `{ "Accept": "application/json" }`
    -   **Response (`willRespondWith`):**
        -   Status: `200`
        -   Headers: `{ "Content-Type": "application/json; charset=utf-8" }`
        -   **Body:** Use Pact `Matchers` for all fields.
            ```json
            {
              "id": 1, // Should be an integer, like 42
              "name": "Wireless Keyboard", // Should be a string
              "type": "PERIPHERAL", // Should be a string from a list: 'PERIPHERAL', 'COMPUTER', 'ACCESSORY'
              "price": 99.99 // Should be a decimal number
            }
            ```
            *Hint: Look for `Matchers.like()`, `Matchers.term()`, and `Matchers.decimal()` in the Pact documentation.*

3.  **Implement the client call:**
    -   Assume you have a `ProductApiClient` with a `getProductById(id)` method.
    -   Instantiate your client pointing to the Pact mock provider's URL.
    -   Call the method and assert that the returned data is structured as you expect (e.g., `expect(product.id).toBe(42)`).

### Part 2: Designing the Provider Verification

**Your Task:**

You don't need to write the full code for the provider verification, but you must **describe in detail** how you would set it up.

1.  **Verifier Options:**
    -   What would you set for `provider`, `providerBaseUrl`, and `pactBrokerUrl`?

2.  **State Handler:**
    -   Write the pseudo-code or a clear description for the `stateHandler` that corresponds to the state you defined in the consumer test (`'a product with ID 42 exists'`).
    -   What would this handler need to do? (e.g., connect to a database, insert a specific record, etc.).

3.  **CI/CD Integration:**
    -   Briefly explain how and when this provider verification test would run in a CI/CD pipeline.
    -   What is the purpose of the `can-i-deploy` command in this context?

### Expected Outcome

-   A complete and runnable Pact consumer test file (`*.pact.spec.ts`).
-   A clear and detailed written description for Part 2 that demonstrates your understanding of the provider's responsibilities in the CDCT workflow. This exercise will prove you can implement the full lifecycle of a consumer-driven contract test.