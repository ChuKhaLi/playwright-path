# Lesson 9: Capstone Project Assessment Rubric

## Overview

This rubric will be used to evaluate your capstone project. The focus is on the quality of your architectural design, the clarity of your documentation, and the implementation of the core required features.

---

### 1. Architectural Design & Documentation (40 points)

-   **`README.md` Quality (20 pts):**
    -   Is the `README.md` clear, professional, and well-written?
    -   Does it thoroughly explain the framework architecture?
    -   Does it justify the key design decisions (directory structure, POM strategy, etc.)?
    -   Does it provide clear instructions for setup and execution?
-   **Directory Structure (10 pts):**
    -   Is the directory structure logical, scalable, and does it follow a clear pattern?
-   **Code Ownership & Organization (10 pts):**
    -   Is there a clear and sensible tagging strategy?
    -   Is there a well-defined `CODEOWNERS` file?

---

### 2. Framework Implementation (40 points)

-   **Advanced POM (15 pts):**
    -   Is there a `BasePage`?
    -   Are components (e.g., `HeaderComponent`) used effectively?
    -   Are fluent interfaces used for page transitions?
-   **Data Management (10 pts):**
    -   Are static data (credentials) loaded from an external JSON file?
    -   Is a Test Data Factory pattern implemented correctly?
-   **Cross-Platform Support (10 pts):**
    -   Is the `playwright.config.ts` set up for both desktop and mobile?
    -   Do the tests correctly handle responsive differences?
-   **Fixtures (5 pts):**
    -   Are custom fixtures used to reduce boilerplate and set up test states?

---

### 3. Test Implementation (10 points)

-   **Required Scenarios (10 pts):**
    -   Are all four required test scenarios implemented correctly?
        -   E2E checkout flow (`@smoke`)
        -   Data-driven login test
        -   Cross-platform responsive test
        -   Mocked API test (`page.route`)

---

### 4. CI/CD Pipeline (10 points)

-   **`ci.yml` Quality (10 pts):**
    -   Does the pipeline have multiple, dependent stages?
    -   Does it use different triggers (`pull_request`, `push`) for different jobs?
    -   Does it correctly use `--grep` to run different test suites?
    -   Does it include optimizations like sharding or caching?

---

### **Total Score: 100 points**