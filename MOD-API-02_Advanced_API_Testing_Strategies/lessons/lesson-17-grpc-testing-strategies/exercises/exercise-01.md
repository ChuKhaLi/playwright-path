# Exercise 1: Testing a gRPC Service

## Objective

Write a test that connects to a public gRPC "reflector" service, which can describe itself, and verify its services.

## Scenario

Testing gRPC usually requires having the `.proto` files. However, some gRPC servers implement the [gRPC Server Reflection Protocol](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md). This allows clients to query the server to discover its available services without needing the `.proto` files beforehand.

We will connect to a public gRPC reflector service and list its services.

## Instructions

1.  **Install gRPC Libraries:**
    ```bash
    npm install @grpc/grpc-js @grpc/proto-loader
    ```

2.  **Create a Test Spec File:** Create a file named `grpc-reflection.spec.ts`.

3.  **Write the Test:**
    -   This test will be more complex and won't use Playwright's `test` runner directly, but the principles are the same. We'll use Node.js's built-in `assert`.
    -   Import the necessary `grpc` and `proto-loader` libraries.
    -   The target server is `grpc.reflection.v1alpha.ServerReflection`.
    -   You will need to load the reflection proto definition, which is a standard, well-known proto. You can find it online or in gRPC library distributions.
    -   Create a gRPC client for the reflection service, pointing to a public gRPC server like `grpc.server.io:443` with secure credentials.
    -   Call the `listServices` method on the reflection client.
    -   In the callback, assert that the response contains a list of services and that the list is not empty.