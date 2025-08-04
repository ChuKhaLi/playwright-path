# Lesson 13: API Integration Testing

## 1. What is API Integration Testing?

In the context of a single service, integration testing means verifying the interactions between the service and its external dependencies. Unlike component testing, where all dependencies are mocked, integration testing involves connecting to **real, live instances** of some of these dependencies.

Common integrations to test include:
-   **Databases:** Does the API correctly create, read, update, and delete data in a real database?
-   **Message Queues:** Does the API correctly publish messages to or consume messages from a real queue (like RabbitMQ or Kafka)?
-   **Third-Party APIs:** Does the API correctly interact with a live, external service (like a payment gateway or a social media API)?

Integration tests are a step up in complexity from component tests but provide higher confidence that the system works as a whole.

## 2. Testing Database Integrations

This is one of the most common and critical types of integration testing.

**Goal:** To verify that API operations result in the correct changes to the database state.

**Test Strategy:**
1.  **Setup (Arrange):**
    -   Ensure the database is in a known state before the test. This might involve cleaning up data from previous tests or seeding the database with specific test data. This is often done in a `beforeEach` hook.
    -   Connect to the database from your test script.
2.  **Action (Act):**
    -   Make an API call that should modify the database (e.g., `POST /users` to create a new user).
3.  **Assertion (Assert):**
    -   Assert the API response itself (e.g., `201 Created`).
    -   **Crucially**, connect to the database and query it directly to verify the change. For a new user, you would query the `users` table to confirm that a new row was inserted with the correct data.
4.  **Teardown:**
    -   Clean up any data created during the test to ensure tests are independent. This is often done in an `afterEach` hook.

### Example: Verifying User Creation

```typescript
import { test, expect } from '@playwright/test';
import { dbClient } from '../utils/database-client'; // A helper to connect to your DB

test.describe('User API Database Integration', () => {
  let createdUserId: string;

  test.afterEach(async () => {
    // Clean up the user created during the test
    if (createdUserId) {
      await dbClient.query('DELETE FROM users WHERE id = $1', [createdUserId]);
    }
  });

  test('POST /users should create a new record in the database', async ({ request }) => {
    const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
    
    // Act: Make the API call
    const response = await request.post('/api/users', { data: newUser });
    expect(response.ok()).toBe(true);
    const responseBody = await response.json();
    createdUserId = responseBody.id;
    expect(createdUserId).toBeDefined();

    // Assert: Query the database directly
    const result = await dbClient.query('SELECT * FROM users WHERE id = $1', [createdUserId]);
    
    expect(result.rowCount).toBe(1);
    const dbUser = result.rows[0];
    expect(dbUser.name).toBe(newUser.name);
    expect(dbUser.email).toBe(newUser.email);
  });
});
```

## 3. Testing Third-Party API Integrations

When your service depends on an external API you don't control (e.g., Stripe for payments, Twilio for SMS), you face a dilemma. Running tests against their live production API is often not feasible (it can cost money and is unreliable).

**Strategies:**
-   **Use the Third Party's Sandbox:** Most services provide a "sandbox" or "test" environment. These are live environments specifically for testing. Your integration tests should be configured to point to these sandbox URLs.
-   **Mock the Third-Party API:** For component-level tests, you should mock the third-party API completely using `page.route()` or a mock server. This allows you to simulate their responses (including errors) without making a real network call.
-   **Contract Testing:** If the third party provides a contract (like an OpenAPI schema), you can use that to generate mocks, ensuring your mocks stay in sync with their API.

## 4. Testing Message Queue Integrations

Many asynchronous systems use message queues. For example, when an order is placed, the `Order Service` might publish an `OrderCreated` event to a Kafka topic. A separate `Notification Service` would then consume this event and send an email.

**Test Strategy (for the publisher):**
1.  **Setup:** Connect a test consumer to the message queue topic.
2.  **Act:** Make an API call to the `Order Service` that should trigger the event.
3.  **Assert:** Check your test consumer to see if it received the `OrderCreated` event. Assert that the event payload is correct.

**Test Strategy (for the consumer):**
1.  **Setup:** Connect a test publisher to the message queue topic.
2.  **Act:** Use your test publisher to send a test `OrderCreated` event to the queue.
3.  **Assert:** Verify the outcome. For the `Notification Service`, this could involve checking a mock email server to see if an email was "sent."

## 5. Summary

-   **Integration testing** verifies the interaction between your service and its live dependencies.
-   For **database integration**, the pattern is: Setup DB -> Call API -> Assert API Response -> **Assert DB State** -> Teardown DB.
-   For **third-party APIs**, use their provided **sandbox environments** for integration tests and **mock them** for component tests.
-   For **message queues**, your tests need to act as both publishers and consumers to verify that events are sent and received correctly.
-   Integration tests are more complex and slower than component tests, so use them strategically to cover the critical integration points of your service.