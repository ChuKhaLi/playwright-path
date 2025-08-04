# Lesson 5: Assessment

## Knowledge Check

1.  **Question:** What is the primary difference between in-process mocking (like Playwright's `page.route`) and out-of-process service virtualization (like WireMock)?
    -   a) In-process mocking is only for frontend tests, while service virtualization is only for backend tests.
    -   b) In-process mocking intercepts calls within the test's own process, while service virtualization runs a separate server process that your application makes real network calls to.
    -   c) In-process mocking is slower than service virtualization.
    -   d) Service virtualization cannot simulate network latency, but in-process mocking can.

2.  **Question:** You need to test how your service behaves when a critical downstream dependency is completely unavailable (e.g., the server is down). Which is the most effective and reliable way to simulate this?
    -   a) Add `if (test_mode)` logic to your application code to bypass the real API call.
    -   b) Physically unplug the network cable of the test machine.
    -   c) Use a service virtualization tool to simulate the dependency, and simply don't run the virtual service for that test.
    -   d) Hope that the real dependency is down during your test run.

3.  **Question:** In the context of Playwright, what does `route.fulfill()` do?
    -   a) It allows the intercepted network request to continue to the real server.
    -   b) It completes the request by providing a mocked response, preventing the request from ever reaching the network.
    -   c) It cancels the network request, causing an error.
    -   d) It forwards the request to a different URL.

4.  **Question:** Why is it a good practice to reset your service virtualization tool (e.g., `wiremock.reset()`) before each test?
    -   a) To clear the logs and save disk space.
    -   b) To ensure that stubs and configurations from one test do not leak into and affect subsequent tests, which is crucial for test isolation.
    -   c) To force the tool to check for a new version.
    -   d) To improve the performance of the test suite.

## Practical Exercise

### Objective

Use Playwright's `page.route()` to test a UI component in isolation, and then design a service virtualization setup for a backend service using WireMock.

### Part 1: Frontend Mocking with Playwright

**Scenario:** You have a simple weather widget on a webpage. When the page loads, it makes a `GET` request to `/api/weather?city=London` to fetch the current weather. You need to test that the widget correctly displays the temperature from the API response.

**Your Task:**

1.  Write a Playwright test named `should display the correct temperature from the mocked weather API`.
2.  Inside the test, use `page.route()` to intercept `GET` requests to `/api/weather`.
3.  When a request for London is intercepted, use `route.fulfill()` to return a mock JSON response:
    ```json
    {
      "city": "London",
      "temperature": 15,
      "condition": "Cloudy"
    }
    ```
4.  After setting up the route, navigate the page to your weather widget.
5.  Assert that the widget displays "15°C".

### Part 2: Backend Service Virtualization Design

**Scenario:** You are testing a `ShippingService`. When a new shipment is created, the `ShippingService` must perform two actions:
1.  Call an internal `InventoryService` to reserve the stock for the product.
2.  Call an external, third-party `LogisticsService` (e.g., FedEx, UPS) to get a tracking number.

You need to design tests for the `ShippingService` in isolation.

**Your Task:**

Describe in writing how you would use a service virtualization tool like WireMock to test the following two scenarios for the `ShippingService`. You don't need to write the full test code, but you must describe the WireMock stubs you would create for each scenario.

**Scenario A: Successful Shipment Creation**

-   **Description:** Write down the stubs needed to simulate a successful interaction with both the `InventoryService` and the `LogisticsService`.
    -   What request would you expect to the `InventoryService`? What successful response would you configure WireMock to return?
    -   What request would you expect to the `LogisticsService`? What successful response (including a fake tracking number) would you configure?

**Scenario B: Inventory Service Fails**

-   **Description:** Write down the stub needed to simulate a failure from the `InventoryService`.
    -   What request would you expect to the `InventoryService`?
    -   What error response (e.g., status code `409 Conflict` with a message like "Insufficient stock") would you configure WireMock to return?
    -   In this scenario, should the `ShippingService` still attempt to call the `LogisticsService`? (This is a design question about your SUT that testing helps answer).

### Expected Outcome

-   A working Playwright test file for Part 1.
-   A clear, written description for Part 2 that explains the WireMock stubs required to test the two scenarios. This demonstrates your ability to think about how to use service virtualization to control dependencies and test specific business logic paths.