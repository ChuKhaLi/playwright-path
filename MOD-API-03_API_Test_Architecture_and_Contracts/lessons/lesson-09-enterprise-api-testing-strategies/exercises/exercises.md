# Exercises: Enterprise API Testing Strategies

## Exercise 1: Design a Testing Strategy for a Microservice

**Objective:** Apply the testing pyramid to define a testing strategy for a new microservice.

**Instructions:**

Your team is building a new `NotificationService`. Its only responsibility is to send emails. It has one endpoint: `POST /send-email`. When called, it uses a third-party email provider (like SendGrid) to send the email.

For this `NotificationService`, describe what you would test at each of the following levels. Be specific about what each test would verify and what dependencies would be mocked or virtualized.

1.  **Unit Tests:** What specific classes or functions would you test? What would you mock?
2.  **Component Test:** How would you test the service as a whole but in isolation? What would you use service virtualization for?
3.  **Contract Test:** Who is the *consumer* of the `NotificationService`? Who is the *provider* that the `NotificationService` depends on? Which of these two interactions is more important to cover with a consumer-driven contract test?
4.  **End-to-End Test:** Describe a simple E2E test scenario that would involve the `NotificationService`. Why would you want to have very few tests of this type?

---

## Exercise 2: Define CI/CD Quality Gates

**Objective:** Create a set of automated quality gates for a CI/CD pipeline.

**Instructions:**

You are the lead test architect for an organization. You want to enforce quality standards by adding automated checks to the CI/CD pipeline for all microservices.

Define a sequence of **five** quality gates that must pass before a service can be automatically deployed to the staging environment. For each gate, specify:
1.  The **name** of the check (e.g., "Unit Test Coverage").
2.  The **tool** used to perform the check (e.g., "Jest, `can-i-deploy`").
3.  The **passing criteria** (e.g., "100% of tests must pass," "Code coverage must be >= 85%").

Your gates should cover unit tests, code quality, and contract tests.

---

## Exercise 3: Choose an Advanced Testing Technique

**Objective:** Select the appropriate advanced testing technique for a given enterprise challenge.

**Instructions:**

For each scenario below, choose the best-suited advanced testing technique from this list: **Fault Injection**, **Traffic Shadowing**, or **Canary Deployment**. Explain your choice.

1.  **Scenario A:** You have just deployed a new version of the `SearchService` that uses a completely new algorithm. You are confident in its correctness based on offline tests, but you are not sure how it will perform with the unpredictable variety of real user queries. You want to see how it behaves with production traffic without any risk to live users.

2.  **Scenario B:** The `InventoryService` is supposed to be highly resilient. You want to verify that if its database connection suddenly fails, the service "fails gracefully" (e.g., returns a `503` status with a clear error message) instead of crashing.

3.  **Scenario C:** You are rolling out a critical update to the `PaymentService`. A bug here could cost the company millions. You want to release the new version to a small subset of users (e.g., 1%) and run a targeted suite of automated API tests against it in the production environment before gradually increasing its exposure.
