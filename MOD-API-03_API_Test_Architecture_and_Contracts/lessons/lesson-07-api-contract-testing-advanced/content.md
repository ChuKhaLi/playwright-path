# Lesson 7: Advanced API Contract Testing with Pact

## 1. Introduction: Why Go Beyond Schema Validation?

In the previous lesson, we learned how to validate that an API's response conforms to a schema defined in an OpenAPI specification. This is a form of **provider-driven contract testing**, where the API provider dictates the contract.

While powerful, this has a limitation: it doesn't guarantee that the API is actually *usable* for its consumers. A provider can make a technically valid, backward-compatible change (like adding a new optional field) that still breaks a consumer's application because of how their code is written.

**Consumer-Driven Contract Testing (CDCT)** solves this problem by flipping the script:
1.  The **Consumer** (e.g., a frontend application or another microservice) writes tests that define *exactly* how it needs to interact with the Provider.
2.  These tests generate a **contract file** (the "pact").
3.  The **Provider** (the API) then uses this contract to verify that it can fulfill the consumer's specific expectations.

This ensures that no change is deployed by the provider that would break any of its known consumers.

## 2. Introducing Pact

**Pact** is the de-facto standard framework for implementing Consumer-Driven Contract Testing.

**The Pact Workflow:**

1.  **Consumer Test:** In the consumer's codebase, a unit test is written for the code that calls the provider (e.g., an `ApiClient` method). Pact provides a **mock provider** that stands in for the real API. The consumer test defines the expected interactions (request/response pairs).
2.  **Pact File Generation:** If the consumer test passes against the mock provider, Pact generates a `pact.json` file. This file is the contract.
3.  **Share the Contract:** The pact file is shared with the provider. This is typically done via a **Pact Broker**, a dedicated server for storing and exchanging contracts.
4.  **Provider Verification:** In the provider's codebase, a special test is run. Pact reads the contract from the Pact Broker, and for each interaction, it makes a *real* request to the running provider API to ensure the response matches what the consumer expects.
5.  **Feedback Loop:** If the provider verification succeeds, the provider knows it is safe to deploy. If it fails, the provider knows a change has been made that will break the consumer.

![Pact Workflow Diagram](https://docs.pact.io/img/how-pact-works/pact_workflow.svg)
*(Image from pact.io)*

## 3. Implementing a Consumer Test with Pact

Let's imagine we are the **WebApp** (consumer) and we need to fetch user data from the **UserAPI** (provider).

**Step 1: Install Pact**

```bash
npm install @pact-foundation/pact --save-dev
```

**Step 2: Write the Consumer Test**

This test uses Pact to define the contract.

```typescript
// consumer-tests/user-api-client.pact.spec.ts
import { Pact } from '@pact-foundation/pact';
import { UserApiClient } from '../src/api/UserApiClient';
import { Matchers } from '@pact-foundation/pact';
import * as path from 'path';

// 1. Configure the Pact mock provider
const provider = new Pact({
  consumer: 'WebApp',
  provider: 'UserAPI',
  port: 1234, // Port for the mock provider
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'), // Where to output the pact file
});

describe('UserAPI Consumer Contract', () => {
  // 2. Setup the mock provider before tests
  beforeAll(() => provider.setup());

  // 3. Teardown the mock provider and write the pact file
  afterAll(() => provider.finalize());

  // 4. Verify all interactions defined in the test
  afterEach(() => provider.verify());

  describe('when a request to get a user is made', () => {
    it('should return a user object for an existing user', async () => {
      // 5. Define the expected interaction (the contract)
      await provider.addInteraction({
        state: 'a user with ID 1 exists', // The state the provider needs to be in
        uponReceiving: 'a request for user 1',
        withRequest: {
          method: 'GET',
          path: '/users/1',
          headers: { Accept: 'application/json' },
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            // Use Pact matchers for fields with variable values
            id: Matchers.integer(1),
            firstName: Matchers.string('Alice'),
            lastName: Matchers.string('Smith'),
            email: Matchers.email('alice.smith@example.com'),
          },
        },
      });

      // 6. Run the actual consumer code against the mock provider
      const apiClient = new UserApiClient(`http://localhost:${provider.opts.port}`);
      const user = await apiClient.getUserById(1);

      // 7. Assert on the consumer's behavior
      expect(user.id).toBe(1);
      expect(user.firstName).toBe('Alice');
    });
  });
});
```

**Key Pact Concepts in the Consumer Test:**
-   **`state`**: A string that describes the setup required on the provider. The provider will use this string to set up its database or mocks before running the verification.
-   **`uponReceiving`**: A human-readable description of the request.
-   **`withRequest`**: The definition of the HTTP request the consumer will make.
-   **`willRespondWith`**: The definition of the HTTP response the consumer expects.
-   **`Matchers`**: Pact's secret sauce. Instead of hardcoding values like `id: 1`, you use matchers (`Matchers.integer()`) to say "I expect an integer here." This makes the contract flexible and prevents it from being too brittle.

## 4. Implementing Provider Verification

Now, on the provider side (the UserAPI), we need to verify this contract.

**Step 1: Setup the Provider Verification Test**

This test will fetch the contract from the Pact Broker and run it against our real API.

```typescript
// provider-tests/pact.provider.spec.ts
import { Verifier } from '@pact-foundation/pact';
import * as path from 'path';
import { server } from '../src/server'; // Your running Express/NestJS/etc. server

