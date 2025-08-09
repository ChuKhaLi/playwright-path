# Exercises: Advanced Mocking and Service Virtualization

## Exercise 1: Mocking with Playwright's `page.route`

**Objective:** Write a UI test that isolates a frontend component by mocking its API dependency.

**Instructions:**

You have a simple web page with a button that, when clicked, fetches a random joke from an API (`https://api.chucknorris.io/jokes/random`) and displays it in a `div` with the `id="joke-text"`.

Write a Playwright test script that:
1.  Navigates to the page.
2.  Uses `page.route()` to intercept calls to the joke API.
3.  Fulfills the request with a specific, hardcoded joke of your choice (e.g., `{ "value": "Chuck Norris can divide by zero." }`).
4.  Clicks the button to fetch the joke.
5.  Asserts that your specific, mocked joke text is visible on the page.

This test should be able to run even if the real `api.chucknorris.io` is down.

---

## Exercise 2: Designing Service Virtualization Scenarios

**Objective:** Define stub configurations for a service virtualization tool to test various scenarios.

**Instructions:**

You are testing a `ShippingService`. When a user requests a shipping quote, the `ShippingService` needs to call a downstream `AddressValidationService` to verify the destination address.

The `AddressValidationService` has one endpoint: `POST /validate`.
-   A successful validation returns `200 OK` with `{"isValid": true, "isResidential": true}`.
-   An invalid address returns `200 OK` with `{"isValid": false}`.
-   If the validation service is overloaded, it might return a `503 Service Unavailable` error.

You are using a service virtualization tool like WireMock. For each of the three scenarios below, write the **stub configuration** (in JSON or YAML format) that you would send to the virtualization tool to set up the desired behavior.

**Scenario 1: The Happy Path**
-   **Goal:** Test that the `ShippingService` works correctly when the address is valid.
-   **Stub:** Configure the virtualized `AddressValidationService` to return a successful validation response.

**Scenario 2: The Invalid Address Path**
-   **Goal:** Test that the `ShippingService` correctly handles an invalid address response.
-   **Stub:** Configure the virtualized service to return an invalid address response.

**Scenario 3: The Unreliable Dependency Path**
-   **Goal:** Test the resilience of the `ShippingService`. Does it have a proper timeout or retry mechanism?
-   **Stub:** Configure the virtualized service to simulate being unavailable.

---

## Exercise 3: Choosing the Right Tool for the Job

**Objective:** Decide whether in-process mocking or out-of-process service virtualization is more appropriate for different testing scenarios.

**Instructions:**

For each of the following testing scenarios, choose the most appropriate isolation technique (`page.route` in-process mocking OR a dedicated service virtualization tool like WireMock). Justify your choice in one or two sentences.

1.  **Scenario A:** You are writing a unit test for a React `UserProfile` component. You want to verify that the component correctly displays a "Loading..." spinner while it waits for data from the `/api/user/profile` endpoint.

2.  **Scenario B:** You are writing a component test for the `OrderService`. You need to verify that if the downstream `PaymentService` takes more than 5 seconds to respond, the `OrderService` correctly times out and marks the order as "FAILED".

3.  **Scenario C:** The frontend team and the `OrderService` backend team are working in parallel. The frontend team needs a stable endpoint to develop the "Order History" page against, even before the `OrderService` is fully implemented.

4.  **Scenario D:** You are writing a backend test for the `InvoiceService`. You need to verify that when it receives a "payment successful" event from the `PaymentService`, it correctly generates a PDF invoice. You want to simulate the "payment successful" event.
