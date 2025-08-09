# Exercises: API Testing Architecture Capstone Project

## Exercise 1: Project Scaffolding

**Objective:** Create the basic directory structure for the capstone project.

**Instructions:**

Based on the framework anatomy described in Lesson 8 and the project brief, create the directory structure for your capstone project.

Create a root directory named `bookspot-test-framework`. Inside it, create all the necessary subdirectories for:
-   Source code (API clients, repositories, fixtures, etc.)
-   Tests (functional, contract)
-   Configuration files
-   Test data
-   Documentation

You don't need to create any files yet, just the folders. This exercise is about planning the organization of your project.

---

## Exercise 2: Design the `OrderRepository`

**Objective:** Define the interface for a repository to abstract API interactions.

**Instructions:**

You need to create a repository for the `OrderService`. The repository will provide a clean, business-focused interface for your tests to use, hiding the underlying API calls.

Define the TypeScript **interface** for your `IOrderRepository`. It should include methods for the following actions:

1.  `create(orderData: CreateOrderRequest): Promise<Order>`
    -   Creates a new order.
2.  `findById(orderId: string): Promise<Order | null>`
    -   Finds a single order by its ID. Should return `null` if not found.
3.  `findByUser(userId: string): Promise<Order[]>`
    -   Finds all orders belonging to a specific user.

Also, define the supporting types `CreateOrderRequest` and `Order` based on the project brief. For example:
-   `CreateOrderRequest` should contain the necessary data to create an order (e.g., `bookId`, `quantity`).
-   `Order` should represent a created order, including its `id`, `status`, and `totalPrice`.

---

## Exercise 3: Plan a Functional Test

**Objective:** Write a high-level test plan for a critical business flow.

**Instructions:**

You are tasked with testing the following critical flow: **"An authenticated user can successfully order an in-stock book."**

Write a high-level test plan for this scenario. Your plan should be a sequence of steps written in plain English. It should describe the entire lifecycle of the test, from setup to assertion to cleanup.

Your plan must mention:
-   What **test data** needs to be created as a prerequisite (e.g., a user, a book).
-   How that prerequisite data will be created (e.g., "Use the `userRepository` to create a new user...").
-   The **action** being tested (creating the order).
-   The **assertions** you will make to verify the outcome (e.g., "Assert the order status is 'CONFIRMED'").
-   Any **cleanup** steps required to ensure the test is isolated.

This exercise is about thinking through the logic of a test before writing any code.