describe('Pact Verification', () => {
  it('validates the expectations of WebApp', () => {
    const opts = {
      provider: 'UserAPI',
      providerBaseUrl: 'http://localhost:8080', // The URL of the running provider
      
      // Fetch pacts from a Pact Broker
      pactBrokerUrl: 'https://your-pact-broker.com',
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      publishVerificationResult: true,
      providerVersion: '1.0.0',

      // This is where the magic happens. Pact uses the "state" from the
      // consumer test to set up the correct data for the test.
      stateHandlers: {
        'a user with ID 1 exists': async () => {
          // This is where you would set up your database
          // e.g., database.users.create({ id: 1, ... });
          console.log('Setting up state: a user with ID 1 exists');
          return Promise.resolve('User with ID 1 created');
        },
      },
    };

    // Start the server before verification
    const app = server.listen(8080, () => {
      console.log('UserAPI running on port 8080');
    });

    // Verify the pacts
    return new Verifier(opts).verifyProvider().then(() => {
      console.log('Pact verification complete!');
    }).finally(() => {
      app.close(); // Shut down the server
    });
  });
});
```

**Key Concepts in the Provider Test:**
-   **`providerBaseUrl`**: The URL where the real provider API is running for the test.
-   **`pactBrokerUrl`**: The location of the Pact Broker to fetch contracts from.
-   **`stateHandlers`**: This is the critical link. The `Verifier` looks at the `state` string in the contract (e.g., "a user with ID 1 exists") and executes the corresponding function in `stateHandlers`. This ensures the provider's database is in the correct state to satisfy the consumer's expectation.

## 5. The Role of the Pact Broker

The Pact Broker is the collaboration hub for contract testing. It is a separate application that you host.

**Its key features are:**
-   **Stores Contracts:** It acts as a central repository for all pact files.
-   **Visualizes Relationships:** It shows which consumers depend on which providers and the verification status of each contract.
-   **Enables `can-i-deploy`:** The broker provides a command-line tool called `can-i-deploy`. Before deploying a service, your CI/CD pipeline can ask the broker: "Can I deploy version 1.2.3 of the UserAPI to production?" The broker will check if this version has been successfully verified against the latest contracts from *all* of its known consumers. If so, it gives a green light. This is the ultimate safety net.

## Summary

-   **Consumer-Driven Contract Testing** ensures that a provider API meets the specific needs of its consumers.
-   **Pact** is the leading framework for CDCT, providing a mock provider for consumer tests and a verification tool for provider tests.
-   The workflow involves the consumer generating a **pact file** (the contract) and the provider **verifying** it.
-   **State handlers** are used on the provider side to set up the necessary data for each interaction.
-   The **Pact Broker** is a crucial piece of infrastructure that enables collaboration and provides the `can-i-deploy` safety check for CI/CD pipelines.