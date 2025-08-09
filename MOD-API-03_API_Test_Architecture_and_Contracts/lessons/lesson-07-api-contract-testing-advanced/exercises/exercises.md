# Exercises: Advanced API Contract Testing with Pact

## Exercise 1: Define a Pact Interaction

**Objective:** Write the code to define a consumer-driven contract interaction using Pact.

**Instructions:**

You are writing a consumer test for a **WebApp**. The WebApp needs to call a **ProductAPI** to get a list of all products.

-   **Consumer:** `WebApp`
-   **Provider:** `ProductAPI`
-   **Endpoint:** `GET /products`
-   **Expected Response:** A JSON array of product objects.

Write the `provider.addInteraction(...)` block for this scenario. Your interaction definition must include:
1.  A descriptive `state` for the provider (e.g., "products exist").
2.  A clear `uponReceiving` description.
3.  The correct `withRequest` object (method and path).
4.  A `willRespondWith` object that specifies:
    -   A `200` status code.
    -   The correct `Content-Type` header.
    -   A `body` that uses Pact matchers to specify an array containing objects that look like products. Each product object in the array should have:
        -   An `id` that is a string (e.g., use `Matchers.string()`).
        -   A `name` that is a string.
        -   A `price` that is a decimal number (e.g., use `Matchers.decimal()`).

You can use `Matchers.eachLike()` to define the structure of the objects within the array.

---

## Exercise 2: Understand the Provider Verification Flow

**Objective:** Explain the role of state handlers in the provider verification process.

**Instructions:**

Consider the Pact interaction you defined in Exercise 1. The `state` was "products exist".

Now, you are on the **ProductAPI** (provider) team, and you need to write the provider verification test.

1.  In the `Verifier` options, what is the purpose of the `stateHandlers` object?
2.  Write the code for the `stateHandlers` object that would correctly handle the "products exist" state.
3.  Inside the state handler function, what kind of code would you write to ensure the provider is in the correct state? (e.g., what would you do with a database?)
4.  What would happen during the provider verification if you forgot to implement the state handler for "products exist"?

---

## Exercise 3: Consumer-Driven vs. Provider-Driven

**Objective:** Compare and contrast consumer-driven and provider-driven contract testing.

**Instructions:**

Your team is currently using OpenAPI-based schema validation (a form of provider-driven testing) to test the `ProductAPI`. A colleague suggests adding Pact (consumer-driven contract testing).

Explain the **unique benefit** that Pact provides that OpenAPI schema validation does not.

To frame your answer, consider this scenario:
-   The `ProductAPI`'s OpenAPI spec defines the `price` field as a `number`.
-   The `WebApp` (consumer) code relies on the `price` always being a number with exactly two decimal places (e.g., `19.99`), and it performs string manipulation on it.
-   The `ProductAPI` team changes the price to be returned as an integer (`20`) instead of a float (`20.00`).

1.  Would the **OpenAPI schema validation** test pass or fail after this change? Why?
2.  Would a **Pact consumer contract test** (assuming the consumer's expectation was defined correctly) pass or fail? Why?
3.  How does this scenario illustrate the core difference between the two approaches?
