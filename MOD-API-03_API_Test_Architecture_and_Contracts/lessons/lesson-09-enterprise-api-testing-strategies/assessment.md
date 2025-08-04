# Lesson 9: Assessment

## Knowledge Check

1.  **Question:** In a microservices testing strategy, why should you aim to have very few end-to-end tests compared to unit and component tests?
    -   a) Because end-to-end tests are not very effective at finding bugs.
    -   b) Because end-to-end tests are slow, expensive to run, and can be flaky due to their reliance on a fully integrated environment.
    -   c) Because unit tests can find all the same bugs as end-to-end tests.
    -   d) Because end-to-end tests require a service mesh to run.

2.  **Question:** What is the primary role of a "Center of Excellence" (CoE) for testing in a large enterprise?
    -   a) To manually test all the applications.
    -   b) To write all the API tests for every team.
    -   c) To provide a centralized team that builds the core test framework, defines best practices, and supports other teams, ensuring consistency and quality.
    -   d) To approve every single deployment to production.

3.  **Question:** What is a "quality gate" in a CI/CD pipeline?
    -   a) A manual approval step required from a QA manager.
    -   b) A performance test that runs before deployment.
    -   c) An automated checkpoint in the pipeline that a service must pass to be promoted, which could include checks like "all contract tests passed" or "code coverage is above 80%".
    -   d) A security scan of the production environment.

4.  **Question:** How does a service mesh like Istio enable "fault injection" testing?
    -   a) By allowing you to modify the application code to simulate errors.
    -   b) By providing a dashboard to manually trigger failures.
    -   c) By intercepting network traffic between services and programmatically introducing failures, like HTTP errors or delays, without changing the application code.
    -   d) By running a special version of the service that is designed to fail.

## Practical Exercise

### Objective

Develop a high-level API testing strategy document for a fictional enterprise scenario. This exercise will test your ability to think strategically and apply the concepts of the lesson to a real-world problem.

### Scenario

You have been hired as the new Principal Test Architect for "ShopiVerse," a rapidly growing e-commerce company. ShopiVerse is migrating from a single monolithic application to a microservices architecture.

They have the following key services:
-   `UserService`: Manages user accounts and authentication.
-   `ProductService`: Manages the product catalog.
-   `OrderService`: Handles order creation and processing.
-   `PaymentService`: A third-party, external payment gateway.
-   `ShippingService`: Manages shipments and tracking.
-   `WebApp`: The main customer-facing frontend application.

There are 5 different development teams, one for each internal service and one for the web app. They currently have no consistent testing strategy.

### Your Task

Write a concise, high-level API testing strategy document (1-2 pages). Your document should be structured with the following sections:

1.  **Guiding Principles:**
    -   List 3-4 core principles that will guide your testing strategy. (e.g., "Automate everything," "Shift quality left," "Fast feedback is key").

2.  **Testing Pyramid for a Single Service:**
    -   Briefly describe what kind of testing each team is responsible for within their own service's pipeline (Unit, Component, Contract).
    -   What are the expectations for each layer? (e.g., "Unit tests must cover 85% of code," "Component tests must run against virtualized dependencies").

3.  **Cross-Service Testing Strategy:**
    -   How will you ensure that `OrderService` and `ProductService` can communicate correctly? Explain the role of **Consumer-Driven Contract Testing (Pact)** here.
    -   How will you test the interaction with the external `PaymentService`? Explain the role of **Service Virtualization** here.
    -   How many **End-to-End tests** will you have? What specific, critical user journeys would you cover with them? (e.g., "User signup to first order").

4.  **Governance and Tooling:**
    -   Propose a "paved road" of core tools. What tools would you choose for the framework, contract testing, and service virtualization?
    -   Define 3 critical **quality gates** that must be included in the CI/CD pipeline for every service before it can be deployed to production.

### Expected Outcome

A clear, professional strategy document that a new developer or QA engineer at ShopiVerse could read to understand the company's approach to API quality. It should demonstrate your ability to think beyond a single test and design a holistic strategy that can scale across a complex organization. Your strategy should clearly define responsibilities, tools, and processes, showing how the different types of testing work together to provide confidence in the system as a whole.