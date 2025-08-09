# Lesson 19: Web Application Architecture - Assessment

## Multiple Choice Questions

1.  **Which component of a web application is primarily responsible for handling business logic and interacting with the database?**
    a.  Client (Frontend)
    b.  Server (Backend)
    c.  Database
    d.  API

2.  **In a microservices architecture, what is the primary method of communication between services?**
    a.  Direct database calls
    b.  Shared memory
    c.  API calls
    d.  File sharing

3.  **What is a major testing implication of a monolithic architecture?**
    a.  E2E tests are very difficult to run.
    b.  A change in one feature is unlikely to affect another.
    c.  Regression testing is critical because components are tightly coupled.
    d.  Services can be tested and deployed independently.

4.  **If a UI test fails, what is the fastest way to determine if the issue is in the frontend or the backend?**
    a.  Restart the server.
    b.  Clear the browser cache.
    c.  Test the relevant API endpoint directly.
    d.  Run the UI test again.

5.  **Which part of the application architecture is Playwright primarily designed to interact with?**
    a.  The Database
    b.  The Server's operating system
    c.  The Client (Frontend) running in the browser
    d.  The API contracts between microservices

## Short Answer Questions

1.  **Briefly describe the three core components of a typical web application.**
2.  **You are assigned to test a new feature on an application that uses a microservices architecture. Why is it important to have access to mocked services for your testing?**
3.  **Explain why API testing is often faster and more stable than UI testing.**

## Practical Application

**Scenario:** You are testing an e-commerce website. When you click the "Add to Cart" button for a product, the item does not appear in your shopping cart.

1.  **Architectural Thinking:** Based on a typical web architecture, list the sequence of events (interactions between client, server, and database) that *should* happen when you click the "Add to Cart" button.
2.  **Debugging Strategy:** How would you use your knowledge of the architecture and your browser's developer tools to investigate this bug? Where would you look first, and what would you look for?
3.  **Test Planning:** Imagine the "shopping cart" is its own microservice. What are two distinct types of tests you would want to have for this feature (e.g., UI, API, etc.), and what would each test verify?