# Lesson 14: Microservices API Testing

## 1. The Enterprise Reality: Distributed Systems

This lesson builds on our introduction to microservices testing and dives into the enterprise-level patterns you will encounter in modern, cloud-native applications. We will focus on testing the critical infrastructure that holds these distributed systems together: API Gateways, service-to-service communication patterns, and event-driven architectures.

Mastering these concepts is what separates a junior API tester from a senior quality engineer who can ensure reliability in complex, distributed systems.

## 2. Testing the API Gateway

An API Gateway is a central entry point for all clients. It acts as a reverse proxy, routing requests to the appropriate downstream microservice. It also handles cross-cutting concerns like authentication, rate limiting, and logging.

**Testing the Gateway is CRITICAL.** If the gateway fails, the entire system is down for external clients.

### Key Gateway Testing Strategies:
-   **Routing:** Verify that requests are correctly routed to the intended service.
    -   Test: `POST /api/users` -> `User Service`
    -   Test: `GET /api/products/123` -> `Product Service`
-   **Authentication:** Ensure the gateway correctly enforces authentication and rejects unauthorized requests *before* they reach a downstream service.
-   **Rate Limiting:** Verify the gateway's rate-limiting rules (as covered in Lesson 8).
-   **Request/Response Transformation:** Sometimes a gateway modifies requests or responses. For example, it might add a `X-User-ID` header to a request after validating a JWT. Your tests must verify these transformations.

```typescript
// Example: Testing Gateway Request Transformation
test('Gateway should add user ID header after authentication', async ({ page }) => {
  const authToken = await loginAs('some-user'); // Get a valid JWT

  // Mock the downstream service to capture the request it receives
  await page.route('**/internal/user-profile', async (route) => {
    // Assert that the header was added by the gateway
    expect(route.request().headers()['x-user-id']).toBe('user-123');
    
    await route.fulfill({ status: 200, json: { success: true } });
  });

  // Make a request to the public API Gateway
  await page.request.get('/api/profile', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
});
```

## 3. Advanced Service-to-Service Communication Patterns

Microservices need to be resilient to failures in their dependencies. We must test these resiliency patterns.

### a) Circuit Breaker Testing
A circuit breaker stops requests from being sent to a service that is known to be failing. This prevents a cascading failure.

**Test Strategy:**
1.  Use a mock to make a downstream service (e.g., `Product Service`) start returning `503 Service Unavailable` errors.
2.  Rapidly send requests to the `Order Service`.
3.  Initially, the `Order Service` should try to call the `Product Service` and fail.
4.  After a certain threshold of failures, the circuit breaker should "open."
5.  Now, when you call the `Order Service`, it should immediately fail without even *trying* to call the `Product Service`. You can verify this by checking your mock server's logs to see that it's no longer receiving requests.
6.  Wait for the "cool-down" period, and test that the circuit breaker moves to a "half-open" state, where it sends one test request to see if the downstream service has recovered.

### b) Retry Mechanism Testing
If a request fails with a transient error (like a `503`), a service might automatically retry the request.

**Test Strategy:**
1.  Configure your mock to fail the first two times it's called, but succeed on the third.
2.  Call the service under test once.
3.  Assert that the final response is successful.
4.  Query your mock server to verify that it received exactly three requests.

## 4. Testing Event-Driven Architectures

In event-driven systems, services communicate asynchronously by publishing and subscribing to events via a message queue (like Kafka, RabbitMQ, or SQS).

### The Saga Pattern
A saga is a way to manage data consistency across microservices in a distributed transaction. If one step fails, the saga executes compensating actions to undo the previous steps.

**Example: Order Saga**
1.  `Order Service`: Creates an order in `PENDING` state. Publishes `OrderCreated` event.
2.  `Payment Service`: Consumes `OrderCreated`. Processes payment. Publishes `PaymentSucceeded` event.
3.  `Inventory Service`: Consumes `PaymentSucceeded`. Reserves stock. Publishes `InventoryReserved` event.
4.  `Order Service`: Consumes `InventoryReserved`. Updates order status to `CONFIRMED`.

**Testing a Saga:**
This requires end-to-end testing combined with message queue inspection.
1.  **Act:** Call the `Order Service` to create an order.
2.  **Assert:**
    -   Connect a test consumer to the `OrderCreated` topic and verify the event.
    -   Connect a test consumer to the `PaymentSucceeded` topic and verify the event.
    -   ...and so on for each step.
    -   Finally, query the `Order Service` API to confirm the order status is `CONFIRMED`.

**Testing the Compensation (Failure) Path:**
1.  Configure your mock `Payment Service` to fail.
2.  Call the `Order Service` to create an order.
3.  Assert that the `Order Service` eventually receives a `PaymentFailed` event and executes its compensating action (e.g., updates the order status to `CANCELLED`).

## 5. Summary

-   **API Gateway testing** is critical. You must test its routing, authentication, rate limiting, and transformation logic.
-   Test the **resiliency patterns** in your microservices, such as circuit breakers and retries. This often involves using mocks to simulate failures.
-   **Contract Testing** remains the most efficient way to prevent breaking changes between services.
-   Testing **event-driven architectures** and **sagas** requires a combination of API calls and direct interaction with your message queue to publish and consume test events.
-   This level of testing requires a deep understanding of the system's architecture and is a hallmark of a senior quality engineer.