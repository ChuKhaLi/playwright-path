# Lesson 10: Capstone Project Assessment Rubric

## 1. Overview

This document outlines the criteria by which your capstone project will be evaluated. The project is designed to assess your ability to synthesize and apply the advanced concepts of API test architecture and contract testing in a practical, realistic scenario.

## 2. Grading Breakdown

Your final grade will be based on the following components:

-   **Test Framework Architecture (40%)**
-   **Testing Strategy Implementation (40%)**
-   **Documentation and Strategy (20%)**

---

## 3. Detailed Rubric

### a. Test Framework Architecture (40%)

| Criteria | Novice (0-5 pts) | Competent (6-8 pts) | Proficient (9-10 pts) |
| :--- | :--- | :--- | :--- |
| **Structure & Separation of Concerns** | Code is disorganized; little to no separation of concerns. | A basic structure exists, but some components are misplaced. | A clean, logical, and scalable directory structure is implemented. |
| **BaseApiClient** | No base client; API calls are duplicated in tests. | A base client exists but lacks robust error handling or retries. | A `BaseApiClient` with solid error handling and a retry mechanism is implemented. |
| **Configuration** | Configuration is hardcoded in tests. | Configuration is centralized but does not support multiple environments easily. | A clean, environment-aware configuration system is in place. |
| **Design Patterns** | No clear design patterns are used. | At least one pattern (e.g., Factory) is used, but not consistently. | Repository, Factory, and Builder patterns are correctly implemented and used appropriately. |
| **Custom Fixtures** | No custom fixtures; setup is done manually in each test file. | A basic fixture is created but may not be well-structured or reusable. | Clean, reusable, and dependent fixtures are created to provide clients/repositories to tests. |

### b. Testing Strategy Implementation (40%)

| Criteria | Novice (0-5 pts) | Competent (6-8 pts) | Proficient (9-10 pts) |
| :--- | :--- | :--- | :--- |
| **Schema Validation** | No schema validation is performed. | Schema validation is done for only one endpoint or is not well-integrated. | Schema validation is integrated into the framework and applied to all relevant tests. |
| **Contract Testing (Pact)** | No contract tests are implemented. | A consumer test is written, but it may be incomplete or the pact file is not generated correctly. | A complete consumer test is implemented, generating a valid pact file. The provider verification strategy is well-described. |
| **Functional Test Coverage** | Only one simple "happy path" test is covered. | Several flows are tested, but edge cases or failure paths are missed. | Critical success and failure paths are tested, demonstrating a good understanding of the business logic. |
| **Test Readability & Quality** | Tests are hard to read and contain duplicated code. | Tests are functional but could be cleaner or more expressive. | Tests are clean, readable, and follow the AAA pattern. They use fixtures and factories effectively. |

### c. Documentation and Strategy (20%)

| Criteria | Novice (0-5 pts) | Competent (6-8 pts) | Proficient (9-10 pts) |
| :--- | :--- | :--- | :--- |
| **README.md** | README is missing or provides no useful information. | README exists but is missing key setup or execution instructions. | A clear, professional README explains the project and provides easy-to-follow setup instructions. |
| **TESTING_STRATEGY.md** | Strategy document is missing. | The document is present but lacks detail or clear justification for decisions. | A well-written strategy document clearly explains the architecture, testing approach, and justifies the key decisions made. |

---

## 4. Final Submission Checklist

Before submitting your project, ensure you have:
-   [ ] A working test framework that runs without errors.
-   [ ] All required test types implemented (Schema, Contract, Functional).
-   [ ] A root `README.md` file.
-   [ ] A `TESTING_STRATEGY.md` document.
-   [ ] A clean and well-organized codebase with comments where necessary.