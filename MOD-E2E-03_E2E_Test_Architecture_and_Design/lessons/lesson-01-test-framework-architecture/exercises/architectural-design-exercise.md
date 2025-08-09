# Exercise: Architectural Design

## Objective

To practice applying architectural principles by designing a high-level structure for a new test automation framework.

## Scenario

You are tasked with creating a new E2E test automation framework for a large e-commerce application. The application has the following key areas:
- User Authentication (Login, Logout, Registration)
- Product Search and Browsing
- Shopping Cart
- Checkout Process
- User Profile Management

## Your Task

1.  **Choose an Architectural Pattern:** Based on the lesson, which architectural pattern(s) would you choose for this framework? Justify your choice.

2.  **Design the Directory Structure:** Create a diagram or a tree structure representing the directories for your proposed framework. Think about where you would put tests, page objects, test data, utilities, and configuration files.

3.  **Apply SOLID Principles:** For each of the 5 SOLID principles, provide one specific example of how you would apply it in your framework design.
    -   **SRP:** What is a specific example of a class or module that would have a single responsibility?
    -   **OCP:** How would you design the framework to allow adding tests for a new feature (e.g., "Wishlist") without modifying existing code?
    -   **LSP:** If you had a `ProductPage` and a `DiscountedProductPage`, how would LSP apply?
    -   **ISP:** Instead of a single `Utils.ts`, what smaller, more focused utility modules would you create?
    -   **DIP:** How would you prevent your test files from being tightly coupled to your page object implementations?

## Submission

Write down your answers in a markdown file. There is no single "correct" answer; the goal is to think critically about the trade-offs and justify your architectural decisions.