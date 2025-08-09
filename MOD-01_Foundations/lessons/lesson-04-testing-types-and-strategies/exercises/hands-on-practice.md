# Lesson 4: Testing Types and Strategies - Hands-on Exercises

## Overview

These exercises are designed to help you apply your knowledge of different testing levels (unit, integration, end-to-end) and types (functional, non-functional) to a practical scenario. The goal is to think like a test strategist, planning for comprehensive quality assurance.

---

### Exercise 1: Mapping Tests to the Pyramid (Basic)

**Learning Objective:** To practice classifying test cases according to the levels of the test automation pyramid.

**Prerequisites:**
- A clear understanding of the Test Automation Pyramid (Unit, Integration, End-to-End tests).

**Instructions:**

1.  **Review the test scenarios:** Read the list of test scenarios for a fictional e-commerce application.
2.  **Classify each test:** For each scenario, identify which level of the test pyramid it belongs to.
3.  **Justify your classification:** Briefly explain why you chose that level.
4.  **Create a table:** Organize your answers in a table with the columns: `Test Scenario`, `Pyramid Level (Unit/Integration/E2E)`, and `Justification`.

**Test Scenarios:**

*   A test that verifies a single function `calculateTotalPrice()` correctly sums up the prices of items in a cart object.
*   A test that checks if a user can successfully log in, add an item to the cart, and proceed to the checkout page.
*   A test that ensures the application's API gateway can successfully receive a request from the front end and forward it to the order service.
*   A test that verifies the `isValidEmail()` function returns `true` for "test@example.com" and `false` for "invalid-email".
*   A test that checks if, after a user submits an order, the payment service correctly processes the payment and the inventory service updates the stock level.

**Expected Outcome:**
A table that correctly classifies each test scenario within the test automation pyramid, with logical justifications for each choice.

**Validation:**
- Are unit tests correctly identified as testing small, isolated pieces of code?
- Are integration tests correctly identified as testing the interaction between two or more services/components?
- Are E2E tests correctly identified as testing a full user journey through the UI?

---

### Exercise 2: Identifying Functional vs. Non-Functional Testing (Intermediate)

**Learning Objective:** To distinguish between functional and non-functional testing requirements.

**Prerequisites:**
- Understanding of the difference between functional testing (what the system *does*) and non-functional testing (how the system *performs*).

**Instructions:**

1.  **Analyze the requirements:** Imagine you are testing a new video streaming service. Below is a list of requirements.
2.  **Categorize each requirement:** Determine whether testing each requirement would be considered functional or non-functional testing.
3.  **Suggest a specific test type:** For each requirement, name a more specific type of testing you would perform (e.g., for a non-functional requirement, you might suggest "Load Testing" or "Security Testing").
4.  **Create a table:** Organize your findings in a table with the columns: `Requirement`, `Type (Functional/Non-Functional)`, and `Specific Test Example`.

**Requirements:**

*   The system must allow users to search for videos by title.
*   The website should be easy for users with visual impairments to navigate using a screen reader.
*   The video player must start playing a selected video within 3 seconds of the user clicking "play".
*   The system must prevent unauthorized users from accessing premium content.
*   Users must be able to create a personal playlist and add videos to it.
*   The application must be able to handle 10,000 concurrent users watching videos without crashing.

**Expected Outcome:**
A table that correctly categorizes each requirement and suggests an appropriate, specific type of testing for each one.

**Validation:**
- Are functional requirements correctly identified as relating to the features and business logic?
- Are non-functional requirements correctly identified as relating to performance, usability, security, etc.?
- Are the specific test examples logical for the given requirement?

---

### Exercise 3: Devising a Comprehensive Test Strategy (Advanced/Challenge)

**Learning Objective:** To create a high-level test strategy that incorporates various testing types and levels for a new application.

**Prerequisites:**
- Completion of the previous two exercises.
- Ability to synthesize different testing concepts into a cohesive plan.

**Instructions:**

1.  **Familiarize yourself with the project:** You are the lead QA engineer for a new mobile application for a local library. Key features include:
    *   User registration and login.
    *   Searching the library catalog for books.
    *   Placing a hold on a book.
    *   Viewing current checkouts and due dates.
    *   Receiving push notifications for overdue books.
2.  **Outline a test strategy:** Write a short document (3-4 paragraphs) outlining your test strategy for ensuring the quality of this mobile app.
3.  **Incorporate different testing types and levels:** Your strategy must explain how you would use a mix of testing to achieve comprehensive coverage. Be sure to mention:
    *   **Unit Tests:** What kind of functions would developers be expected to write unit tests for?
    *   **Integration Tests:** What are two key integration points in this app that need to be tested? (e.g., app to the library's main database).
    *   **E2E Tests:** Describe one critical end-to-end scenario that must be automated.
    *   **Functional Testing:** How will you ensure all features work as expected?
    *   **Non-Functional Testing:** Name at least two non-functional aspects that are critical for this app (e.g., performance, usability) and briefly explain how you would test them.

**Expected Outcome:**
A well-reasoned, high-level test strategy that demonstrates how different testing types and levels work together to ensure the quality of the mobile library app.

**Validation:**
- Does the strategy show a clear understanding of how the test pyramid applies to this project?
- Does it address both functional and non-functional aspects of the application?
- Is the strategy appropriate and realistic for the described mobile application?