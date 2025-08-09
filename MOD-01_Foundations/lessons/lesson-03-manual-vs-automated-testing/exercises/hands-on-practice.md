# Lesson 3: Manual vs. Automated Testing - Hands-on Exercises

## Overview

These exercises focus on the critical skill of deciding when to use manual testing and when to use automated testing. The goal is to move beyond definitions and apply a cost-benefit analysis to real-world testing scenarios.

---

### Exercise 1: Categorizing Test Scenarios (Basic)

**Learning Objective:** To practice identifying whether a given test scenario is better suited for manual or automated testing.

**Prerequisites:**
- A solid understanding of the strengths and weaknesses of both manual and automated testing.

**Instructions:**

1.  **Review the scenarios:** Read through the list of test scenarios below.
2.  **Decide the best approach:** For each scenario, decide if it should be tested manually or with automation.
3.  **Justify your choice:** Provide a brief but clear reason for your decision.
4.  **Create a table:** Organize your answers in a table with three columns: `Test Scenario`, `Best Approach (Manual/Automated)`, and `Justification`.

**Test Scenarios:**

*   Verifying the look and feel of a newly designed "About Us" page.
*   Checking the core login functionality with 100 different valid username/password combinations.
*   Testing the user experience of a complex, multi-step workflow for the very first time.
*   Running a full regression suite on the application after a minor code change.
*   Verifying that an error message is displayed correctly when a user enters an invalid email format.
*   Conducting exploratory testing on a new, experimental feature.

**Expected Outcome:**
A table that correctly categorizes each scenario and provides a logical justification based on the principles of manual and automated testing.

**Validation:**
- Do your justifications align with the known strengths of each testing approach? (e.g., Manual for usability/UX, Automation for repetitive tasks).
- Is your reasoning clear and concise?

---

### Exercise 2: The Hybrid Approach (Intermediate)

**Learning Objective:** To understand how manual and automated testing can be used together to test a single feature effectively.

**Prerequisites:**
- Completion of Exercise 1.
- Ability to think about a feature from multiple testing perspectives.

**Instructions:**

1.  **Consider the feature:** You are responsible for testing a new "File Upload" feature on a web application. The feature allows users to upload a profile picture.
2.  **Identify manual test cases:** List 2-3 test cases for this feature that are best performed **manually**. Think about aspects that require human judgment.
    *   *Example:* "Verify that the chosen image looks good and is not distorted after being uploaded and cropped."
3.  **Identify automated test cases:** List 2-3 test cases for this feature that are ideal for **automation**. Think about repetitive checks and validations.
    *   *Example:* "Verify that the system correctly rejects files that are larger than the 5MB limit."
4.  **Explain your reasoning:** For each list, write a short paragraph explaining *why* you chose those test cases for that specific approach.

**Expected Outcome:**
Two distinct lists of test cases (one manual, one automated) for the same feature, with clear explanations for why each approach is appropriate for the chosen tests.

**Validation:**
- Do the manual test cases focus on subjective aspects like usability, aesthetics, or exploration?
- Do the automated test cases focus on objective, repeatable, and data-driven checks?
- Does your explanation demonstrate a clear understanding of a hybrid testing strategy?

---

### Exercise 3: Automation Strategy and ROI Analysis (Advanced/Challenge)

**Learning Objective:** To create a high-level automation strategy for a project and justify it based on potential Return on Investment (ROI).

**Prerequisites:**
- Understanding of what a test strategy is.
- Ability to think about long-term project goals.

**Instructions:**

1.  **Analyze the scenario:** A development team is building a new online banking application. The application will have features like user login, balance inquiry, fund transfers, and bill payments. Security and accuracy are the top priorities. The application will be updated with new features every month.
2.  **Develop a high-level testing strategy:** Write a short document (2-3 paragraphs) outlining a testing strategy for this project. Your strategy must decide what to automate first and what to keep manual for now.
3.  **Address key points in your strategy:**
    *   **What to Automate First:** Which features or types of tests should be the first candidates for automation? (Hint: Think about regression, critical paths).
    *   **What to Keep Manual:** What kind of testing should remain manual, especially in the early stages? (Hint: Think about new features, UI/UX).
    *   **Justification (The ROI):** Explain *why* this is a good strategy. How will it help the project in the long run? Connect your decisions to concepts like:
        *   Reducing regression testing time.
        *   Ensuring core features are always stable.
        *   Allowing manual testers to focus on high-impact areas.
        *   Increasing test coverage over time.

**Expected Outcome:**
A clear and concise testing strategy that prioritizes automation efforts effectively and justifies the approach with a strong ROI argument.

**Validation:**
- Does your strategy correctly identify the most critical and repetitive features as top automation priorities?
- Does your ROI justification connect the automation effort to tangible benefits like speed, reliability, and cost savings?
- Is the strategy realistic for a project with monthly releases?