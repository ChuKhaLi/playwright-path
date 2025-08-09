# Lesson 2: Understanding Software Testing Fundamentals - Hands-on Exercises

## Overview

These exercises are designed to solidify your understanding of core software testing concepts. They focus on applying fundamental principles like the STLC, bug reporting, and test case design to practical, real-world scenarios.

---

### Exercise 1: Deconstructing the STLC (Basic)

**Learning Objective:** To understand and map real-world testing activities to the stages of the Software Testing Life Cycle (STLC).

**Prerequisites:**
- A clear understanding of the six phases of the STLC (Requirement Analysis, Test Planning, Test Case Development, Test Environment Setup, Test Execution, Test Cycle Closure).
- Access to the internet for research.

**Instructions:**

1.  **Choose a simple feature:** Imagine you are tasked with testing the "user login" functionality of a new web application.
2.  **Brainstorm testing activities:** List at least one specific activity a QA engineer would perform for each of the six STLC phases for this "user login" feature.
    *   *Example for Test Planning:* "Estimate the time required to test the login page."
3.  **Create a table:** Organize your brainstormed activities into a table with two columns: `STLC Phase` and `Testing Activity for Login Feature`.

**Expected Outcome:**
A table that clearly lists a relevant, practical testing activity for each of the six STLC phases, all related to testing a user login feature.

**Validation:**
- Is each activity correctly matched to its corresponding STLC phase?
- Are the activities specific and realistic for testing a login feature?

---

### Exercise 2: Writing an Effective Bug Report (Intermediate)

**Learning Objective:** To practice writing a clear, concise, and effective bug report.

**Prerequisites:**
- Understanding of the key components of a good bug report (e.g., title, steps to reproduce, expected vs. actual results, severity/priority).

**Instructions:**

1.  **Analyze the scenario:**
    *   **Application:** A simple e-commerce website.
    *   **Bug:** When a user adds a specific item (e.g., "Vintage Leather Jacket") to their cart and then tries to check out, the "Total Price" displayed in the summary is `$0.00` instead of the correct price. This only happens for this specific item and only in the Chrome browser.
2.  **Write a bug report:** Based on the scenario, write a complete bug report. Use a standard format.
3.  **Include all essential components:**
    *   **Bug ID:** (You can make one up, e.g., `BUG-101`)
    *   **Title:** A short, descriptive summary of the bug. (e.g., "Checkout total is $0.00 for 'Vintage Leather Jacket' on Chrome")
    *   **Environment:** (e.g., Browser, OS)
    *   **Steps to Reproduce:** A numbered list of the exact steps to trigger the bug.
    *   **Expected Result:** What should have happened?
    *   **Actual Result:** What actually happened?
    *   **Severity:** How critical is the bug's impact? (e.g., Critical, Major, Minor)
    *   **Priority:** How urgently does it need to be fixed? (e.g., High, Medium, Low)
    *   **Attachments:** (Mention that you would attach a screenshot or video, e.g., "Screenshot of checkout page attached.")

**Expected Outcome:**
A well-structured and detailed bug report that a developer could use to quickly understand, reproduce, and fix the issue.

**Validation:**
- Does the title clearly and concisely describe the problem?
- Are the steps to reproduce easy to follow and unambiguous?
- Is the distinction between expected and actual results clear?
- Is the severity/priority assignment logical for this type of bug?

---

### Exercise 3: Designing Test Cases (Advanced/Challenge)

**Learning Objective:** To design a set of positive and negative test cases for a given feature.

**Prerequisites:**
- Understanding of test cases, positive testing, and negative testing.

**Instructions:**

1.  **Consider the feature:** You are testing a "Create Password" field for a new user registration form. The requirements for the password are:
    *   Must be between 8 and 16 characters long.
    *   Must contain at least one uppercase letter.
    *   Must contain at least one lowercase letter.
    *   Must contain at least one number.
2.  **Design test cases:** Create a set of test cases to verify this functionality. Your goal is to be thorough.
3.  **Create a table:** Structure your test cases in a table with the following columns:
    *   `Test Case ID` (e.g., `PW-01`)
    *   `Test Case Type` (Positive or Negative)
    *   `Description` (What are you testing?)
    *   `Test Data (Password)` (The exact password string to use for testing)
    *   `Expected Result` (e.g., "Password accepted," "Error message: 'Password must contain a number.'")
4.  **Include a variety of scenarios:**
    *   **Positive:** A valid password that meets all criteria.
    *   **Negative (Boundary):** Passwords that are too short (7 chars) or too long (17 chars).
    *   **Negative (Composition):** Passwords that are missing an uppercase letter, a lowercase letter, or a number.
    *   **Challenge:** Think of other edge cases. What about a password with special characters? Or one that is exactly 8 or 16 characters?

**Expected Outcome:**
A comprehensive table of test cases (aim for at least 5-7 cases) that covers both positive and negative scenarios for the password creation feature.

**Validation:**
- Have you included at least one valid (positive) test case?
- Have you covered all the specified requirements with negative test cases?
- Are your expected results clear and specific for each test case?