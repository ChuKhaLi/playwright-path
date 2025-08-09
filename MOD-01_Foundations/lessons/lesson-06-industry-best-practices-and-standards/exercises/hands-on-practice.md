# Lesson 6: Industry Best Practices and Standards - Hands-on Exercises

## Overview

These exercises are designed to bridge the gap between writing code that *works* and writing code that is *maintainable, readable, and robust*. The focus is on applying professional standards to your automation code.

---

### Exercise 1: Code Readability and Commenting (Basic)

**Learning Objective:** To practice improving code readability through better naming and effective commenting.

**Prerequisites:**
- Basic understanding of a programming language (pseudo-code is acceptable).
- Knowledge of what makes code "readable."

**Instructions:**

1.  **Analyze the code snippet:** Review the poorly written pseudo-code below. It is functional but difficult to understand.

    ```
    // This function checks stuff
    function check(data) {
        let x = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].p > 100) {
                x = x + data[i].p;
            }
        }
        return x > 1000;
    }
    ```

2.  **Refactor for readability:** Rewrite the code snippet to improve its readability. You should:
    *   Rename the function and variables to be more descriptive.
    *   Add a clear, concise comment explaining what the function *does* (its purpose), not just *how* it does it.
    *   Assume `data` is a list of products, and `p` is the price of a product.
3.  **Explain your changes:** After rewriting the code, write a short explanation (2-3 bullet points) of the specific changes you made and why they improve the code's quality.

**Expected Outcome:**
A refactored code snippet with clear, self-documenting names and a high-level comment, along with a justification for the changes.

**Validation:**
- Is the new function name a clear verb phrase describing its action (e.g., `isTotalOrderValueOverThreshold`)?
- Are variable names like `x` and `p` replaced with descriptive names (e.g., `totalValue`, `price`)?
- Does the comment explain the business logic rather than just repeating the code's steps?

---

### Exercise 2: Peer Review Simulation (Intermediate)

**Learning Objective:** To practice conducting a constructive code review, identifying violations of best practices.

**Prerequisites:**
- Understanding of common coding best practices (e.g., DRY principle, avoiding magic numbers, using constants).

**Instructions:**

1.  **Assume the role of a peer reviewer:** You are reviewing a new automated test written by a junior colleague. Your goal is to provide helpful, constructive feedback.
2.  **Review the test code:** Read the pseudo-code for the test below. It automates a login test.

    ```typescript
    test('login test', async ({ page }) => {
        await page.goto('https://example.com/login');
        
        // Enter username and password
        await page.locator('#username').fill('testuser');
        await page.locator('#password').fill('Password123');
        await page.locator('button.login-btn').click();

        await page.waitForTimeout(5000); // Wait for login to complete

        const welcomeMsg = await page.locator('.welcome').textContent();
        expect(welcomeMsg).toContain('Welcome, testuser!');

        // Now test logout
        await page.locator('#logout').click();
        await page.goto('https://example.com/login');
    });
    ```

3.  **Write a code review:** Write a short code review (3-4 bullet points). For each point, identify a specific issue in the code that violates a best practice. Explain *why* it's an issue and suggest a *better approach*.

    *   **Hint:** Look for things like hardcoded data, brittle waits, multiple assertions/actions in one test, and unclear test descriptions.

**Expected Outcome:**
A constructive code review that identifies at least three distinct issues, explains the associated risks, and suggests specific improvements based on industry best practices.

**Validation:**
- Does your review address the use of "magic strings" for credentials?
- Does it identify the problem with `waitForTimeout` and suggest a better, web-first assertion or wait strategy?
- Does it point out that the test is doing too much (testing both login and logout) and should be split?

---

### Exercise 3: Designing a Test Data Strategy (Advanced/Challenge)

**Learning Objective:** To design a simple, scalable strategy for managing test data.

**Prerequisites:**
- Understanding of why hardcoding test data is problematic.
- Familiarity with basic data structures like objects or JSON.

**Instructions:**

1.  **Analyze the scenario:** You are building a suite of automated tests for a user registration form. The form has fields for `firstName`, `lastName`, `email`, `password`, and `country`. You will need to test with many different user profiles (e.g., valid users, users with invalid emails, users from different countries).
2.  **Design a data management strategy:** Instead of hardcoding this data in every test script, you need to store it externally. Your task is to design the structure for this external data.
3.  **Create a sample data file:** Create a small sample of your test data in a structured format like JSON.
    *   Your file should contain at least three different user profiles.
    *   Include one "valid" user, one "user with an invalid email," and one "user with a missing required field."
    *   Think about how you would label or organize the data so you can easily grab the "invalid email" user when you need it for a specific test.
4.  **Explain the benefits:** Write a short paragraph explaining how this external data file approach is better than hardcoding data directly in the test scripts. Touch on maintainability, reusability, and scalability.

**Expected Outcome:**
A sample JSON file containing structured test data for multiple user profiles, along with a clear explanation of the advantages of this approach.

**Example JSON Structure:**
```json
{
  "validUser": {
    "firstName": "John",
    "lastName": "Doe",
    ...
  },
  "invalidEmailUser": {
    ...
  }
}
```

**Validation:**
- Is the JSON data well-structured and easy to read?
- Does the structure make it easy to select a specific type of user for a test?
- Does your explanation correctly identify the key benefits of separating test data from test logic?